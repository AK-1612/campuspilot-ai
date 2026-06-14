import re

with open('src/indoorMaps.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# The injected block starts with `// --- Complex Background Rooms & Corridors ---`
# and ends right before `// Main walls`
# Let's use regex to remove it.
pattern = re.compile(r'// --- Complex Background Rooms & Corridors ---.*?// Main walls', re.DOTALL)
new_content = pattern.sub('// Main walls', content)

with open('src/indoorMaps.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)
