@echo off
REM Starts the project's own Postgres instance.
REM
REM It is a separate instance from the system's Postgres: its own data
REM directory, its own port, and nothing of the system's is touched. The
REM data directory is .pgdata, which is ignored by git.
REM
REM The PATH is trimmed to the PostgreSQL bin directory before starting. The
REM backend processes inherit it, and a PATH carrying another build of the
REM same libraries (Git for Windows ships its own) makes them fail to load.

setlocal
set "BIN=C:\Program Files\PostgreSQL\17\bin"
set "DATA=%~dp0..\.pgdata"
set "PATH=%BIN%;C:\Windows\system32;C:\Windows"

if "%1"=="stop" goto :stop
if "%1"=="status" goto :status

"%BIN%\pg_ctl.exe" -D "%DATA%" -l "%DATA%\server.log" -o "-p 5433 -c listen_addresses=127.0.0.1" start
exit /b %ERRORLEVEL%

:stop
"%BIN%\pg_ctl.exe" -D "%DATA%" -m fast stop
exit /b %ERRORLEVEL%

:status
"%BIN%\pg_ctl.exe" -D "%DATA%" status
exit /b %ERRORLEVEL%
