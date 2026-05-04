import json
import re
import os

def extract_from_ts():
    ts_path = os.path.join(os.getcwd(), '..', '..', 'frontend', 'src', 'data', 'guideContent.ts')
    if not os.path.exists(ts_path):
        print(f"File not found: {ts_path}")
        return []

    with open(ts_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the guideArticles array
    match = re.search(r'export const guideArticles: GuideArticle\[\] = \[(.*?)\];', content, re.DOTALL)
    if not match:
        print("Could not find guideArticles in TS file")
        return []

    articles_str = match.group(1)
    
    # Very basic regex-based extraction of ID, Title, and Content
    # In a real scenario, we'd use a TS parser, but this is a lightweight ML implementation
    articles = []
    
    # Find all object blocks { ... }
    blocks = re.findall(r'\{(.*?)\}', articles_str, re.DOTALL)
    
    for block in blocks:
        id_match = re.search(r'id:\s*["\'](.*?)["\']', block)
        title_match = re.search(r'title:\s*["\'](.*?)["\']', block)
        # Match content in backticks or quotes
        content_match = re.search(r'content:\s*[`"\'](.*?)[`"\']', block, re.DOTALL)
        keywords_match = re.search(r'keywords:\s*\[(.*?)\]', block, re.DOTALL)

        
        if id_match and title_match and content_match:
            clean_content = re.sub(r'<[^>]*>', '', content_match.group(1)) # Remove HTML
            clean_content = clean_content.strip()
            
            keywords = []
            if keywords_match:
                keywords = [k.strip().replace('"', '').replace("'", "") for k in keywords_match.group(1).split(',')]

            articles.append({
                "id": id_match.group(1),
                "title": title_match.group(1),
                "content": clean_content,
                "keywords": keywords
            })

    return articles

def save_knowledge(articles):
    with open('knowledge_base.json', 'w', encoding='utf-8') as f:
        json.dump(articles, f, indent=2)
    print(f"Knowledge base saved with {len(articles)} entries.")

if __name__ == "__main__":
    knowledge = extract_from_ts()
    if knowledge:
        save_knowledge(knowledge)
