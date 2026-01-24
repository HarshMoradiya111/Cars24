@echo off
REM CARS24 Development Environment Starter
REM Starts both backend (.NET API) and frontend (Next.js) services

echo.
echo ╔════════════════════════════════════════════════╗
echo ║     CARS24 Development Environment Starter     ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Check if both ports are free
echo [*] Checking port availability...
netstat -ano | findstr :5203 >nul
if not errorlevel 1 (
    echo [!] Port 5203 is already in use. Please close the process.
    pause
    exit /b 1
)

netstat -ano | findstr :3000 >nul
if not errorlevel 1 (
    echo [!] Port 3000 is already in use. Please close the process.
    pause
    exit /b 1
)

echo [✓] Ports 5203 and 3000 are available.
echo.

REM Start Backend
echo [*] Starting Cars24 API (Backend)...
echo.
start "Cars24 API - Backend" cmd /k "cd Cars24API && dotnet restore && dotnet run"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start Frontend
echo [*] Starting Cars24 Frontend (Next.js)...
echo.
start "Cars24 Frontend - Next.js" cmd /k "cd cars24 && npm install && npm run dev"

echo.
echo ╔════════════════════════════════════════════════╗
echo ║   Both services are starting...                ║
echo ║                                                ║
echo ║   Backend:  http://localhost:5203              ║
echo ║   Frontend: http://localhost:3000              ║
echo ║                                                ║
echo ║   Check: http://localhost:5203/db-check        ║
echo ║                                                ║
echo ║   Press Ctrl+C in each window to stop.         ║
echo ╚════════════════════════════════════════════════╝
echo.

pause
