import re

with open('src/indoorMaps.ts', 'r', encoding='utf-8') as f:
    content = f.read()

parts = content.split('// ─── SVG Building Renderers')
top_part = parts[0]
bottom_part = parts[1]

background_rooms_str = '''
    // --- Complex Background Rooms & Corridors ---
    React.createElement('g', { stroke: '#cbd5e1', strokeWidth: 1, fill: '#f8fafc' },
        // Grid of small offices/rooms
        ...Array.from({ length: 12 }).map((_, i) => 
            React.createElement('rect', { key: 'off1_'+i, x: 100 + (i%4)*40, y: 100 + Math.floor(i/4)*40, width: 40, height: 40 })
        ),
        ...Array.from({ length: 15 }).map((_, i) => 
            React.createElement('rect', { key: 'off2_'+i, x: 500 + (i%3)*40, y: 100 + Math.floor(i/3)*40, width: 40, height: 40 })
        ),
        ...Array.from({ length: 10 }).map((_, i) => 
            React.createElement('rect', { key: 'off3_'+i, x: 100 + (i%5)*40, y: 400 + Math.floor(i/5)*40, width: 40, height: 40 })
        ),
        ...Array.from({ length: 8 }).map((_, i) => 
            React.createElement('rect', { key: 'off4_'+i, x: 500 + (i%4)*40, y: 400 + Math.floor(i/4)*40, width: 40, height: 40 })
        ),
    ),
    // Extra lifts
    React.createElement('g', { fill: '#e0f5ee', stroke: '#3b82f6', strokeWidth: 2 },
        React.createElement('rect', { x: 300, y: 200, width: 40, height: 40, rx: 4 }),
        React.createElement('text', { x: 320, y: 225, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift 3'),
        React.createElement('rect', { x: 460, y: 200, width: 40, height: 40, rx: 4 }),
        React.createElement('text', { x: 480, y: 225, fill: '#1e3a8a', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Lift 4'),
    ),
    // Extra stairs
    React.createElement('g', { fill: '#fde68a', stroke: '#b45309', strokeWidth: 1.5 },
        React.createElement('rect', { x: 300, y: 100, width: 40, height: 60, rx: 4 }),
        React.createElement('path', { d: 'M300 115h40 M300 130h40 M300 145h40' }),
        React.createElement('text', { x: 320, y: 175, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair N'),
        
        React.createElement('rect', { x: 460, y: 400, width: 40, height: 60, rx: 4 }),
        React.createElement('path', { d: 'M460 415h40 M460 430h40 M460 445h40' }),
        React.createElement('text', { x: 480, y: 475, fill: '#78350f', fontSize: 8, textAnchor: 'middle', stroke: 'none' }, 'Stair S'),
    ),
    // Restrooms
    React.createElement('g', { fill: '#e0f2fe', stroke: '#0284c7', strokeWidth: 1.5 },
        React.createElement('rect', { x: 360, y: 100, width: 80, height: 40, rx: 4 }),
        React.createElement('text', { x: 400, y: 125, fill: '#0369a1', fontSize: 10, textAnchor: 'middle', stroke: 'none' }, '🚻 Restrooms'),
    ),
'''

new_bottom_part = bottom_part.replace("React.createElement('g', null,", "React.createElement('g', null," + background_rooms_str)

with open('src/indoorMaps.ts', 'w', encoding='utf-8') as f:
    f.write(top_part + '// ─── SVG Building Renderers' + new_bottom_part)
