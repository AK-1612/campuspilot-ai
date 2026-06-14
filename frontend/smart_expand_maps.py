import re

with open('src/indoorMaps.ts', 'r', encoding='utf-8') as f:
    content = f.read()

parts = content.split('// ─── SVG Building Renderers')
top_part = parts[0]
bottom_part = parts[1]

# We need to process each render function individually.
render_funcs = re.split(r'(?<=})\n\n(?=// ─── \d+\.)', bottom_part)

new_render_funcs = []
for func in render_funcs:
    if not func.strip():
        continue
    
    # Extract all rects
    rects = re.findall(r"React\.createElement\('rect', \{.*?x:\s*(\d+).*?y:\s*(\d+).*?width:\s*(\d+).*?height:\s*(\d+).*?\}", func)
    
    # Convert to integers
    occupied = []
    for r in rects:
        # Give some padding to avoid being too close
        ox = int(r[0]) - 5
        oy = int(r[1]) - 5
        ow = int(r[2]) + 10
        oh = int(r[3]) + 10
        occupied.append((ox, oy, ow, oh))
        
    # Let's also parse the route path to avoid placing rooms on top of the path.
    # We will just roughly avoid the center of the path bounding box, but since we are placing rooms, 
    # it's better to just leave a wide corridor around the path.
    # Actually, the path is drawn on top of everything, so it's okay if it crosses a generic corridor, 
    # but it shouldn't cross a generic room.
    # For simplicity, we just rely on the existing rects. Existing rects are the main rooms. 
    # The empty space is currently corridors. If we fill ALL empty space with rooms, there will be no corridors left!
    
    # Instead, let's create a ring of rooms around the periphery, expanding the building.
    # If the building is roughly 80..720 (width 640), let's expand the main wall to 40..760, and put rooms in 40..80 and 720..760.
    # Same for Y: expand to 40..560, put rooms in 40..80 and 520..560.
    
    # Find the main wall path and replace it.
    # It usually looks like: `React.createElement('path', { d: 'M80 80h640v440H80z', ...`
    # or `M100 100h600v400H100z`
    
    # We will just append a new group of peripheral rooms and extra features that are guaranteed to be outside the 100..700 / 100..500 box,
    # and expand the main wall.
    
    # Let's just generate a fixed set of peripheral rooms that form a large complex around the original.
    peripheral_rooms = """
    // --- Massive Peripheral Complex ---
    React.createElement('g', { stroke: '#cbd5e1', strokeWidth: 1, fill: '#f8fafc' },
        // Top Wing
        React.createElement('rect', { x: 40, y: 20, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'top_off_'+i, x: 40 + i*40, y: 20, width: 40, height: 40 })
        ),
        // Bottom Wing
        React.createElement('rect', { x: 40, y: 520, width: 720, height: 60, rx: 2 }),
        ...Array.from({ length: 18 }).map((_, i) => 
            React.createElement('rect', { key: 'bot_off_'+i, x: 40 + i*40, y: 540, width: 40, height: 40 })
        ),
        // Left Wing
        React.createElement('rect', { x: 20, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'left_off_'+i, x: 20, y: 80 + i*40, width: 40, height: 40 })
        ),
        // Right Wing
        React.createElement('rect', { x: 720, y: 80, width: 60, height: 440, rx: 2 }),
        ...Array.from({ length: 11 }).map((_, i) => 
            React.createElement('rect', { key: 'right_off_'+i, x: 740, y: 80 + i*40, width: 40, height: 40 })
        ),
    ),
    // Extra lifts & stairs in the corners
    React.createElement('g', { fill: '#e0f5ee', stroke: '#3b82f6', strokeWidth: 1.5 },
        React.createElement('rect', { x: 40, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 60, y: 45, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift N'),
        React.createElement('rect', { x: 720, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('text', { x: 740, y: 565, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift S'),
    ),
    React.createElement('g', { fill: '#fde68a', stroke: '#b45309', strokeWidth: 1.5 },
        React.createElement('rect', { x: 720, y: 20, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M720 28h40 M720 36h40 M720 44h40' }),
        React.createElement('text', { x: 740, y: 55, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair E'),
        
        React.createElement('rect', { x: 40, y: 540, width: 40, height: 40, rx: 2 }),
        React.createElement('path', { d: 'M40 548h40 M40 556h40 M40 564h40' }),
        React.createElement('text', { x: 60, y: 575, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair W'),
    ),
    """
    
    # We will inject `peripheral_rooms` right after the main walls.
    # The main walls usually start with `// Main walls` and end with `),`
    func_modified = re.sub(r'(// Main walls.*?React\.createElement\(\'g\', \{.*?\}.*?\),)', r'\1\n' + peripheral_rooms, func, flags=re.DOTALL)
    
    new_render_funcs.append(func_modified)

new_bottom_part = '\n\n'.join(new_render_funcs)

with open('src/indoorMaps.ts', 'w', encoding='utf-8') as f:
    f.write(top_part + '// ─── SVG Building Renderers' + new_bottom_part)
