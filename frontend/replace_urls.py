import os

src_dir = r"c:\Users\laksh\OneDrive\Desktop\Hospital Management\frontend\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "http://localhost:8000" in content:
        # Instead of replacing blindly, let's inject a constant at the top
        # No, replacing blindly with `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}` if it's inside backticks.
        # But wait, it might be in regular strings like 'http://localhost:8000/api'
        # Let's replace 'http://localhost:8000' with ` + (import.meta.env.VITE_API_URL || 'http://localhost:8000') + ` maybe?
        pass

# It's easier to create an api.js or config.js and import it.
# Actually, the simplest way is to replace:
# 'http://localhost:8000/ => `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/
# and "http://localhost:8000/ => `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/
# but we need to change quotes to backticks if they are single/double quotes.

def fix_urls(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if "http://localhost:8000" not in content:
        return
        
    new_content = ""
    lines = content.split('\n')
    for line in lines:
        if "http://localhost:8000" in line:
            # handle 'http://localhost:8000...'
            line = line.replace("'http://localhost:8000", "`http://localhost:8000")
            line = line.replace("http://localhost:8000'", "http://localhost:8000`")
            # handle "http://localhost:8000..."
            line = line.replace('"http://localhost:8000', '`http://localhost:8000')
            line = line.replace('http://localhost:8000"', 'http://localhost:8000`')
            
            line = line.replace("http://localhost:8000", "${import.meta.env.VITE_API_URL || 'http://localhost:8000'}")
            
        new_content += line + '\n'
        
    # remove trailing newline if it wasn't there
    if not content.endswith('\n'):
        new_content = new_content[:-1]
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.jsx') or f.endswith('.js'):
            fix_urls(os.path.join(root, f))

print("URL replacement complete.")
