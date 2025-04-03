from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict
import chatpdf1  # Import your existing code

app = FastAPI()

class Query(BaseModel):
    question: str
    voice_output: bool
    lang: str

@app.post("/chat")
def chat(query: Query):
    response, audio_file = chatpdf1.user_input(query.question, query.voice_output, query.lang)
    return {"response": response, "audio_file": audio_file}
    
# Run the server with: uvicorn main:app --reload
