# PinMe

## Current App State (V2.0)
- Pin Information page has been added to provide a form the user will fill when creating a new pin.
  - Fields include:
      1. Event Name
      2. Event Type
      3. Description
      4. Start and End times of the event
      5. Buttons to: change location, create the pin, or cancel the operation and return to home screen
- Search screen has been added for the use of searching currently loaded pins by name.
  - Updates results dynamically as user changes input
- Username of current logged in user is now saved with pin information on the database.


> ## Current App State (v1.6)
>  - React Navigation has been implemented for the switching of screens
>  - New screen "addPinMap" has been added.
>    - Renders a map and pin in center of the screen.
>    - Allows the user to place a pin on the map or cancel and go back to the main map view
>  - New pin images have been added (Thanks Heather!)
>  - Pins on the map can be deleted by touching them. (will be changed later)


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
