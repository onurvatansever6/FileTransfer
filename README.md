# FileTransfer

FileTransfer is a React-Native application for sending files from your phone to your computer. If they are connected to the same Internet you can easily send files
to your computer from your mobile phone.


# How to install

1) Make sure you have the NodeJS LTS version. You can find it here: https://nodejs.org/en/
2) Open a integrated terminal in projects folder.
3) Write as shown and run it. This will install all dependencies of this project.
```
npm install
```
4) For opening application in the emulator follow React Native CLI Quickstart guide. You can check out here: https://reactnative.dev/docs/environment-setup. 
5) In windows you can make a release build for Android, for IOS check out here: https://reactnative.dev/docs/publishing-to-app-store.


# How to build release in Android
1) Change your terminals directory to android folder.
```
 cd .\android\
```
2) Generate a keystore.
You will need a Java generated signing key which is a keystore file used to generate a React Native executable binary for Android. You can change the names if you want. You can create one using the keytool in the terminal with the following command

```
keytool -genkey -v -keystore your_key_name.keystore -alias your_key_alias -keyalg RSA -keysize 2048 -validity 10000
```

###Once you run the keytool utility, you’ll be prompted to type in a password. Make sure you remember the password.

You can change your_key_name with any name you want, as well as your_key_alias. This key uses key-size 2048, instead of default 1024 for security reason.

3) If "gradlew assembleRelease" does not work use this instead: 
```
./gradlew assembleRelease
```
4) Release apk will be in your "android/app/build/outputs/apk/app-release.apk" folder