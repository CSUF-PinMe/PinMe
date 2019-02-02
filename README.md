# PinMe

## Current App State (v2.3)
- User location is now seen on the map
- Added a faster get user location to the top right corner
- Color code the event icon so that it is easier to distinguish 
- Cleaned up unwanted code and space in files
- Added form requirement for pin info
- Fixed bug that prevented user to add pin
- Added an alert to the delete pin feature

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

# Previous App States

> ## Previous App State (v2.2)
> - All screens have been merged together. Screens included are:
>   - Map: shows the user all the pins on the map
>   - My Pins: Shows the user a list of pins they have placed on the map
>   - Search: Allows the user to search for any pin by name in a list view
> - Map region is now stored in the global state, allowing for consistent map view across screens.
> - Users can now jump to any pin on the map by selecting it on the Search or My Pins screen.
> - Users can now delete their own pins under the My Pins screen.

> ## Previous App State (V2.1)
> - Drawer menu has been added and works with stack navigator now
> - pure-store has been added to keep track of global states

> ## Previous App State (V2.0)
> - Pin Information page has been added to provide a form the user will fill when creating a new pin
> - Fields include:
>     1. Event Name
>     2. Event Type
>     3. Description
>     4. Start and End times of the event
>     5. Buttons to: change location, create the pin, or cancel the operation and return to home screen


> ## Previous App State (v1.6)
>  - React Navigation has been implemented for the switching of screens
>  - New screen "addPinMap" has been added.
>    - Renders a map and pin in center of the screen.
>    - Allows the user to place a pin on the map or cancel and go back to the main map view
>  - New pin images have been added (Thanks Heather!)
>  - Pins on the map can be deleted by touching them. (will be changed later)

> ## Previous App State (v1.6.2)
>  - Pin Information page has been added to provide a form the user will fill when creating a new pin
>  - Fields include:
>     1. Event Name
>     2. Event Type
>     3. Description
>     4. Start and End times of the event
>     5. Buttons to: change location, create the pin, or cancel the operation and return to home screen

> ## Previous App State (v1.6)
>  - React Navigation has been implemented for the switching of screens
>  - New screen "addPinMap" has been added.
>    - Renders a map and pin in center of the screen.
>    - Allows the user to place a pin on the map or cancel and go back to the main map view
>  - New pin images have been added (Thanks Heather!)
>  - Pins on the map can be deleted by touching them. (will be changed later)

> ## Previous App State (v1.4)
>  - Added GraphQL functionality
>    - Three new functions:
>      1. testAddPin: Makes a new entry in the database
>      2. testGetPin: Returns all pin data in the database
>      3. testGetOnePin: Returns pin data matching id passed in

> ## Previous App State (v1.3)
> - Configured app with AWS Amplify
> - Added default Amplify sign-in screen for testing
>   - Includes sign-out button at the top of the screen after signing in

> ## Previous App State (v1.2)
> - Added custom map style (Credits to Heather!)
> - Moved stylesheets associated with component into the same folder
> - Added access to user/device location (asks for permission first)
> - Added two buttons at the top left of the screen
>   - Button 1: Tests POST API call with backend (AWS API Gateway & Lambda)
>   - Button 2: Re-centers map on user location (also prints user location in the console)
> - Added a draggable marker to test interactions
>   - When marker is moved, marker location is printed in the console
