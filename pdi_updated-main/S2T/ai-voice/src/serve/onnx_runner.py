import librosa
from optimum.onnxruntime import ORTModelForSpeechSeq2Seq
from transformers import AutoProcessor
import argparse

class ONNXRunner:
    """
    Inference class for edge/desktop deployment using the exported ONNX model.
    Bypasses PyTorch entirely.
    """
    def __init__(self, model_dir: str):
        self.processor = AutoProcessor.from_pretrained(model_dir)
        self.model = ORTModelForSpeechSeq2Seq.from_pretrained(
            model_dir,
            provider="CPUExecutionProvider" # Use core CPU for edge, no CUDA dependency
        )
        
    def transcribe(self, audio_path: str) -> str:
        # Resample enforcing 16kHz
        audio_array, _ = librosa.load(audio_path, sr=16000)
        
        inputs = self.processor(audio_array, sampling_rate=16000, return_tensors="pt")
        
        # Generation step uses ONNX Runtime graph backend
        predicted_ids = self.model.generate(inputs["input_features"])
        transcription = self.processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
        
        return transcription

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model_dir", type=str, required=True, help="Path to ORT exported model")
    parser.add_argument("--audio", type=str, required=True, help="Path to wav file")
    
    args = parser.parse_args()
    
    runner = ONNXRunner(args.model_dir)
    print(runner.transcribe(args.audio))
