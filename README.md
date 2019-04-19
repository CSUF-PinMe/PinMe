# PinMe

## Description
PinMe is a map-based social media app that allows users to see local events in real time. The main feature will be the map user-interface, which will allow users to place pins using GPS. These pins will show where events are happening near the user, with examples including: study groups, social gatherings, sports meetups, food distribution, accident warnings, and other types of special events.

**This is not the app that tracks your mobile device!**

Find out more in our [wiki](https://github.com/CSUF-PinMe/PinMe/wiki)!

## Requirements
* npm - [Link](https://www.npmjs.com/get-npm)
* Expo - [Link](https://expo.io/)
  - Install with npm: `npm install -g expo-cli`
  
## How To Run:
**1. Open terminal (Mac OS) or cmd (Windows)**  

**2. Check npm version:**
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

## Current App State (v2.6) - Pin Images & More!
- Pin information is now displayed in a popup screen that activates when the user touches the callout box, little white box that appears when a pin is touched
    - Includes all information about pin, including an image if it was created with one
    - Allows user to delete the pin if it is one they created
    - Navigation button that opens pin in other map-based apps such as Google Maps, Apple Maps, Uber, and Lyft to get directions or ride to pin's location
- New screen for creating pins, displays a small map of where pin is going to be created at the top of the screen
- You can now create pins with images with the new add pin screen
    - Image viewer opens when you touch an image, allowing for a better view
- New loading screen is displayed when app is opening
    - Changes to sign in screen if user is not already signed in or map screen if they are
- (iOS) New compass icon on the top right of the map screen that moves map to the user's location when touched

**Note**: Most, if not all, of these features were implemented and optimized for iOS devices such as the iPhone XS. 
Features might not work correctly on Android as they have not been tested on that platform at this point.

## Previous App States

> ## App State (v2.5)
> - New Pages have been created: sign-in, sign-up, forgot password, change password, confirm code.
>  - Have been placed in their own folders
> - Created StackNavigator for new pages and connected to DrawerNavigator
> - App now persists user authentication
>  - Keeps user signed in until they sign outline
> - Bottom right Button FAB has been replaced with `react-native-action-button`
>  - Includes sign out button for testing
> - You can now refresh pins on the Search/MyPins page by swiping down from the top
>  - Displays loading icon

> ## App State (v2.4)
> - New Pages have been created: sign-in, sign-up, forgot password, change password, confirm code.
>  - Have been placed in their own folders
> - Created StackNavigator for pages to move between them
>  - Includes animations when changing screens

> ## App State (v2.3)
> - User location is now seen on the map
> - Added a faster get user location to the top right corner
> - Color code the event icon so that it is easier to distinguish
> - Cleaned up unwanted code and space in files
> - Added form requirement for pin info
> - Fixed bug that prevented user to add pin
> - Added an alert to the delete pin feature

> ## App State (v2.2)
> - All screens have been merged together. Screens included are:
>   - Map: shows the user all the pins on the map
>   - My Pins: Shows the user a list of pins they have placed on the map
>   - Search: Allows the user to search for any pin by name in a list view
> - Map region is now stored in the global state, allowing for consistent map view across screens.
> - Users can now jump to any pin on the map by selecting it on the Search or My Pins screen.
> - Users can now delete their own pins under the My Pins screen.

> ## App State (V2.1)
> - Drawer menu has been added and works with stack navigator now
> - pure-store has been added to keep track of global states

> ## App State (V2.0)
> - Pin Information page has been added to provide a form the user will fill when creating a new pin
> - Fields include:
>     1. Event Name
>     2. Event Type
>     3. Description
>     4. Start and End times of the event
>     5. Buttons to: change location, create the pin, or cancel the operation and return to home screen


> ## App State (v1.6)
>  - React Navigation has been implemented for the switching of screens
>  - New screen "addPinMap" has been added.
>    - Renders a map and pin in center of the screen.
>    - Allows the user to place a pin on the map or cancel and go back to the main map view
>  - New pin images have been added (Thanks Heather!)
>  - Pins on the map can be deleted by touching them. (will be changed later)

> ## App State (v1.6.2)
>  - Pin Information page has been added to provide a form the user will fill when creating a new pin
>  - Fields include:
>     1. Event Name
>     2. Event Type
>     3. Description
>     4. Start and End times of the event
>     5. Buttons to: change location, create the pin, or cancel the operation and return to home screen

> ## App State (v1.6)
>  - React Navigation has been implemented for the switching of screens
>  - New screen "addPinMap" has been added.
>    - Renders a map and pin in center of the screen.
>    - Allows the user to place a pin on the map or cancel and go back to the main map view
>  - New pin images have been added (Thanks Heather!)
>  - Pins on the map can be deleted by touching them. (will be changed later)

> ## App State (v1.4)
>  - Added GraphQL functionality
>    - Three new functions:
>      1. testAddPin: Makes a new entry in the database
>      2. testGetPin: Returns all pin data in the database
>      3. testGetOnePin: Returns pin data matching id passed in

> ## App State (v1.3)
> - Configured app with AWS Amplify
> - Added default Amplify sign-in screen for testing
>   - Includes sign-out button at the top of the screen after signing in

> ## App State (v1.2)
> - Added custom map style (Credits to Heather!)
> - Moved stylesheets associated with component into the same folder
> - Added access to user/device location (asks for permission first)
> - Added two buttons at the top left of the screen
>   - Button 1: Tests POST API call with backend (AWS API Gateway & Lambda)
>   - Button 2: Re-centers map on user location (also prints user location in the console)
> - Added a draggable marker to test interactions
>   - When marker is moved, marker location is printed in the console
