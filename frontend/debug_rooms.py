import json
import re

with open('src/indoorMaps.ts', 'r', encoding='utf-8') as f:
    content = f.read()

parts = content.split('// ─── SVG Building Renderers')
top_part = parts[0]
bottom_part = parts[1]

map_ids = ['eng-block-a']

func_splits = re.split(r'(?<=})\n\n(?=// ─── \d+\.)', bottom_part)
rooms_by_map = {}

for i, func in enumerate(func_splits):
    if not func.strip():
        continue
    if i < len(map_ids):
        map_id = map_ids[i]
        rooms = []
        texts = re.findall(r"React\.createElement\('text',\s*\{(.*?)\},\s*'([^']+)'\)", func)
        for attrs, name in texts:
            x_m = re.search(r'x:\s*(\d+)', attrs)
            y_m = re.search(r'y:\s*(\d+)', attrs)
            if x_m and y_m:
                x = int(x_m.group(1))
                y = int(y_m.group(1))
                if '🚻' not in name:
                    clean_name = name.replace('🚻 ', '').strip()
                    rooms.append({
                        'id': re.sub(r'[^a-z0-9]+', '-', clean_name.lower()).strip('-'),
                        'name': clean_name,
                        'x': x,
                        'y': y
                    })
        rooms_by_map[map_id] = rooms

print("Extracted rooms for eng-block-a:", len(rooms_by_map.get('eng-block-a', [])))

start_idx = top_part.find("id: 'eng-block-a'")
print("start_idx:", start_idx)
rooms_idx = top_part.find("rooms: [", start_idx)
print("rooms_idx:", rooms_idx)
end_idx = top_part.find("],", rooms_idx)
print("end_idx:", end_idx)
