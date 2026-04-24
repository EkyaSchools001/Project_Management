import re
import math

class EducationNormalizer:
    """
    Normalizes transcript text to standardized formats, specifically 
    tailored for educational domains.
    """
    
    def __init__(self):
        # Education specific expansions
        self.abbreviations = {
            r"\bmit\b": "m i t",
            r"\bucla\b": "u c l a",
            r"\bmaths\b": "mathematics",
            r"\bcs\b": "computer science",
            r"\bai\b": "artificial intelligence",
            r"\bml\b": "machine learning",
            r"\basr\b": "automatic speech recognition"
        }
        
        # Simple symbol replacement
        self.symbols = {
            r"\+": " plus ",
            r"-": " minus ",
            r"\*": " times ",
            r"=": " equals ",
            r"%": " percent",
            r"\<": " less than ",
            r"\>": " greater than ",
        }

    def normalize(self, text: str) -> str:
        text = text.lower()
        
        # Expand abbreviations
        for abbr, expansion in self.abbreviations.items():
            text = re.sub(abbr, expansion, text)
            
        # Standardize symbols
        for symbol, word in self.symbols.items():
            text = re.sub(symbol, word, text)
            
        # Clean up whitespace
        text = re.sub(r"\s+", " ", text).strip()
        
        # Remove punctuation if necessary, Whisper normally handles it, but good for CER/WER eval
        text = re.sub(r"[,.?!\"]", "", text)
        
        return text

if __name__ == "__main__":
    normalizer = EducationNormalizer()
    sample = "At MIT, we study AI & ML. The error rate is < 5%."
    print(f"Original: {sample}")
    print(f"Normalized: {normalizer.normalize(sample)}")
