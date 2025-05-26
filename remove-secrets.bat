@echo off
REM Navigate to the root of your Git repository
cd /d %~dp0

REM Remove all secrets from the entire Git history using git-filter-repo
git filter-repo --path backend/.env.example --invert-paths
git filter-repo --path backend/index.js --invert-paths

REM Force push to GitHub (replace 'origin' and 'main' if using different names)
git push origin main --force

echo Done. Your commit history has been cleaned and force pushed.
pause
