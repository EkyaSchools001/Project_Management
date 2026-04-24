import evaluate
import torch
import numpy as np
from typing import List, Dict

class ASREvaluator:
    """
    Computes Word Error Rate (WER) and Character Error Rate (CER),
    with support for slicing metrics by accent to ensure balanced performance.
    """
    def __init__(self):
        self.wer_metric = evaluate.load("wer")
        self.cer_metric = evaluate.load("cer")

    def compute_metrics(self, predictions: List[str], references: List[str]) -> Dict[str, float]:
        """
        Calculates global WER and CER.
        """
        wer = self.wer_metric.compute(predictions=predictions, references=references)
        cer = self.cer_metric.compute(predictions=predictions, references=references)
        return {
            "WER": wer,
            "CER": cer
        }

    def compute_sliced_metrics(self, predictions: List[str], references: List[str], accents: List[str]) -> Dict[str, Dict[str, float]]:
        """
        Calculates WER/CER per accent slice (e.g., 'en-in', 'en-us').
        """
        assert len(predictions) == len(accents) and len(references) == len(accents)
        
        sliced_results = {}
        unique_accents = set(accents)
        
        for accent in unique_accents:
            # Filter the arrays for this specific accent
            accent_preds = [p for i, p in enumerate(predictions) if accents[i] == accent]
            accent_refs = [r for i, r in enumerate(references) if accents[i] == accent]
            
            sliced_results[accent] = self.compute_metrics(accent_preds, accent_refs)
            
        # Also compute global
        sliced_results["Global"] = self.compute_metrics(predictions, references)
        
        return sliced_results

if __name__ == "__main__":
    # Test Evaluation Strategy
    evaluator = ASREvaluator()
    
    references = ["hello world", "the quick brown fox", "this is indian english"]
    predictions = ["hello word", "the quick brown foxes", "this is indian english"]
    accents = ["en-us", "en-us", "en-in"]
    
    results = evaluator.compute_sliced_metrics(predictions, references, accents)
    
    for slice_name, metrics in results.items():
        print(f"--- {slice_name.upper()} ---")
        print(f"WER: {metrics['WER']:.2f} | CER: {metrics['CER']:.2f}")
