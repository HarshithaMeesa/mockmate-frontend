from fastapi import FastAPI, UploadFile, File
import shutil
import os
from resume_parser import parse_resume
from fastapi.middleware.cors import CORSMiddleware
from question_generator import generate_questions

from evaluator import evaluate_answer
from fastapi import Body



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.get("/")
def home():
    return {"message":"MockMate Backend Running"}


@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):

    file_location = f"{UPLOAD_FOLDER}/{file.filename}"

    with open(file_location,"wb") as buffer:
        shutil.copyfileobj(file.file,buffer)

    parsed_data = parse_resume(file_location)

    skills = parsed_data["skills"]

    questions = generate_questions(skills)

    return {
        "message":"Resume uploaded successfully",
        "skills":skills,
        "questions":questions
    }
@app.post("/evaluate")
def evaluate(data: dict = Body(...)):

    question = data["question"]
    answer = data["answer"]

    result = evaluate_answer(question, answer)

    return result



import uuid
from datetime import datetime

sessions = {}

@app.post("/create-session")
def create_session(data: dict):

    session_id = str(uuid.uuid4())

    sessions[session_id] = {
    "role": data.get("role"),
    "time": data.get("time"),
    "answers": []
}

    return {
        "session_id": session_id,
        "link": f"http://localhost:3000/join/{session_id}"
    }

@app.get("/session/{session_id}")
def get_session(session_id: str):
    return sessions.get(session_id, {})

from fastapi import WebSocket
from typing import Dict

connections: Dict[str, list] = {}

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()

    if session_id not in connections:
        connections[session_id] = []

    connections[session_id].append(websocket)

    try:
        while True:
            data = await websocket.receive_text()

            # send to other user
            for conn in connections[session_id]:
                if conn != websocket:
                    await conn.send_text(data)

    except:
        connections[session_id].remove(websocket)
