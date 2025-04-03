from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
import json
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
import google.generativeai as genai
from langchain_community.vectorstores import FAISS
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
from deep_translator import GoogleTranslator
from gtts import gTTS
import tempfile
from fastapi.responses import FileResponse

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise Exception("GOOGLE_API_KEY is missing. Please check your .env file.")

genai.configure(api_key=GOOGLE_API_KEY)

# Fixed paths
PDF_PATH = "C:/Users/HP/OneDrive/Desktop/tsclgsdata.pdf"
FAISS_INDEX_PATH = "faiss_index"
CHAT_HISTORY_FILE = "chat_history.json"

# FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model
class ChatRequest(BaseModel):
    question: str
    lang: str = "en"

# Utility functions
def get_pdf_text(pdf_path):
    text = ""
    pdf_reader = PdfReader(pdf_path)
    for page in pdf_reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text.encode("utf-8", "ignore").decode("utf-8") + "\n"
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    return text_splitter.split_text(text)

def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local(FAISS_INDEX_PATH)

def load_vector_store():
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    return FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)

def get_conversational_chain():
    vector_store = load_vector_store()
    model = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.3)
    retriever = vector_store.as_retriever()
    prompt_template = """
    Answer the question as detailed as possible from the provided context in plain text without using asterisks, bullet points, or any list formatting. If the answer is not in the provided context, respond with: "EduBot is here to assist you with engineering college admissions in Telangana! If you have any queries related to colleges, courses, fees, or the admission process, I’d be happy to help. Let me know how I can assist you!" Do not provide incorrect answers.

    Context: {context}
    Question: {question}
    Answer:
    """
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    return ConversationalRetrievalChain.from_llm(llm=model, retriever=retriever, combine_docs_chain_kwargs={"prompt": prompt})

def translate_text(text, target_lang="en"):
    try:
        return GoogleTranslator(source="auto", target=target_lang).translate(text)
    except Exception as e:
        return text

def speak_text(text, lang="en"):
    try:
        tts = gTTS(text=text, lang=lang)
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        tts.save(temp_file.name)
        return temp_file.name
    except Exception as e:
        raise Exception(f"TTS Error: {e}")

def load_chat_history():
    if os.path.exists(CHAT_HISTORY_FILE):
        with open(CHAT_HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_chat_history(history):
    with open(CHAT_HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

# Initialize vector store
if not os.path.exists(FAISS_INDEX_PATH):
    raw_text = get_pdf_text(PDF_PATH)
    if not raw_text.strip():
        raise Exception("PDF contains no extractable text.")
    text_chunks = get_text_chunks(raw_text)
    get_vector_store(text_chunks)

# API Endpoints
@app.post("/chat")
async def chat_with_pdf(request: ChatRequest):
    try:
        chain = get_conversational_chain()
        response = chain.invoke({"question": request.question, "chat_history": []})
        answer = response["answer"]
        
        if request.lang != "en":
            answer = translate_text(answer, request.lang)
        
        history = load_chat_history()
        history.append({"question": request.question, "answer": answer, "lang": request.lang})
        save_chat_history(history)
        
        return {"response": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.post("/voice-output")
async def voice_output(request: ChatRequest):
    try:
        chain = get_conversational_chain()
        response = chain.invoke({"question": request.question, "chat_history": []})
        answer = response["answer"]
        
        if request.lang != "en":
            answer = translate_text(answer, request.lang)
        
        audio_file = speak_text(answer, request.lang)
        
        history = load_chat_history()
        history.append({"question": request.question, "answer": answer, "lang": request.lang})
        save_chat_history(history)
        
        return FileResponse(audio_file, media_type="audio/mp3", filename="response.mp3")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating voice: {str(e)}")

@app.get("/chat-history")
async def get_chat_history():
    try:
        history = load_chat_history()
        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving chat history: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)