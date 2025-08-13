@echo off
title Create Desktop Shortcut
color 0E

echo.
echo ========================================
echo    📱 Creating Desktop Shortcut
echo ========================================
echo.

set SCRIPT="%TEMP%\%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"

echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
echo sLinkFile = "%USERPROFILE%\Desktop\Check Weather.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%~dp0Check Weather.bat" >> %SCRIPT%
echo oLink.WorkingDirectory = "%~dp0" >> %SCRIPT%
echo oLink.Description = "Launch Weather App - Check Weather" >> %SCRIPT%
echo oLink.WindowStyle = 1 >> %SCRIPT%
echo oLink.Save >> %SCRIPT%

cscript /nologo %SCRIPT%
del %SCRIPT%

echo.
echo ✅ Desktop shortcut "Check Weather" created successfully!
echo 📍 You can now double-click "Check Weather" on your desktop
echo 🌦️ It will automatically start the server and open your browser
echo.
echo Press any key to exit...
pause >nul 