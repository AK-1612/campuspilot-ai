const fs = require('fs');

let content = fs.readFileSync('src/indoorMaps.ts', 'utf8');
let parts = content.split('// ─── SVG Building Renderers');
let top_part = parts[0];
let bottom_part = parts[1];

const map_ids = [
    'eng-block-a', 'science-complex', 'main-library', 'medical-center', 
    'sports-arena', 'student-union', 'admin-building', 'arts-center', 
    'innovation-hub', 'residence-hall'
];

let rooms_by_map = {};

let func_splits = bottom_part.split(/(?=function render)/);
for (let func of func_splits) {
    for (let map_id of map_ids) {
        // Just match them in order
    }
}
// Actually let's just use Python since it was extracting correctly, I just need it to do the replacement!
