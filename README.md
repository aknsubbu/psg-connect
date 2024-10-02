# PSG Connect Expo React Native Frontend

![PSG Connect](./assets/images/icon.png)

This project is a mobile application built with Expo and React Native that provides a user-friendly interface for PSG Tech students to access their academic information.

Link to Backend Repository :
'''
https://github.com/aknsubbu/psg-connect-backend
'''

## Features

- User authentication
- Fetch and display student profile, attendance, exam results, and CA marks
- Offline support and data persistence
- Secure credential storage
- Automatic data refresh

## Requirements

- Node.js 12+
- Expo CLI
- Yarn or npm

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/psg-connect-frontend.git
   cd psg-connect-frontend
   ```

2. Install dependencies:

   ```
   yarn install
   # or
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```
   API_URL=your_api_url_here
   ```

   Replace `your_api_url_here` with the URL where your backend API is hosted.

## Usage

Start the Expo development server:

```
expo start
```

Use the Expo Go app on your mobile device to scan the QR code, or press 'i' to open in iOS Simulator or 'a' for Android Emulator.

## Project Structure

The project includes the following key files and components:

- `studentDataManager.ts`: Manages data fetching, storage, and caching
- `useStudentData.ts`: Custom hook for managing student data state
- `secureCredStorage.ts`: Handles secure storage of user credentials

## Student Data Manager

The `studentDataManager` is a singleton class that handles data fetching, local storage, and caching. Key features include:

- Fetching data from the server
- Storing data locally using Expo's FileSystem
- Implementing a fetch interval to refresh data periodically
- Checking network connectivity before making requests

Make sure to update the `API_URL` constant in `studentDataManager.ts` to match the URL in your `.env` file:

```typescript
const API_URL = process.env.API_URL || "your_default_api_url_here";
```

## Custom Hook: useStudentData

The `useStudentData` hook provides a convenient way to manage student data in your components. It offers the following functionality:

- Login and logout
- Data fetching and refreshing
- Loading and error state management

Usage example:

```typescript
const { data, isLoading, error, isLoggedIn, login, refreshData, logout } =
  useStudentData();
```

## Secure Credential Storage

The project uses Expo's SecureStore to safely store user credentials. The `secureCredStorage.ts` file provides functions for saving, retrieving, and clearing credentials.

## API Integration

Ensure that the `API_URL` in your `.env` file and `studentDataManager.ts` is correctly set to your backend API URL.

## Offline Support

The application supports offline usage by storing fetched data locally. The `studentDataManager` handles data persistence and retrieval.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request
