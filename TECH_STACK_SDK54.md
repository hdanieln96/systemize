# LifePlanner - Expo SDK 54 Tech Stack

**Last Updated**: January 2025
**Expo SDK**: 54.0.23 (Latest Stable)

## Core Framework

### Expo & React Native
- **Expo SDK**: `~54.0.23` (Latest stable)
- **React Native**: `0.81` (Bundled with SDK 54)
- **React**: `19.1.0` (Required for SDK 54)
- **React Native Web**: `0.21.0`

### Platform Requirements
- **Node.js**: `20.19.x` LTS (Minimum required)
- **iOS**: 15.1+ (Xcode 16.1+ required)
- **Android**: API level 36 (Android 16)

## Installation Command

```bash
npx create-expo-app@latest lifeplanner --template blank-typescript
cd lifeplanner
```

## Core Dependencies

### Navigation
```bash
npx expo install @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
```

**Versions**:
- `@react-navigation/native`: `^7.1.17`
- `@react-navigation/bottom-tabs`: `^7.4.7`
- `react-native-screens`: `^4.0.0+`
- `react-native-safe-area-context`: `^4.18.0+`

**Breaking Changes from v6**:
- New API for configuring screens
- Updated TypeScript types for route params
- Different tab bar customization approach

### Database
```bash
npx expo install expo-sqlite
```

**Version**: `~16.0.9`

**Key Features in SDK 54**:
- Drop-in implementation for localStorage web API
- `loadExtensionAsync()` and `loadExtensionSync()` for SQLite extensions
- Support for sqlite-vec extension
- Apple TV support

**IMPORTANT NOTES**:
1. **Use direct import**: `import * as SQLite from 'expo-sqlite'`
2. **DO NOT use** `expo-sqlite/next` - it's deprecated
3. Use prepared statements to prevent SQL injection
4. Web support is experimental - requires Metro bundler config for WASM
5. On tvOS, database is in caches directory, not documents directory

### State Management
```bash
npm install zustand
```

**Version**: `^5.0.8`

### Date Utilities
```bash
npm install date-fns
```

**Version**: `^4.1.0`

### UI Components
```bash
npx expo install react-native-paper
```

**Version**: `^5.14.5`

### Animations
```bash
npx expo install react-native-reanimated
```

**Version**: `^3.16.1`

**Note**: Precompiled frameworks for iOS significantly reduce build times in SDK 54

### Notifications
```bash
npx expo install expo-notifications
```

**Version**: Compatible with SDK 54 (use `npx expo install` for auto-version)

## TypeScript Configuration

```bash
npm install --save-dev typescript @types/react @types/react-native
```

**Version**: `^5.9.3`

## Development Tools

### Linting & Formatting
```bash
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-native
```

### Testing
```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

## Complete package.json

```json
{
  "name": "lifeplanner",
  "version": "1.0.0",
  "main": "expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\""
  },
  "dependencies": {
    "expo": "~54.0.23",
    "react": "19.1.0",
    "react-native": "0.81.0",
    "@react-navigation/native": "^7.1.17",
    "@react-navigation/bottom-tabs": "^7.4.7",
    "react-native-screens": "^4.0.0",
    "react-native-safe-area-context": "^4.18.0",
    "expo-sqlite": "~16.0.9",
    "expo-notifications": "~0.30.0",
    "zustand": "^5.0.8",
    "date-fns": "^4.1.0",
    "react-native-paper": "^5.14.5",
    "react-native-reanimated": "^3.16.1"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "@types/react": "~18.3.14",
    "@types/react-native": "~0.81.0",
    "typescript": "~5.9.3",
    "eslint": "^8.57.0",
    "prettier": "^3.3.3",
    "jest": "^29.7.0",
    "@testing-library/react-native": "^12.4.0",
    "@testing-library/jest-native": "^5.4.3"
  },
  "private": true
}
```

## Major Changes in SDK 54

### Performance Improvements
- **Precompiled iOS frameworks**: React Native and dependencies ship as XCFrameworks, drastically reducing build times
- **Faster Metro bundler**: Improved caching and bundling performance

### New Features
- **React 19.1 support**: Latest React features including improved server components
- **iOS 26 Liquid Glass icons**: New design language support
- **Android 16 edge-to-edge**: Default edge-to-edge layouts with predictive back gestures
- **Expo UI for iOS**: Beta SwiftUI primitives integration

### Breaking Changes
- **React 19 required**: Must use React 19.1.0 (breaking change from React 18)
- **Node.js 20.19+**: Older Node versions no longer supported
- **iOS 15.1+ required**: Dropped support for older iOS versions
- **Android API 36**: Minimum target SDK increased

## Migration from Previous SDKs

### From SDK 52 → SDK 54
1. **Update React**: Upgrade from React 18 to React 19.1.0
2. **Update Node.js**: Ensure you're on Node 20.19.x or later
3. **React Navigation**: No breaking changes from SDK 52 (already on v7)
4. **expo-sqlite**: Update from ~15.x to ~16.0.9
5. **Remove deprecated imports**: Ensure no `expo-sqlite/next` usage

### From SDK 51 or older → SDK 54
1. **React Navigation 7**: Major breaking changes from v6 - follow migration guide
2. **New Architecture**: Review new architecture compatibility for custom native modules
3. **expo-sqlite**: Complete API overhaul - use new API
4. **iOS build system**: Update to Xcode 16.1+ for precompiled frameworks

## Known Issues & Workarounds

### Issue 1: React Navigation 7 TypeScript Types
**Problem**: Type errors with route params
**Solution**: Use the new `NavigationProp` and `RouteProp` types from v7

### Issue 2: expo-sqlite Web Support
**Problem**: Web build fails with WASM errors
**Solution**: Add Metro config for WASM support (experimental feature)

### Issue 3: React 19 Compatibility
**Problem**: Some third-party libraries not yet compatible with React 19
**Solution**: Check library compatibility before installing, or wait for updates

## Best Practices for SDK 54

### 1. Use npx expo install
Always use `npx expo install` instead of `npm install` for Expo packages to ensure compatibility:
```bash
npx expo install expo-sqlite
```

### 2. Database Security
Use prepared statements with expo-sqlite:
```typescript
await db.runAsync('INSERT INTO users VALUES (?, ?)', [name, email]);
```

### 3. Navigation Type Safety
Properly type your navigation stacks:
```typescript
type RootStackParamList = {
  Timeline: undefined;
  Todo: undefined;
  Habits: undefined;
  Settings: undefined;
};
```

### 4. Performance Optimization
- Use `React.memo()` for list items
- Enable `useNativeDriver: true` for animations
- Leverage precompiled frameworks benefit on iOS

### 5. Testing
Test on both iOS and Android regularly, especially edge-to-edge behavior on Android 16

## Resources

- **Expo SDK 54 Docs**: https://docs.expo.dev/versions/v54.0.0/
- **React Navigation 7**: https://reactnavigation.org/docs/7.x/getting-started
- **expo-sqlite Reference**: https://docs.expo.dev/versions/latest/sdk/sqlite/
- **Expo Changelog**: https://expo.dev/changelog/sdk-54
- **React 19 Docs**: https://react.dev/blog/2025/01/01/react-19

## Support & Compatibility

### Expo Go App Version
Ensure your Expo Go app is updated to SDK 54 on your device:
- **iOS**: Update from App Store
- **Android**: Update from Google Play

### EAS Build
SDK 54 is fully supported on EAS Build with the latest build workers.

### Development Build
Recommended for production apps to have full control over native code:
```bash
npx expo install expo-dev-client
npx expo prebuild
npx expo run:ios
npx expo run:android
```

---

**Next Steps**: Initialize project with SDK 54 and verify all dependencies install correctly.
