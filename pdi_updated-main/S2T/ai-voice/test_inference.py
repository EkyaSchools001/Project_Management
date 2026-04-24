import urllib.request
import librosa
import torch
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq
from src.data.normalization import EducationNormalizer

def run_inference_test():
    print("Initializing ASR Inference Test...")
    
    # 1. Initialize Normalizer and Model
    normalizer = EducationNormalizer()
    model_name = "openai/whisper-tiny.en"  # Using tiny.en for fast local execution
    
    print(f"Loading Base Model: {model_name}")
    processor = AutoProcessor.from_pretrained(model_name)
    model = AutoModelForSpeechSeq2Seq.from_pretrained(model_name)
    model.eval()

    # 2. Fetch a sample audio file (LibriSpeech clean sample from HuggingFace)
    audio_url = "https://huggingface.co/datasets/Narsil/asr_dummy/resolve/main/1.flac"
    local_audio_path = "sample_audio.flac"
    
    try:
        print(f"Downloading sample audio from NASA...")
        # Note: We use a well-known NASA public audio clip as a proxy for a lecture
        # The URL requires a proper user agent to bypass basic blocks
        req = urllib.request.Request(audio_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(local_audio_path, 'wb') as out_file:
            out_file.write(response.read())
    except Exception as e:
        print(f"Failed to download audio. Generating dummy tone for testing instead.\n{e}")
        # Generating a 3 second dummy noise wave if download fails
        import numpy as np
        import soundfile as sf
        dummy_audio = np.random.randn(16000 * 3).astype(np.float32) * 0.1
        sf.write(local_audio_path, dummy_audio, 16000)

    # 3. Transcribe
    print("\nProcessing Audio...")
    # Load just the first 10 seconds to keep inference time fast for the demo
    audio_array, sr = librosa.load(local_audio_path, sr=16000, duration=10.0)
    
    inputs = processor(audio_array, sampling_rate=16000, return_tensors="pt")
    
    print("Generating Transcription (GPU/CPU inference)...")
    with torch.no_grad():
        predicted_ids = model.generate(inputs["input_features"], max_new_tokens=100)
    
    raw_transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
    
    print("\n" + "="*50)
    print("AS-IS TRANSCRIPTION OUTPUT:")
    print("="*50)
    print(raw_transcription.strip())
    
    print("\n" + "="*50)
    print("EDUCATION DOMAIN NORMALIZED OUTPUT:")
    print("="*50)
    normalized_text = normalizer.normalize(raw_transcription)
    print(normalized_text.strip())
    print("="*50 + "\n")

if __name__ == "__main__":
    run_inference_test()
