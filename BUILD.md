# Build Instructions for Focus Editor Mobile

This project is built with [Expo](https://expo.dev). You can generate APK files for Android and IPA files for iOS using EAS Build or local builds.

## Prerequisites

- Node.js installed
- `npm install` run in this directory

## Method 1: EAS Build (Recommended for Cloud Build)

1.  **Install EAS CLI:**
    ```bash
    npm install -g eas-cli
    ```

2.  **Login to Expo:**
    ```bash
    eas login
    ```

3.  **Configure Build:**
    ```bash
    eas build:configure
    ```

4.  **Build APK (Android):**
    ```bash
    eas build -p android --profile preview
    ```
    This will generate an APK you can install on your device.

    To build an AAB for the Play Store/Uptodown:
    ```bash
    eas build -p android --profile production
    ```

## Method 2: Local Build (Requires Android Studio)

If you have Android Studio and Java installed:

1.  **Generate Native Code:**
    ```bash
    npx expo prebuild
    ```

2.  **Build Release APK:**
    Navigate to the `android` directory and run:
    ```bash
    cd android
    ./gradlew assembleRelease
    ```
    The APK will be located at `android/app/build/outputs/apk/release/app-release.apk`.

## Running Locally

To start the development server:
```bash
npx expo start
```
Scan the QR code with the **Expo Go** app on your phone.
