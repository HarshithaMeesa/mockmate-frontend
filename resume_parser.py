import spacy
import pdfplumber
import docx

nlp = spacy.load("en_core_web_sm")

# Common tech skills list
SKILLS_DB = [
    "python","java","sql","machine learning","deep learning",
    "tensorflow","pytorch","data analysis","pandas","numpy",
    "excel","power bi","tableau","statistics","nlp",
    "computer vision","c++","javascript","react","node",
    "mysql","mongodb","aws","docker","kubernetes"
]


def extract_text_from_pdf(file_path):

    text = ""

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text()

    return text


def extract_text_from_docx(file_path):

    doc = docx.Document(file_path)

    text = ""

    for para in doc.paragraphs:
        text += para.text

    return text


def extract_skills(text):

    text = text.lower()

    skills_found = []

    for skill in SKILLS_DB:
        if skill in text:
            skills_found.append(skill)

    return list(set(skills_found))


def parse_resume(file_path):

    if file_path.endswith(".pdf"):
        text = extract_text_from_pdf(file_path)

    elif file_path.endswith(".docx"):
        text = extract_text_from_docx(file_path)

    else:
        return {"error":"Unsupported file type"}

    skills = extract_skills(text)

    return {
        "skills":skills,
        "text":text[:1000]
    }