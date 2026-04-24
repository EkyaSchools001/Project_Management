import argparse
import os
import torch
import numpy as np
from datasets import load_dataset, Audio
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq, Seq2SeqTrainingArguments, Seq2SeqTrainer
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

from src.data.dataset import ASRDataset, DataCollatorSpeechSeq2SeqWithPadding

def train(args):
    """
    Fine-tunes Whisper using LoRA (Low-Rank Adaptation) on the given dataset.
    """
    print(f"Loading base model: {args.model_name}")
    processor = AutoProcessor.from_pretrained(args.model_name)
    
    model = AutoModelForSpeechSeq2Seq.from_pretrained(
        args.model_name,
        device_map="auto" if torch.cuda.is_available() else None,
    )
    
    # 1. PEFT / LoRA Setup
    model.config.forced_decoder_ids = None
    model.config.suppress_tokens = []
    
    # Int8 prep if needed: model = prepare_model_for_kbit_training(model)
    peft_config = LoraConfig(r=args.lora_r, lora_alpha=args.lora_alpha, target_modules=["q_proj", "v_proj"], lora_dropout=0.05, bias="none")
    model = get_peft_model(model, peft_config)
    
    model.print_trainable_parameters()

    # 2. Data Preparation
    print(f"Loading dataset: {'MOCK' if args.mock_data else 'Real Data'}")
    if args.mock_data:
        # Generate entirely synthetic dataset to bypass torchcodec/ffmpeg Windows issues
        from datasets import Dataset
        print("Generating synthetic audio tensors for mock training...")
        dummy_data = {
            "audio": [{"array": np.random.randn(16000).astype(np.float32), "sampling_rate": 16000} for _ in range(16)],
            "text": ["This is a synthetic mock classroom lecture."] * 16,
        }
        dataset = Dataset.from_dict(dummy_data)
        encoded_dataset = {}
        
        # Manually encode since we bypass HF Audio casting
        asr_data_handler = ASRDataset(model_id=args.model_name)
        def prepare_dataset_fn(batch):
            return asr_data_handler.prepare_dataset(batch)
            
        encoded_dataset["train"] = dataset.map(prepare_dataset_fn, remove_columns=["audio"])
        encoded_dataset["test"] = encoded_dataset["train"]
    else:
        # Load standard HF dataset with split logic
        print(f"Loading real dataset from HuggingFace: {args.dataset_name}")
        train_split = "validation[:1000]" # Expanded from 100 to 1000 for better precision
        eval_split = "validation[1000:1100]"
        
        dataset_train = load_dataset(args.dataset_name, "clean", split=train_split)
        dataset_eval = load_dataset(args.dataset_name, "clean", split=eval_split)
        
        # Enforce raw byte loading (bypasses FFmpeg/torchcodec natively)
        dataset_train = dataset_train.cast_column("audio", Audio(decode=False))
        dataset_eval = dataset_eval.cast_column("audio", Audio(decode=False))
        
        asr_data_handler = ASRDataset(model_id=args.model_name, language=args.language, task=args.task)
        def prepare_dataset_fn(batch):
            return asr_data_handler.prepare_dataset(batch)
            
        print("Processing train split...")
        encoded_train = dataset_train.map(prepare_dataset_fn, remove_columns=["audio"])
        
        print("Processing eval split...")
        encoded_eval = dataset_eval.map(prepare_dataset_fn, remove_columns=["audio"])
        
        encoded_dataset = {"train": encoded_train, "test": encoded_eval}
        
    data_collator = DataCollatorSpeechSeq2SeqWithPadding(processor=processor)

    # 3. Training Arguments
    training_args = Seq2SeqTrainingArguments(
        output_dir=args.output_dir,
        per_device_train_batch_size=args.batch_size,
        gradient_accumulation_steps=args.grad_accum,
        learning_rate=args.learning_rate,
        # mixed precision
        fp16=torch.cuda.is_available(),
        max_steps=args.max_steps,
        logging_steps=10,
        eval_strategy="steps",
        eval_steps=50,
        save_strategy="steps",
        save_steps=50,
        remove_unused_columns=False,
        label_names=["labels"],
    )

    # 4. Trainer
    trainer = Seq2SeqTrainer(
        args=training_args,
        model=model,
        train_dataset=encoded_dataset["train"],
        eval_dataset=encoded_dataset["test"],
        data_collator=data_collator,
        processing_class=processor.feature_extractor,
    )

    print("Starting training...")
    trainer.train()
    
    # Save the ultimate adapter
    peft_model_id = os.path.join(args.output_dir, "final_lora_weights")
    model.save_pretrained(peft_model_id)
    processor.save_pretrained(peft_model_id)
    print(f"Saved LoRA weights to {peft_model_id}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model_name", type=str, default="openai/whisper-small")
    parser.add_argument("--dataset_name", type=str, default="librispeech_asr")
    parser.add_argument("--language", type=str, default=None, help="Target language code (e.g., 'es' for Spanish, 'hi' for Hindi). None for auto-detect.")
    parser.add_argument("--task", type=str, default="transcribe", choices=["transcribe", "translate"])
    parser.add_argument("--mock_data", action="store_true", help="Use a tiny dataset to verify the pipeline runs.")
    parser.add_argument("--output_dir", type=str, default="./models/edu_whisper")
    parser.add_argument("--batch_size", type=int, default=4)
    parser.add_argument("--grad_accum", type=int, default=4)
    parser.add_argument("--learning_rate", type=float, default=1e-3) # Higher for LoRA
    parser.add_argument("--lora_r", type=int, default=32) # Increased from 16
    parser.add_argument("--lora_alpha", type=int, default=64) # Proportional to rank
    parser.add_argument("--max_steps", type=int, default=500) # Increased from 100
    
    args = parser.parse_args()
    train(args)
