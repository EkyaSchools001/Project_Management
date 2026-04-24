import sys
import re
sys.modules['regex'] = re # Bypasses blocked DLL by using built-in re module

import torch
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq
from peft import PeftModel
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import librosa
import soundfile as sf
import io
import httpx
from src.data.normalization import EducationNormalizer

app = FastAPI(title="Education ASR Cloud API")

# Allow CORS for local frontend testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For testing purposes only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global models
processor = None
model = None
normalizer = None

@app.on_event("startup")
async def load_model():
    global processor, model, normalizer
    # Load base model + LoRA
    base_model_name = "openai/whisper-small" # Upgraded to small for better precision
    processor = AutoProcessor.from_pretrained(base_model_name)
    base_model = AutoModelForSpeechSeq2Seq.from_pretrained(base_model_name)
    
    # Init Text Normalizer
    normalizer = EducationNormalizer()
    
    lora_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "models", "edu_whisper", "final_lora_weights"))
    if os.path.exists(lora_path):
        print(f"Loading Custom LoRA Adapter constraints from: {lora_path}")
        model = PeftModel.from_pretrained(base_model, lora_path)
    else:
        print("Starting in RAW base model mode.")
        model = base_model # Using base for fallback
        
    model.eval()
    if torch.cuda.is_available():
        model.to("cuda")

@app.post("/transcribe/batch")
async def transcribe_batch(
    file: UploadFile = File(...),
    language: str = Form(None),
    task: str = Form("transcribe")
):
    """
    Expects a single audio file via form upload.
    Returns the raw transcription and the normalized transcription.
    """
    global processor, model, normalizer
    
    if not file.filename.endswith(('.wav', '.mp3', '.flac', '.webm', '.ogg')):
        return {"error": "Unsupported file format. Use wav, mp3, flac, webm, or ogg."}
    
    # Save temp file
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await file.read())
        
    try:
        # Load audio using soundfile explicitly to bypass ffmpeg
        audio_array, sr = sf.read(temp_path)
        
        # Whisper requires 16000 Hz, simple decimation if needed
        if sr != 16000:
            audio_array = librosa.resample(y=audio_array, orig_sr=sr, target_sr=16000)

        # Process exactly as we do in training
        inputs = processor(audio_array, sampling_rate=16000, return_tensors="pt")
        if torch.cuda.is_available():
            inputs = inputs.to("cuda")

        # Generate constraints (like language translation!)
        generate_kwargs = {}
        if language:
            generate_kwargs["language"] = language
        if task:
            generate_kwargs["task"] = task
            
        with torch.no_grad():
            predicted_ids = model.generate(inputs.input_features, **generate_kwargs)

        transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
        
        # Apply normalization
        normalized_transcription = normalizer.normalize(transcription)

        return {
            "transcription": transcription,
            "normalized": normalized_transcription
        }
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/transcribe/url")
async def transcribe_url(
    url: str = Form(...),
    language: str = Form("en"),
    task: str = Form("transcribe")
):
    """
    Downloads audio from a URL and transcribes it.
    """
    global processor, model, normalizer
    
    temp_path = f"temp_remote_audio_{os.getpid()}.wav"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, follow_redirects=True)
            if response.status_code != 200:
                return {"error": f"Failed to download audio from URL. Status: {response.status_code}"}
            
            with open(temp_path, "wb") as f:
                f.write(response.content)

        # Load audio
        audio_array, sr = sf.read(temp_path)
        
        if sr != 16000:
            audio_array = librosa.resample(y=audio_array, orig_sr=sr, target_sr=16000)

        inputs = processor(audio_array, sampling_rate=16000, return_tensors="pt")
        if torch.cuda.is_available():
            inputs = inputs.to("cuda")

        generate_kwargs = {"language": language, "task": task}
            
        with torch.no_grad():
            predicted_ids = model.generate(inputs.input_features, **generate_kwargs)

        transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
        normalized_transcription = normalizer.normalize(transcription)

        return {
            "transcription": transcription,
            "normalized": normalized_transcription
        }
    except Exception as e:
        return {"error": f"Error processing remote audio: {str(e)}"}
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/health")
async def health():
    return {"status": "healthy", "gpu": torch.cuda.is_available()}

# Serve static directory containing index.html
static_dir = os.path.dirname(os.path.abspath(__file__))
app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
