import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class RetrievalEngine:
    def __init__(self, knowledge_path='knowledge_base.json'):
        self.knowledge_path = knowledge_path
        self.articles = []
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.matrix = None
        self.load_knowledge()

    def load_knowledge(self):
        if not os.path.exists(self.knowledge_path):
            print(f"Warning: {self.knowledge_path} not found.")
            return

        with open(self.knowledge_path, 'r', encoding='utf-8') as f:
            self.articles = json.load(f)

        if not self.articles:
            return

        # Prepare corpus for indexing
        # We combine title, keywords, and content for better matching
        corpus = []
        for art in self.articles:
            text = f"{art['title']} {' '.join(art['keywords'])} {art['content']}"
            corpus.append(text)

        self.matrix = self.vectorizer.fit_transform(corpus)
        print(f"ML Retrieval Engine initialized with {len(self.articles)} documents.")

    def search(self, query, top_k=2):
        if not self.articles or self.matrix is None:
            return []

        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.matrix).flatten()
        
        # Get top K indices
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            if similarities[idx] > 0.1: # Threshold for relevance
                results.append(self.articles[idx])
        
        return results

# Singleton instance
engine = RetrievalEngine()

def get_context(query):
    results = engine.search(query)
    if not results:
        return ""
    
    context = "\n--- RELEVANT KNOWLEDGE ---\n"
    for res in results:
        context += f"Source: {res['title']}\nContent: {res['content']}\n\n"
    return context
