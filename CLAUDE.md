# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native mobile app built with Expo and Expo Router, configured to use Appwrite as the backend for authentication and database services. The project uses file-based routing and tab navigation.

## Development Commands

### Start Development Server
```bash
npm start
# or
npx expo start
```

### Platform-Specific Launch
```bash
npm run android    # Launch on Android emulator
npm run ios        # Launch on iOS simulator
npm run web        # Launch on web browser
```

### Code Quality
```bash
npm run lint       # Run ESLint
```

### Project Reset
```bash
npm run reset-project  # Moves starter code to app-example/ and creates blank app/
```

## Architecture

### Routing Structure
- Uses Expo Router (v6) with file-based routing
- Root layout (`app/_layout.tsx`) implements route guard that redirects unauthenticated users to `/auth`
- Tab navigation defined in `app/(tabs)/_layout.tsx` with Home and Login tabs
- Auth screen at `app/auth.tsx`

### Backend Integration (Appwrite)
- Configuration in `lib/appwrite.ts`
- Requires environment variables:
  - `EXPO_PUBLIC_APPWRITE_ENDPOINT`
  - `EXPO_PUBLIC_APPWRITE_PROJECT_ID`
  - `EXPO_PUBLIC_APPWRITE_PLATFORM`
- Note: `lib/appwrite.ts:6` has a typo - uses `setPlataform` instead of `setPlatform`

### Path Aliases
- `@/*` is aliased to the root directory (configured in tsconfig.json)

### Key Features Enabled
- React Compiler (experimental): `reactCompiler: true` in app.json
- Typed Routes (experimental): `typedRoutes: true` in app.json
- React Native New Architecture: `newArchEnabled: true` in app.json
- Strict TypeScript mode enabled

### Current Development State
- Authentication system is partially implemented but route guard always redirects (`isAuthenticated` is hardcoded to `false` in `app/_layout.tsx:5`)
- Auth screen (`app/auth.tsx`) is a placeholder with basic UI structure
- Login page (`app/(tabs)/login.tsx`) is a placeholder

## Important Notes

- All test files should be saved in the `test` folder
- Avoid using emojis in print statements to prevent Unicode encoding errors on Windows
- The project uses `react-native-appwrite` for backend integration
- Tab navigation uses `@expo/vector-icons` (AntDesign and FontAwesome5)
