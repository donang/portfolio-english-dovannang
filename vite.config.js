import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Copy the logo image to public folder upon Vite start/reload
try {
  const imagesToCopy = [
    { src: 'C:\\Users\\donan\\.gemini\\antigravity\\brain\\b92e6671-d65a-4c07-a97f-0148a32ef113\\nang_logo_pure_n_1777803003031.png', dest: 'logo_n.png' },
    { src: 'C:\\Users\\donan\\.gemini\\antigravity\\brain\\b92e6671-d65a-4c07-a97f-0148a32ef113\\card_icon_brand_1777803994815.png', dest: 'card_icon_brand.png' },
    { src: 'C:\\Users\\donan\\.gemini\\antigravity\\brain\\b92e6671-d65a-4c07-a97f-0148a32ef113\\card_icon_social_1777804010206.png', dest: 'card_icon_social.png' },
    { src: 'C:\\Users\\donan\\.gemini\\antigravity\\brain\\b92e6671-d65a-4c07-a97f-0148a32ef113\\card_icon_print_1777804022641.png', dest: 'card_icon_print.png' },
    { src: 'C:\\Users\\donan\\.gemini\\antigravity\\brain\\b92e6671-d65a-4c07-a97f-0148a32ef113\\card_icon_photo_1777804037584.png', dest: 'card_icon_photo.png' }
  ];

  for (const img of imagesToCopy) {
    const destPath = path.join(__dirname, 'public', img.dest);
    if (fs.existsSync(img.src)) {
      fs.copyFileSync(img.src, destPath);
    }
  }

  // Delete unused files to clean up the source code
  const unusedFiles = [
    path.join(__dirname, 'src', 'components', 'SnakeEasterEgg.jsx'),
    path.join(__dirname, 'src', 'components', 'Process.jsx')
  ];
  for (const file of unusedFiles) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
} catch (err) {
  console.error("Failed to copy/delete files:", err);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    fs: {
      strict: false,
    }
  }
})
