from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import uvicorn
import whisper
import g4f
import json
import imageio_ffmpeg

# Inject ffmpeg path for whisper
os.environ["PATH"] += os.pathsep + os.path.dirname(imageio_ffmpeg.get_ffmpeg_exe())

import retrieval # Local ML retrieval module

app = FastAPI(title="PDI AI Machine Learning Service")

# Load Whisper model globally
print("Loading Whisper model...")
try:
    whisper_model = whisper.load_model("base")
except Exception as e:
    print(f"Warning: Failed to load whisper model - {e}")
    whisper_model = None

class GoalRequest(BaseModel):
    teacher_context: str
    focus_areas: List[str]

class EvidenceRequest(BaseModel):
    content: str
    filename: Optional[str] = None


class PDRecommendationRequest(BaseModel):
    teacher_context: str
    focus_areas: list[str]
    available_courses: list[dict]

class ReflectionAnalysisRequest(BaseModel):
    text: str

class EvidenceScoringRequest(BaseModel):
    content: str
    category: str

class ChatRequest(BaseModel):
    message: str
    history: list = []
    context: dict = {}
    system_prompt: str = ""

@app.get("/health")
def health_check():
    return {"status": "ok", "models_loaded": {
        "whisper": whisper_model is not None,
        "retrieval_engine": retrieval.engine.matrix is not None,
        "g4f_available": True
    }}


@app.post("/api/v1/ai/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribes classroom audio into text using Whisper
    """
    if not whisper_model:
        raise HTTPException(status_code=500, detail="Whisper model not loaded properly.")
    
    temp_file_path = f"temp_{file.filename}"
    try:
        with open(temp_file_path, "wb") as f:
            f.write(await file.read())
        
        result = whisper_model.transcribe(temp_file_path)
        
        return {"transcript": result["text"], "language": result.get("language", "unknown")}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@app.post("/api/v1/ai/tag-evidence")
async def tag_evidence(req: EvidenceRequest):
    """
    Tags uploaded evidence with Danielson Framework domains using g4f
    """
    try:
        system_prompt = '''You are an expert instructional evaluator based on the Danielson Framework.
Analyze the following evidence content and filename. Identify the specific domains and elements of professional teaching practice this evidence aligns with. 
Return EXACTLY a JSON list of strings (tags). Example: ["Domain 1: Planning", "1c: Outcomes", "Formative Assessment"]. Do not include extra text.'''
        
        user_message = f"Filename: {req.filename or 'N/A'}\nContent snippet/summary: {req.content}"
        
        response = g4f.ChatCompletion.create(
            model=g4f.models.default,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )
        
        text = response.strip()
        if text.startswith('```json'):
            text = text.replace('```json', '').replace('```', '').strip()
        elif text.startswith('```'):
            text = text.replace('```', '').strip()
            
        tags = json.loads(text)
        return {"tags": tags}
    except Exception as e:
        print(f"Error tagging evidence: {e}")
        # Fallback
        return {"tags": ["General Evidence", "Professional Practice"]}


@app.post("/api/v1/ai/generate-goals")
async def generate_goals(request: GoalRequest):
    try:
        prompt = f"""
        Act as an expert educational coach. Based on the teacher context and focus areas below, 
        generate 3 SMART (Specific, Measurable, Achievable, Relevant, Time-bound) goals.
        Teacher Context: {request.teacher_context}
        Focus Areas: {", ".join(request.focus_areas)}
        
        Return the result as a JSON list of objects with fields: title, description, actionSteps (list), category.
        """
        response = g4f.ChatCompletion.create(
            model=g4f.models.gpt_35_turbo,
            messages=[{"role": "user", "content": prompt}]
        )
        # Simple cleanup if the response is wrapped in code blocks
        clean_resp = str(response).replace("```json", "").replace("```", "").strip()
        data = json.loads(clean_resp)
        return {"suggestions": data}
    except Exception as e:
        print(f"Error generating goals: {e}")
        return {"suggestions": [{
            "title": "Improve Student Engagement",
            "description": "Utilize targeted strategies to enhance student outcomes.",
            "actionSteps": ["Review framework", "Implement changes", "Self-reflect"],
            "category": request.focus_areas[0] if request.focus_areas else "General"
        }]}

@app.post("/api/v1/ai/recommend-pd")
async def recommend_pd(request: PDRecommendationRequest):
    try:
        prompt = f"""
        Teacher Profile: {request.teacher_context}
        Focus Areas: {", ".join(request.focus_areas)}
        Available Courses: {json.dumps(request.available_courses)}
        
        Suggest exactly 2 courses from the available list that best match this teacher's needs.
        Return as a JSON list of course objects.
        """
        response = g4f.ChatCompletion.create(
            model=g4f.models.gpt_35_turbo,
            messages=[{"role": "user", "content": prompt}]
        )
        clean_resp = str(response).replace("```json", "").replace("```", "").strip()
        data = json.loads(clean_resp)
        return {"recommendations": data}
    except:
        return {"recommendations": request.available_courses[:2] if request.available_courses else []}

@app.post("/api/v1/ai/analyze-reflection")
async def analyze_reflection(request: ReflectionAnalysisRequest):
    try:
        prompt = f"Analyze the following teacher reflection for sentiment and provide a 1-sentence summary. Return as JSON with keys 'sentiment' and 'summary'.\n\nReflection: {request.text}"
        response = g4f.ChatCompletion.create(
            model=g4f.models.gpt_35_turbo,
            messages=[{"role": "user", "content": prompt}]
        )
        clean_resp = str(response).replace("```json", "").replace("```", "").strip()
        return json.loads(clean_resp)
    except:
        return {"sentiment": "Neutral", "summary": "Reflection submitted for review."}

@app.post("/api/v1/ai/score-evidence")
async def score_evidence(request: EvidenceScoringRequest):
    try:
        prompt = f"""
        Evaluate this evidence of teaching practice:
        Content: {request.content}
        Category: {request.category}
        
        Score it from 1 to 5 based on richness and professional impact.
        Return JSON with keys 'score' (number) and 'feedback' (1-sentence justification).
        """
        response = g4f.ChatCompletion.create(
            model=g4f.models.default,
            messages=[{"role": "user", "content": prompt}]
        )
        clean_resp = str(response).replace("```json", "").replace("```", "").strip()
        return json.loads(clean_resp)
    except:
        return {"score": 3, "feedback": "Standard quality evidence provided."}

@app.post("/api/v1/ai/chat")
async def chat_with_aira(request: ChatRequest):
    try:
        # ML ENHANCEMENT: Retrieval Step
        # Search local knowledge base for relevant context
        ml_context = retrieval.get_context(request.message)
        
        base_system = (
            "You are Aira, a high-performance AI Assistant for Ekya Schools and PDI. "
            "You provide professional, supportive, and data-backed advice to educators. "
            "If the provided 'RELEVANT KNOWLEDGE' contains the answer, prioritize it over general knowledge. "
            "Always be concise and helpful."
        )
        
        full_system = f"{base_system}\n{request.system_prompt}\n{ml_context}"
        
        messages = [{"role": "system", "content": full_system}]
        for h in request.history[-10:]:
            role = "user" if h.get("role") == "user" else "assistant"
            messages.append({"role": role, "content": h.get("content", "")})
        
        messages.append({"role": "user", "content": request.message})
        
        response = g4f.ChatCompletion.create(
            model=g4f.models.default,
            messages=messages
        )
        return {"response": str(response)}
    except Exception as e:
        print(f"Error in chat: {e}")
        return {"response": "I'm Aira! I am currently running offline, but I couldn't process your request locally."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

