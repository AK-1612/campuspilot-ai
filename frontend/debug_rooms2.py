import re

with open('src/indoorMaps.ts', 'r', encoding='utf-8') as f:
    content = f.read()

parts = content.split('// ─── SVG Building Renderers')
bottom_part = parts[1]

# Just find ALL text elements in bottom_part directly!
texts = re.findall(r"React\.createElement\('text',\s*\{(.*?)\},\s*'([^']+)'\)", bottom_part)
print("Total texts found:", len(texts))
if len(texts) > 0:
    print("First 5 texts:", texts[:5])
else:
    print("No texts found at all!")
