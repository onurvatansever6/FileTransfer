# FileTransfer

FileTransfer is a React-Native application for sending files from your phone to your computer. If they are connected to the same Internet you can easily send files
to your computer from your mobile phone.

# How to install

1) Make sure you have the NodeJS LTS version. You can find it here: https://nodejs.org/en/
2) Open a integrated terminal in projects folder.
3) Write as shown and run it. This will install all dependencies of this project.
```bash
npm install
```
4) For opening application in the emulator follow React Native CLI Quickstart guide. You can check out here: https://reactnative.dev/docs/environment-setup. 
5) In windows you can make a release build for Android, for IOS check out here: https://reactnative.dev/docs/publishing-to-app-store.


# How to build release in Android
**1) Change your terminals directory to android folder.**
```bash
 cd .\android\
```
**2) Generate a keystore.**

You will need a Java generated signing key which is a keystore file used to generate a React Native executable binary for Android. You can just run **"generateKey.bat"** file 
in your **"android"** folder to generate a keystore.

Once you run the keytool utility, you'll be prompted to type in a password. Make sure you remember the password.

You can change your_key_name with any name you want, as well as your_key_alias. This key uses key-size 2048, instead of default 1024 for security reason.

**3) Adding Keystore to your project**

You need to open your android\app\build.gradle file and add the keystore configuration. 
```kotlin
android {
....
  signingConfigs {
    release {
      storeFile file('your_key_name.keystore')
      storePassword 'your_key_store_password'
      keyAlias 'your_key_alias'
      keyPassword 'your_key_file_alias_password'
    }
  }
  buildTypes {
    release {
      ....
      signingConfig signingConfigs.release
    }
```
**3)  Release APK Generation**
Place your terminal directory to android using:
```bash
cd android
```
Then run this command on your terminal: 
```bash
./gradlew assembleRelease
```
Release apk will be in this folder:
```
"android/app/build/outputs/apk/app-release.apk"
```
