from datasets import load_dataset
try:
    dataset = load_dataset("mozilla-foundation/common_voice_17_0", "hi", split="train[:1]")
    print(dataset.column_names)
except Exception as e:
    print(e)
