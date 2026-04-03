@echo off
cd /d "c:\Users\parsh\OneDrive\Desktop\hacathone-charusat"

echo === Git Status ===
git status --short

echo.
echo === Last 3 commits ===
git log --oneline -3

echo.
echo === Staging important files ===

REM Backend files
git add backend/server.js
git add backend/package.json
git add backend/.env.example
git add backend/.gitignore
git add backend/models/
git add backend/routes/
git add backend/utils/

REM Frontend files
git add frontend/index.html
git add frontend/package.json
git add frontend/vite.config.js
git add frontend/tailwind.config.js
git add frontend/postcss.config.js
git add frontend/eslint.config.js
git add frontend/.gitignore
git add frontend/src/App.jsx
git add frontend/src/App.css
git add frontend/src/main.jsx
git add frontend/src/index.css
git add frontend/src/resume-preview.css
git add frontend/src/components/
git add frontend/src/config/
git add frontend/src/context/
git add frontend/src/pages/
git add frontend/src/services/
git add frontend/src/assets/

REM Root files
git add .gitignore
git add README.md
git add package.json

echo.
echo === Staged files ===
git diff --cached --name-only

echo.
echo === Committing ===
git commit -m "feat: update project with latest frontend and backend changes"

echo.
echo === Pushing to GitHub ===
git push origin main

echo.
echo === Done! ===
pause
