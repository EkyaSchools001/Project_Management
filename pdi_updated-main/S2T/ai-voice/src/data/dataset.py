import torch
from datasets import load_dataset, DatasetDict
from transformers import AutoProcessor
from typing import Dict, Any

from src.data.augmentation import AudioAugmenter
from src.data.normalization import EducationNormalizer

class ASRDataset:
    """
    Wrapper for loading and preparing datasets for Whisper fine-tuning.
    Ensures audio is 16kHz and applies text normalization.
    """
    def __init__(self, model_id: str = "openai/whisper-tiny", language: str = None, task: str = "transcribe", is_training: bool = True):
        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            # For multilingual Whisper, specifying task/language ensures correct prompt tokens
            if language:
                self.processor = AutoProcessor.from_pretrained(model_id, language=language, task=task)
            else:
                self.processor = AutoProcessor.from_pretrained(model_id)

        self.augmenter = AudioAugmenter(sample_rate=16000)
        self.normalizer = EducationNormalizer()
        self.is_training = is_training
        
    def prepare_dataset(self, batch: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processes a single batch:
        1. Loads audio array.
        2. Optionally applies augmentation.
        3. Extracts log-Mel spectrogram features via processor.
        4. Normalizes text and tokenizes.
        """
        audio = batch["audio"]
        
        # Manually decode raw bytes or path if HF Audio(decode=False) was used
        if isinstance(audio, dict) and "bytes" in audio and audio["bytes"] is not None:
            import soundfile as sf
            import io
            with io.BytesIO(audio["bytes"]) as buf:
                audio_array, sampling_rate = sf.read(buf)
        elif isinstance(audio, dict) and "path" in audio and audio["path"] is not None:
            import soundfile as sf
            audio_array, sampling_rate = sf.read(audio["path"])
        else:
            audio_array = audio["array"]
            sampling_rate = audio["sampling_rate"]
        
        # Ensure 16kHz - datasets map usually handles resampling if we cast_column
        # We assume dataset has been cast to 16kHz by the caller
            
        if self.is_training:
             audio_array = self.augmenter.apply_augmentations(audio_array)
             
        # Extract features (Log-Mel Spectrogram)
        batch["input_features"] = self.processor.feature_extractor(
            audio_array, sampling_rate=16000
        ).input_features[0]

        # Normalize and Tokenize labels
        normalized_text = self.normalizer.normalize(batch["text"])
        batch["labels"] = self.processor.tokenizer(normalized_text).input_ids
        
        return batch

class DataCollatorSpeechSeq2SeqWithPadding:
    """
    Data collator that dynamically pads the inputs and labels received.
    """
    def __init__(self, processor):
        self.processor = processor

    def __call__(self, features):
        # Pad input features to max length
        input_features = [{"input_features": feature["input_features"]} for feature in features]
        batch = self.processor.feature_extractor.pad(input_features, return_tensors="pt")

        # Pad labels to max length
        label_features = [{"input_ids": feature["labels"]} for feature in features]
        labels_batch = self.processor.tokenizer.pad(label_features, return_tensors="pt")

        # Replace padding with -100 to ignore loss correctly
        labels = labels_batch["input_ids"].masked_fill(labels_batch.attention_mask.ne(1), -100)

        # If bos token is appended in previous tokenization step,
        # cut bos token here as it's append later anyways
        if (labels[:, 0] == self.processor.tokenizer.bos_token_id).all().cpu().item():
            labels = labels[:, 1:]

        batch["labels"] = labels
        return batch
