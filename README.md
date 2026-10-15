# NBKRIST Placement Portal + Interview AI

## Requirements
- Node.js LTS installed
- VS Code

## Setup in VS Code
1. Extract this ZIP.
2. In VS Code, choose File > Open Folder and open `nbkrist-placement-portal`.
3. Open Terminal > New Terminal.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open the local URL printed in the terminal, usually `http://localhost:5173/`.

If PowerShell blocks npm scripts, run this once in that terminal:
`Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
Or use Command Prompt as your terminal profile.

## College logo
Copy your NBKRIST logo image into `public` and name it `nbkrist-logo.webp`.
If you do not have the image ready, the app will still run, but the logo will be hidden.

## Features
- Dashboard, sample job listings, search and employment-type filter
- Demo job creation and local application tracker
- Student profile saved in local storage
- Interview AI: company/role questions with sample answers, aptitude and reasoning quizzes, mock interview text practice, bookmarks, and progress history
- Responsive layout

## Important
This is a frontend demonstration. The employer listings and interview questions are sample content, not verified live vacancies or guaranteed exact interview questions. Local storage is specific to one browser profile/device and is not a secure shared database. Do not store passwords or sensitive student records here.
