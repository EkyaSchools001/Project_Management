import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor
from optimum.onnxruntime import ORTModelForSpeechSeq2Seq
import os

def export_to_onnx(model_id: str, output_dir: str):
    """
    Exports a HuggingFace Whisper model to ONNX format for efficient 
    desktop/edge inference using the optimum library.
    """
    print(f"Exporting model {model_id} to ONNX...")
    
    # Load model using Optimum ORT wrapper
    model = ORTModelForSpeechSeq2Seq.from_pretrained(
        model_id, 
        export=True,
        # Quantize to INT8 or FP16 for edge
        # provider="CPUExecutionProvider" # Or CUDAExecutionProvider
    )
    
    processor = AutoProcessor.from_pretrained(model_id)
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Save the exported model and processor
    model.save_pretrained(output_dir)
    processor.save_pretrained(output_dir)
    print(f"Exported successfully to {output_dir}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--model_id", type=str, default="openai/whisper-tiny")
    parser.add_argument("--output_dir", type=str, default="./models/onnx_whisper")
    args = parser.parse_args()
    
    export_to_onnx(args.model_id, args.output_dir)
