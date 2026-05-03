const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\donan\\.gemini\\antigravity\\brain\\b92e6671-d65a-4c07-a97f-0148a32ef113\\nang_logo_design_1777802388935.png';
const dest = path.join(__dirname, 'public', 'logo_n.png');

fs.copyFileSync(src, dest);
console.log('Copied successfully!');
