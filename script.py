import os
import re
import requests
from urllib.parse import urlparse

# Replace this with your actual filename
input_md = "iot-modelling-for-digital-twins.md"  # <- rename if needed
output_dir = "docs"
images_dir = os.path.join(output_dir, "images")

# Step 0: Ensure folder structure
os.makedirs(output_dir, exist_ok=True)
os.makedirs(images_dir, exist_ok=True)

# Step 1: Read full Markdown
with open(input_md, 'r', encoding='utf-8') as f:
    content = f.read()

# Step 2: Download all images and replace URLs
def download_images_and_relink(md_text):
    pattern = re.compile(r'!\[.*?\]\((http.*?)\)')
    links = pattern.findall(md_text)
    for url in links:
        name = os.path.basename(urlparse(url).path)
        local_path = f"images/{name}"
        full_path = os.path.join(images_dir, name)
        try:
            r = requests.get(url)
            with open(full_path, 'wb') as img_file:
                img_file.write(r.content)
            print(f"Downloaded image: {name}")
            md_text = md_text.replace(url, local_path)
        except Exception as e:
            print(f"Failed to download {url}: {e}")
    return md_text

content = download_images_and_relink(content)

# Step 3: Split Markdown into pages using '# ' headings
pattern = re.compile(r'(^# .+)', re.MULTILINE)
parts = pattern.split(content)
pages = []

if parts[0].strip():
    pages.append(("Home", "index.md", parts[0].strip()))

for i in range(1, len(parts), 2):
    heading = parts[i].strip('# ').strip()
    body = parts[i+1].strip()
    filename = f"{heading.lower().replace(' ', '_').replace('/', '_')}.md"
    with open(os.path.join(output_dir, filename), 'w', encoding='utf-8') as f:
        f.write(f"# {heading}\n\n{body}")
    pages.append((heading, filename, body))

# Step 4: Write any remaining content before first heading to index.md
if not any(p[1] == "index.md" for p in pages):
    heading, filename, body = pages[0]
    os.rename(os.path.join(output_dir, filename), os.path.join(output_dir, "index.md"))
    pages[0] = ("Home", "index.md", body)

# Step 5: Group sub-sections into navigation
def section(heading):
    heading = heading.lower()
    if heading.startswith("saml"):
        return "SAML"
    elif heading.startswith("hwml"):
        return "HWML"
    elif heading.startswith("cup carbon"):
        return "Cup Carbon"
    elif heading.startswith("pythonpdevs") or heading.startswith("pydevs"):
        return "PythonPDEVS"
    else:
        return None

nav = {}
for title, file, _ in pages:
    sec = section(title)
    if sec:
        nav.setdefault(sec, []).append((title, file))
    else:
        nav[title] = file

# Step 6: Generate mkdocs.yml
def write_nav_yaml(nav_dict, indent=0):
    lines = []
    space = '  ' * indent
    for key, val in nav_dict.items():
        if isinstance(val, list):
            lines.append(f"{space}- {key}:")
            for subkey, subfile in val:
                lines.append(f"{space}  - {subkey}: {subfile}")
        else:
            lines.append(f"{space}- {key}: {val}")
    return '\n'.join(lines)

with open("mkdocs.yml", "w", encoding="utf-8") as f:
    f.write("site_name: IoT Modelling for Digital Twins\n")
    f.write("theme:\n  name: material\n  palette:\n    scheme: slate\n")
    f.write("nav:\n")
    f.write(write_nav_yaml(nav))

print("\n✅ Done!")
print("📂 Check the `docs/` folder and `mkdocs.yml`")
print("👁️ Preview with:    mkdocs serve")
print("🚀 Deploy with:     mkdocs gh-deploy")
