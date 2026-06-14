import re
import json

with open('src/indoorMaps.ts', 'r', encoding='utf-8') as f:
    content = f.read()

parts = content.split('// ─── SVG Building Renderers')
top_part = parts[0]
bottom_part = parts[1]

map_ids = [
    'eng-block-a', 'science-complex', 'main-library', 'medical-center', 
    'sports-arena', 'student-union', 'admin-building', 'arts-center', 
    'innovation-hub', 'residence-hall'
]

# Find all render functions
func_matches = list(re.finditer(r'function render[A-Za-z0-9_]+\(\): React\.ReactElement \{(.*?)\n\}', bottom_part, re.DOTALL))

rooms_by_map = {}

for i, match in enumerate(func_matches):
    if i < len(map_ids):
        map_id = map_ids[i]
        func_body = match.group(1)
        rooms = []
        texts = re.findall(r"React\.createElement\('text',\s*\{(.*?)\},\s*'([^']+)'\)", func_body)
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
        print(f"Extracted {len(rooms)} rooms for {map_id}")

for map_id, rooms in rooms_by_map.items():
    rooms_json = json.dumps(rooms)
    
    start_idx = top_part.find(f"id: '{map_id}'")
    if start_idx != -1:
        rooms_idx = top_part.find("rooms: [", start_idx)
        if rooms_idx != -1 and rooms_idx < start_idx + 1000:
            end_idx = top_part.find("],", rooms_idx)
            top_part = top_part[:rooms_idx] + f"rooms: {rooms_json}" + top_part[end_idx+1:]

with open('src/indoorMaps.ts', 'w', encoding='utf-8') as f:
    f.write(top_part + '// ─── SVG Building Renderers' + bottom_part)
