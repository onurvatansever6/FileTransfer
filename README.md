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


# How to build release
1) Change your terminals directory to android folder.
```
 cd .\android\
```
2) Before building follow these steps as shown here: https://medium.com/geekculture/react-native-generate-apk-debug-and-release-apk-4e9981a2ea51
3) If "gradlew assembleRelease" does not work use this instead: 
```
./gradlew assembleRelease
```
4) Release apk will be in your "android/app/build/outputs/apk/app-release.apk" folder