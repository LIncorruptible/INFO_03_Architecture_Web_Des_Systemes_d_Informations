@echo off
REM Install backen dependencies
start "" cmd /k "cd /d ./backend && npm install"
REM Start the docker container
start "" cmd /k "cd /d ./backend && docker-compose up -d"
REM Start the backend
start "" cmd /k "cd /d ./backend && npm run start"
REM Install frontend dependencies
start "" cmd /k "cd /d ./frontend && npm install"
REM Start the frontend
start "" cmd /k "cd /d ./frontend && npm run start"