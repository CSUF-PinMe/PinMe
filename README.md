# PinMe - Core App

## Current App State
 - Same as previous state
 - Added custom map style (Credits to Heather!)
 - Moved stylesheets associated with component into the same folder
 - Added access to user/device location (asks for permission first)
 - Added two buttons at the top left of the screen
   - Button 1: Tests POST API call with backend (AWS API Gateway & Lambda)
   - Button 2: Re-centers map on user location (also prints user location in the console)
 - Added a draggable marker to test interactions
   - When marker is moved, marker location is printed in the console

> ## Previous App State
> - Map with coordinate values shown at the bottom of the screen.
> - Coordinates are also printed in the console as you move around the map.
> - API key has been added so we can build apks and the map will continue to work.

## Description

This is a React Native app created with the Expo CLI to display a simple map view (Google Maps API).

## Requirements
* NodeJS & NPM - [Link](https://nodejs.org/en/)
* Expo - [Link](https://expo.io/)
  - Install with NPM: `npm install -g expo-cli`

### Optional
* Android Studio
  - Android Emulator - [Link](https://developer.android.com/studio/run/managing-avds)


## How To Run:
**1. Open terminal (Mac OS) or cmd (Windows)**  

**2. Check NodeJS & NPM version:**
* `node -v`
  - Should print something like `v10.9.0`
* `npm -v`
  - Should print something like `6.4.1`

**3. Install Dependencies**
* Navigate to project folder and run: `npm install`

**4. Run Expo App**
* `expo start`  

**5. Open App on Device**
* Press **i** to run on iOS Emulator, if installed and running (Mac OS).
* Press **a** to run on Android Emulator, if installed and running
* Or scan QR code with the Expo app on your personal mobile device.
