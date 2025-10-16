# Tawuniya Al-Hilal Squads

## Getting Started

1. Install dependencies:

```
npm install
```

2. Start the development server:

```
npm start
```

## Firebase Setup

1. Create a Firebase project in the Firebase Console.
2. Add a Web App and copy the config values.
3. Create a `.env.local` in the project root with:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Enable Email/Password in Firebase Authentication.
5. Create a Firestore database (test mode for development).

### Firestore Rules (development)

Use relaxed rules for local development only:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Harden these rules before production.

## API-Football Setup

This app uses [API-Football](https://www.api-football.com/) for live match data.

1. Subscribe to API-Football (paid plan recommended for current season data)
2. Add your API key to `src/config/api.config.js` or set as environment variable:

```
REACT_APP_API_FOOTBALL_KEY=your_api_key_here
```

## Environment Variables

See `.env.example` for required keys. Use `.env.local` for local development.

### Available Environment Variables

```
# Firebase
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=

# API-Football
REACT_APP_API_FOOTBALL_KEY=
```
