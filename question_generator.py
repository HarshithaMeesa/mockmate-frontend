import random

QUESTION_DB = {

"python":[
"What is Python and why is it popular?",
"Explain Python decorators.",
"What are Python generators?",
"Difference between list and tuple.",
"What is the Global Interpreter Lock?"
],

"sql":[
"What is normalization?",
"Explain INNER JOIN vs LEFT JOIN.",
"What are indexes in SQL?",
"What is a primary key?",
"What is a foreign key?"
],

"machine learning":[
"What is overfitting?",
"What is underfitting?",
"Explain supervised vs unsupervised learning.",
"What is a training dataset?",
"What is cross validation?"
],

"data analysis":[
"What is exploratory data analysis?",
"Explain the importance of data cleaning.",
"What is correlation vs causation?"
],

"pandas":[
"What is a DataFrame?",
"How do you handle missing values in pandas?",
"Explain groupby in pandas."
]

}

def generate_questions(skills):

    questions = []

    for skill in skills:

        skill = skill.lower()

        if skill in QUESTION_DB:

            q = random.choice(QUESTION_DB[skill])
            questions.append(q)

    if len(questions) == 0:

        questions = [
        "Tell me about yourself",
        "What are your strengths?",
        "Why do you want this job?"
        ]

    return questions