@echo off

set /p key_name=Enter key name: 
set /p key_alias=Enter key alias: 

keytool -genkey -v -keystore %key_name%.keystore -alias %key_alias% -keyalg RSA -keysize 2048 -validity 10000

mv  %key_name%.keystore /android/app
