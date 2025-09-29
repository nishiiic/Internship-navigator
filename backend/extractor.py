# backend/extractor.py

import re
import spacy
from typing import Optional, List

# Load models once at the module level
nlp = spacy.load('en_core_web_sm')
skill_nlp = spacy.load('en_core_web_sm')

# Prepare the skills ruler once
SKILLS_LIST = [
    "Python", "Java", "C++", "JavaScript", "React", "Node.js", "SQL", "Git",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "TensorFlow", "PyTorch",
    "Scikit-learn", "Pandas", "Numpy", "Machine Learning", "Deep Learning",
    "Data Analysis", "Project Management", "Agile", "Scrum", "Team Leadership"
]
patterns = [{"label": "SKILL", "pattern": [{"LOWER": skill.lower()}]} for skill in SKILLS_LIST]
ruler = skill_nlp.add_pipe("entity_ruler", before="ner")
ruler.add_patterns(patterns)


def extract_email(text: str) -> Optional[str]:
    match = re.search(r'[\w\.-]+@[\w\.-]+', text)
    return match.group(0) if match else None

def extract_phone(text: str) -> Optional[str]:
    pattern = r'(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}'
    match = re.search(pattern, text)
    return match.group(0) if match else None

def extract_name(text: str) -> Optional[str]:
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == 'PERSON':
            return ent.text
    return None

def extract_skills_with_spacy(text: str) -> List[str]:
    # The model is already loaded and the ruler is configured
    doc = skill_nlp(text)
    
    found_skills = set()
    for ent in doc.ents:
        if ent.label_ == "SKILL":
            # Find the original case from the list for consistency
            original_skill = next((s for s in SKILLS_LIST if s.lower() == ent.text.lower()), ent.text)
            found_skills.add(original_skill)
            
    return list(found_skills)

def extract_education(text: str) -> List[str]:
    doc = nlp(text)
    universities = set()
    edu_keywords = ['university', 'college', 'institute', 'school']
    
    for ent in doc.ents:
        if ent.label_ == 'ORG':
            if any(keyword in ent.text.lower() for keyword in edu_keywords):
                universities.add(ent.text)
                
    return list(universities)