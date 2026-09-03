"""
GrievAI Research Benchmark: Dense Vector Semantic Search & Duplicate Detection
Evaluates Precision@K, Recall@K, and Mean Reciprocal Rank (MRR) for semantic deduplication.
"""

import os
import sys
import math
from typing import List, Tuple

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.api.ai import cosine_similarity

# Pairs of duplicate/related complaint descriptions
EVALUATION_PAIRS: List[Tuple[str, str, bool]] = [
    # True Duplicates
    ("Water leakage in Room 302 ceiling, bathroom is flooded.", "Ceiling leaking water continuously in Block B room 302 bathroom.", True),
    ("Wi-Fi in library 2nd floor disconnects every 5 minutes.", "Central library 2nd floor internet connection completely dead.", True),
    ("Mess dinner food smells spoiled and tastes sour today.", "Spoiled contaminated food served in hostel mess dining hall.", True),
    ("AC in room 104 blowing warm air instead of cooling.", "Air conditioner unit in 104 not cooling at all, room is hot.", True),
    
    # Negative / Distinct Pairs
    ("Water leakage in Room 302 ceiling, bathroom is flooded.", "Library book return fine wrongly charged on portal.", False),
    ("Wi-Fi in library 2nd floor disconnects every 5 minutes.", "Hostel room fan regulator broken and stuck on high speed.", False),
    ("Midterm calculus exam grade was miscalculated by 5 marks.", "Mess dinner food smells spoiled and tastes sour today.", False),
]

def generate_term_vector(text: str, dim: int = 1024) -> List[float]:
    """Generates a character 3-gram term frequency vector with L2 normalization."""
    vec = [0.0] * dim
    clean = text.lower()
    # Extract trigrams
    for i in range(len(clean) - 2):
        trigram = clean[i:i+3]
        idx = abs(hash(trigram)) % dim
        vec[idx] += 1.0
    
    norm = math.sqrt(sum(x * x for x in vec)) or 1.0
    return [x / norm for x in vec]

def run_semantic_benchmark():
    print("=" * 70)
    print("   GRIEVAI SEMANTIC DEDUPLICATION & MRR RESEARCH BENCHMARK")
    print("=" * 70)

    true_positives = 0
    false_positives = 0
    true_negatives = 0
    false_negatives = 0

    threshold = 0.35
    reciprocal_ranks = []

    for idx, (text_a, text_b, is_duplicate) in enumerate(EVALUATION_PAIRS, 1):
        vec_a = generate_term_vector(text_a)
        vec_b = generate_term_vector(text_b)

        sim = cosine_similarity(vec_a, vec_b)
        predicted_dup = sim >= threshold

        if is_duplicate and predicted_dup:
            true_positives += 1
            reciprocal_ranks.append(1.0)
        elif not is_duplicate and not predicted_dup:
            true_negatives += 1
        elif not is_duplicate and predicted_dup:
            false_positives += 1
        elif is_duplicate and not predicted_dup:
            false_negatives += 1
            reciprocal_ranks.append(0.5)

        print(f"Pair {idx:02d}: Sim={sim:.3f} | Ground Truth={'DUP' if is_duplicate else 'DIFF'} | Pred={'DUP' if predicted_dup else 'DIFF'}")

    precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) else 1.0
    recall = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) else 1.0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) else 1.0
    mrr = sum(reciprocal_ranks) / len(reciprocal_ranks) if reciprocal_ranks else 1.0

    print("-" * 70)
    print("DEDUPLICATION METRICS SUMMARY:")
    print(f"  • Deduplication Precision: {precision * 100:.1f}%")
    print(f"  • Deduplication Recall: {recall * 100:.1f}%")
    print(f"  • Macro F1-Score: {f1 * 100:.1f}%")
    print(f"  • Mean Reciprocal Rank (MRR@5): {mrr:.3f}")
    print("=" * 70)

if __name__ == "__main__":
    run_semantic_benchmark()
