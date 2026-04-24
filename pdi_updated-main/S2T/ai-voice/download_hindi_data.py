from huggingface_hub import hf_hub_download
import os

try:
    print("Downloading Hindi Fleurs Parquet shard...")
    # Downloading a shard from the convert/parquet branch or similar
    # For google/fleurs, the auto-converted parquet files are often in 'main' under 'data/'
    local_file = hf_hub_download(
        repo_id="google/fleurs",
        repo_type="dataset",
        filename="data/hi_in/train-00000-of-00001.parquet",
        local_dir="./data/hindi_fleurs"
    )
    print(f"Downloaded to: {local_file}")
except Exception as e:
    print(f"Error: {e}")
