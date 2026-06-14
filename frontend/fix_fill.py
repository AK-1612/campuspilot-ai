with open('src/indoorMaps.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("fill: '#ffffff'", "fill: 'transparent'")
content = content.replace("fill: 'var(--bg-zinc-50, #ffffff)'", "fill: 'transparent'")

with open('src/indoorMaps.ts', 'w', encoding='utf-8') as f:
    f.write(content)
