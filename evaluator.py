from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def evaluate_answer(question, answer):

    expected = {
        "python decorators": ["function","wrapper","modify","behavior"],
        "overfitting": ["training data","model","generalization","high variance"],
        "inner join": ["table","matching","rows","columns"]
    }

    question = question.lower()
    answer = answer.lower()

    keywords = []

    for key in expected:
        if key in question:
            keywords = expected[key]

    if not keywords:
        keywords = ["concept","example","explanation"]

    # 🔹 similarity (light weight now)
    reference = " ".join(keywords)
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([reference, answer])
    similarity = cosine_similarity(vectors[0], vectors[1])[0][0]

    # 🔹 keyword match
    matched = sum(1 for word in keywords if word in answer)
    keyword_score = matched / len(keywords)

    # 🔥 EASY SCORING (very lenient)
    score = (
        similarity * 0.3 +      # reduced importance
        keyword_score * 0.2     # reduced importance
    ) * 100

    # 🔥 BIG BOOST (makes it easy)
    score = score * 0.5 + 50   # base starts at 50

    # 🔥 small bonus for speaking something
    if len(answer.split()) > 5:
        score += 10

    score = round(min(score, 100))

    # 🔥 Friendly feedback
    if score > 80:
        feedback = "Excellent answer!"
    elif score > 60:
        feedback = "Good job! You're doing well."
    else:
        feedback = "Nice try! Keep going, you’re improving."

    return {
        "score": score,
        "feedback": feedback
    }