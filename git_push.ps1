Set-Location "c:\Users\parsh\OneDrive\Desktop\hacathone-charusat"

Write-Host "`n=== Current Git Status ===" -ForegroundColor Cyan
git status --short

Write-Host "`n=== Last 3 Commits ===" -ForegroundColor Cyan
git log --oneline -3

Write-Host "`n=== Staging Backend Files ===" -ForegroundColor Yellow
git add "backend/server.js"
git add "backend/package.json"
git add "backend/.env.example"
git add "backend/.gitignore"
git add "backend/models/"
git add "backend/routes/"
git add "backend/utils/"

Write-Host "=== Staging Frontend Files ===" -ForegroundColor Yellow
git add "frontend/index.html"
git add "frontend/package.json"
git add "frontend/vite.config.js"
git add "frontend/tailwind.config.js"
git add "frontend/postcss.config.js"
git add "frontend/eslint.config.js"
git add "frontend/.gitignore"
git add "frontend/src/App.jsx"
git add "frontend/src/App.css"
git add "frontend/src/main.jsx"
git add "frontend/src/index.css"
git add "frontend/src/resume-preview.css"
git add "frontend/src/components/"
git add "frontend/src/config/"
git add "frontend/src/context/"
git add "frontend/src/pages/"
git add "frontend/src/services/"

Write-Host "=== Staging Root Files ===" -ForegroundColor Yellow
git add ".gitignore"
git add "README.md"
git add "package.json"

Write-Host "`n=== Files Staged for Commit ===" -ForegroundColor Cyan
$staged = git diff --cached --name-only

if ($staged) {
    Write-Host $staged -ForegroundColor Green
    Write-Host "`n=== Committing... ===" -ForegroundColor Yellow
    git commit -m "feat: finalize Nexus AI platform with resume rewrite, AI suggestions, and production backend"
    Write-Host "`n=== Pushing to GitHub... ===" -ForegroundColor Yellow
    git push origin main
    Write-Host "`n=== Push Complete! ===" -ForegroundColor Green
} else {
    Write-Host "Nothing new to commit. Checking if push is needed..." -ForegroundColor Yellow
    git push origin main
    Write-Host "`n=== Push Complete! ===" -ForegroundColor Green
}

Write-Host "`nPress any key to close..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
