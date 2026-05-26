import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy generated AI image into the public folder
const sourceFile = "C:\\Users\\Dell\\.gemini\\antigravity\\brain\\96d8d82e-a6c3-4a2f-bece-1a6d436e8844\\hero_fans_1779245124854.png";
const destFile = path.join(__dirname, 'public', 'hero-fans.png');

const ballSourceFile = "C:\\Users\\Dell\\.gemini\\antigravity\\brain\\96d8d82e-a6c3-4a2f-bece-1a6d436e8844\\soccer_ball_1779245816170.png";
const ballDestFile = path.join(__dirname, 'public', 'soccer-ball.png');

const neymarSourceFile = "C:\\Users\\Dell\\.gemini\\antigravity\\brain\\96d8d82e-a6c3-4a2f-bece-1a6d436e8844\\neymar_dribble_1779246065394.png";
const neymarDestFile = path.join(__dirname, 'public', 'neymar-dribble.png');

const greenscreenSourceFile = "C:\\Users\\Dell\\.gemini\\antigravity\\brain\\96d8d82e-a6c3-4a2f-bece-1a6d436e8844\\neymar_greenscreen_1779246238449.png";
const greenscreenDestFile = path.join(__dirname, 'public', 'neymar-greenscreen.png');

const logoSourceFile = "C:\\Users\\Dell\\.gemini\\antigravity\\brain\\96d8d82e-a6c3-4a2f-bece-1a6d436e8844\\kasport_logo_1779249808077.png";
const logoDestFile = path.join(__dirname, 'public', 'kasport-logo.png');

const expSourceFile = "C:\\Users\\Dell\\.gemini\\antigravity\\brain\\96d8d82e-a6c3-4a2f-bece-1a6d436e8844\\premium_experience_1779249312799.png";
const expDestFile = path.join(__dirname, 'public', 'premium-experience.png');

try {
  if (fs.existsSync(sourceFile)) {
    fs.copyFileSync(sourceFile, destFile);
    console.log("--- [Vite] SUCCESSFULLY COPIED AI IMAGE TO FRONTEND PUBLIC FOLDER! ---");
  } else {
    console.log("--- [Vite] Source image file not found:", sourceFile);
  }

  if (fs.existsSync(ballSourceFile)) {
    fs.copyFileSync(ballSourceFile, ballDestFile);
    console.log("--- [Vite] SUCCESSFULLY COPIED SOCCER BALL IMAGE TO FRONTEND PUBLIC FOLDER! ---");
  } else {
    console.log("--- [Vite] Soccer ball source file not found:", ballSourceFile);
  }

  if (fs.existsSync(neymarSourceFile)) {
    fs.copyFileSync(neymarSourceFile, neymarDestFile);
    console.log("--- [Vite] SUCCESSFULLY COPIED NEYMAR IMAGE TO FRONTEND PUBLIC FOLDER! ---");
  } else {
    console.log("--- [Vite] Neymar source file not found:", neymarSourceFile);
  }

  if (fs.existsSync(greenscreenSourceFile)) {
    fs.copyFileSync(greenscreenSourceFile, greenscreenDestFile);
    console.log("--- [Vite] SUCCESSFULLY COPIED NEYMAR GREENSCREEN IMAGE! ---");
  } else {
    console.log("--- [Vite] Neymar greenscreen source file not found:", greenscreenSourceFile);
  }

  if (fs.existsSync(logoSourceFile)) {
    fs.copyFileSync(logoSourceFile, logoDestFile);
    console.log("--- [Vite] SUCCESSFULLY COPIED KASPORT LOGO IMAGE! ---");
  } else {
    console.log("--- [Vite] Logo source file not found:", logoSourceFile);
  }

  if (fs.existsSync(expSourceFile)) {
    fs.copyFileSync(expSourceFile, expDestFile);
    console.log("--- [Vite] SUCCESSFULLY COPIED PREMIUM EXPERIENCE IMAGE! ---");
  } else {
    console.log("--- [Vite] Premium experience source file not found:", expSourceFile);
  }
} catch (err) {
  console.error("--- [Vite] Error copying image file:", err);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
