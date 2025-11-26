# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Habit Tracker - A React Native mobile application for tracking daily habits and routines. Built with Expo and Expo Router, using Appwrite as the backend-as-a-service (BaaS) for authentication and database management. The app features real-time synchronization, streak tracking, and frequency-based habit monitoring.

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

## Tech Stack

### Core Dependencies
- **React**: 19.1.0 (Latest major version)
- **React Native**: 0.81.5
- **Expo SDK**: ~54.0.25
- **Expo Router**: ~6.0.15 (File-based routing)
- **TypeScript**: ~5.9.2

### UI & Navigation
- **react-native-paper**: ^5.14.5 (Material Design 3 components)
- **@react-navigation/native**: ^7.1.21
- **@react-navigation/bottom-tabs**: ^7.8.6
- **@expo/vector-icons**: ^15.0.3 (MaterialCommunityIcons)
- **react-native-safe-area-context**: ~5.6.0

### Backend & Database
- **react-native-appwrite**: ^0.18.0 (Appwrite SDK)
- **react-native-url-polyfill**: ^3.0.0 (Required for Appwrite)

### Animation & Gestures
- **react-native-reanimated**: ~4.1.1
- **react-native-gesture-handler**: ~2.28.0
- **react-native-worklets**: 0.5.1

## Project Structure

```
newbie/
├── app/                          # Main application code
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── index.tsx            # Home - Today's habits list
│   │   ├── add-habbit.tsx       # Add new habit form
│   │   ├── streaks.tsx          # Streaks visualization
│   │   └── _layout.tsx          # Tabs navigation layout
│   ├── auth.tsx                 # Authentication screen
│   └── _layout.tsx              # Root layout with providers
├── lib/                          # Shared libraries
│   ├── appwrite.ts              # Appwrite client configuration
│   └── auth-context.tsx         # Authentication context provider
├── types/                        # TypeScript type definitions
│   └── database.type.ts         # Database schema types
├── assets/                       # Images, fonts, etc.
├── .env                         # Environment variables (not committed)
└── .env.example                 # Example environment variables
```

## Architecture

### Routing Structure
- Uses **Expo Router v6** with file-based routing
- Root layout (`app/_layout.tsx`) implements **RouteGuard** component that:
  - Redirects unauthenticated users to `/auth`
  - Redirects authenticated users from `/auth` to home
  - Uses segment detection to prevent redirect loops
- Tab navigation defined in `app/(tabs)/_layout.tsx` with 3 tabs:
  - **index**: Today's habits (calendar-today icon)
  - **streaks**: Streak tracking (chart-line icon)
  - **add-habbit**: Add new habit (plus-circle icon)

### State Management

#### Authentication Context (`lib/auth-context.tsx`)
Global authentication state management using React Context API:
- **State**:
  - `user`: Current user object (Models.User) or null
  - `isLoadingUser`: Loading state during initial auth check
- **Methods**:
  - `signIn(email, password)`: Create email/password session
  - `signUp(email, password)`: Create account and auto-login
  - `signOut()`: Delete current session
- **Auto-initialization**: Checks for existing session on mount

### Backend Integration (Appwrite)

#### Configuration (`lib/appwrite.ts`)
- **Client Setup**: Endpoint, Project ID, Platform
- **Services**:
  - `account`: Authentication service
  - `databases`: Database service
- **Environment Variables** (required):
  - `EXPO_PUBLIC_APPWRITE_ENDPOINT`: https://sfo.cloud.appwrite.io/v1
  - `EXPO_PUBLIC_APPWRITE_PROJECT_ID`: Your project ID
  - `EXPO_PUBLIC_APPWRITE_PLATFORM`: com.hlruffo.habbittrtacker
  - `EXPO_PUBLIC_DB_ID`: Database ID
  - `EXPO_PUBLIC_HABIT_TABLE_ID`: Collection ID (currently "habbits")

#### Database Schema

**Habits Collection** (`types/database.type.ts`):
```typescript
interface Habit extends Models.Document {
  user_id: string         // Reference to authenticated user
  title: string           // Habit name
  description: string     // Habit description
  frequency: string       // "diário" | "semanal" | "mensal"
  streak_count: number    // Current streak count
  last_completed: string  // ISO date string
}
```

#### Real-Time Subscriptions
The home screen (`app/(tabs)/index.tsx`) implements real-time sync:
- Subscribes to database changes on the habits collection
- Listens for create, update, and delete events
- Automatically refetches habits on any change
- Uses channel pattern: `databases.{DB_ID}.collections.{COLLECTION_ID}.documents`

### UI Components & Styling

#### Material Design 3 (react-native-paper)
- **PaperProvider**: Wraps entire app in `_layout.tsx`
- **Components used**:
  - `Button`: Actions (mode: "contained" | "text")
  - `TextInput`: Forms (mode: "outlined")
  - `SegmentedButtons`: Frequency selector
  - `Surface`: Card containers with elevation
  - `Text`: Typography with variant support

#### Custom Styling
- Primary Color: `#6200EE` (purple)
- Background: `#f5f5f5` (light gray)
- Card Background: `#f7f1fa` (light purple)
- Frequency Badge: `#ede7f6` (lighter purple)
- Streak Badge: `#FFF3e0` (light orange)
- Fire Icon Color: `#ff9800` (orange)

### Path Aliases
- `@/*` aliased to root directory (configured in tsconfig.json)
- Example: `import { useAuth } from "@/lib/auth-context"`

### Experimental Features
Enabled in `app.json`:
- **React Compiler**: `reactCompiler: true` (React 19 optimization)
- **Typed Routes**: `typedRoutes: true` (Type-safe navigation)
- **New Architecture**: `newArchEnabled: true` (Fabric renderer)
- **Edge-to-Edge**: Android edge-to-edge display
- **Strict TypeScript**: Full type checking enabled

### Platform Configuration

#### Android
- Adaptive icon with background, foreground, and monochrome variants
- Edge-to-edge enabled
- Predictive back gesture disabled
- Background color: `#E6F4FE`

#### iOS
- Tablet support enabled
- Automatic user interface style (light/dark mode)

#### Web
- Static output
- Custom favicon

## Important Implementation Notes

### Naming Conventions
- **CRITICAL**: Use `HABITS_TABLE_ID` (uppercase) when importing from `@/lib/appwrite`
- The .env file uses `EXPO_PUBLIC_HABIT_TABLE_ID` which maps to `HABITS_TABLE_ID` constant
- Previous typo: `habits_TABLE_ID` caused "missing required parameter collectionId" error

### React Best Practices
- **Keys in Lists**: Always use unique `key` prop on mapped elements
  - Prefer using `habit.$id` over array index when available
  - Key should be on the outermost mapped component

### Data Fetching Pattern
```typescript
// Query habits for current user
const response = await databases.listDocuments(
  DATABASE_ID,
  HABITS_TABLE_ID,
  [Query.equal("user_id", user?.$id ?? "")]
);
```

### Authentication Flow
1. App loads -> `AuthProvider` checks for existing session
2. If no session -> `RouteGuard` redirects to `/auth`
3. User signs in/up -> Session created -> Auto-redirect to home
4. On home -> Real-time subscription starts
5. Sign out -> Session deleted -> Redirect to `/auth`

## Common Pitfalls & Solutions

### Issue: "missing required parameter collectionId"
**Cause**: Incorrect import of `habits_TABLE_ID` instead of `HABITS_TABLE_ID`
**Solution**: Always use uppercase `HABITS_TABLE_ID` from `@/lib/appwrite`

### Issue: "Each child in a list should have a unique key prop"
**Cause**: Missing or misplaced `key` prop in mapped components
**Solution**: Place `key` on the outermost mapped element (e.g., `<Surface key={habit.$id}>`)

### Issue: Unicode errors on Windows
**Cause**: Using emojis in console.log or print statements
**Solution**: Avoid emojis in test files and console output

## Development Guidelines

### Testing
- All test files should be saved in the `test/` folder
- Avoid using emojis in print statements to prevent Unicode encoding errors
- Test authentication flows thoroughly due to async state updates

### Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use React Context for global state (auth, theme, etc.)
- Follow Expo Router conventions for file-based routing

### Environment Variables
- Never commit `.env` file
- Update `.env.example` when adding new variables
- All Expo public variables must be prefixed with `EXPO_PUBLIC_`
- Variables are bundled at build time, not runtime

### Performance Optimization
- React Compiler enabled - avoid manual memoization unless necessary
- Use real-time subscriptions instead of polling
- Unsubscribe from Appwrite listeners in cleanup functions
- Lazy load screens when possible

## Resources

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Appwrite React Native SDK](https://appwrite.io/docs/sdks#client)
- [React Native Appwrite](https://github.com/appwrite/sdk-for-react-native)
