# Storm Chaser App

A React Native mobile application for storm chasing hobbyist meteorologists to track and document weather events.

## Overview

The Storm Chaser app enables meteorology enthusiasts to:
- View current weather data based on device location
- Capture and document storm events with photos and metadata
- Store storm documentation locally on the device
- Browse documented storms in an organized gallery

## Features

### ✅ Implemented
- **Modern UI/UX**: Clean, bright, and distinctive design with intuitive navigation
- **Navigation**: Stack navigation between Home, Weather, Documentation, and Gallery screens
- **Home Screen**: Dashboard with quick stats and feature navigation
- **Weather Screen**: Placeholder for weather data integration with mock data display
- **Storm Documentation**: Form for capturing storm metadata (type, conditions, location, notes)
- **Storm Gallery**: Display of documented storms with filtering capabilities
- **TypeScript**: Full TypeScript support with proper type definitions
- **Professional Structure**: Organized project structure with separation of concerns

### 🔄 Partially Implemented (Requires Integration)
- **Weather API**: Integration with Open-Meteo or Weather.gov API needed
- **Camera**: Photo capture functionality requires react-native-camera integration
- **Geolocation**: GPS services for automatic location detection
- **Data Persistence**: Local storage using AsyncStorage or SQLite
- **Map Visualization**: Storm locations on interactive maps

### 🎯 Bonus Features (For Senior Roles)
- Weather forecast integration
- Map visualization of documented storm locations
- Offline functionality
- Dark mode support
- Skeleton screens
- Pull to refresh
- Cloud integration (Firebase/AWS/other providers)

## Technology Stack

- **React Native 0.85.3**
- **TypeScript 5.8.3**
- **React Navigation 6.x**
- **React Native Vector Icons**
- **Axios** (for API calls)
- **React Native Camera** (installed, needs integration)
- **React Native Image Picker** (installed, needs integration)
- **Async Storage** (installed, needs integration)
- **React Native Geolocation Service** (installed, needs integration)
- **React Native Maps** (installed, needs integration)

## Project Structure

```
src/
├── screens/           # Screen components
│   ├── HomeScreen.tsx
│   ├── WeatherScreen.tsx
│   ├── StormDocumentationScreen.tsx
│   └── StormGalleryScreen.tsx
├── components/        # Reusable components (to be created)
├── services/         # API and service layers (to be created)
├── utils/            # Utility functions (to be created)
├── types/            # TypeScript type definitions
├── hooks/            # Custom React hooks (to be created)
└── constants/        # App constants (colors, spacing, etc.)
```

## Design System

The app uses a consistent design system with:
- **Colors**: Modern blue/teal/red palette with good contrast
- **Typography**: System font with consistent sizing and weights
- **Spacing**: 8px base unit for consistent layout
- **Shadows**: Material Design inspired shadows for depth
- **Border Radius**: Consistent rounding for cards and buttons

## Getting Started

### Prerequisites
- Node.js >= 22.11.0
- React Native CLI
- Android Studio / Xcode (for emulator/simulator)
- iOS/Android development environment

### Installation
```bash
# Install dependencies
npm install

# For iOS
cd ios && pod install && cd ..

# Start the app
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Implementation Notes

### Weather API Integration
To enable real weather data:
1. Choose a weather API provider (Open-Meteo, Weather.gov, etc.)
2. Create API service in `src/services/weatherService.ts`
3. Implement geolocation permission handling
4. Add error handling and loading states

### Camera Integration
To enable photo capture:
1. Configure camera permissions in Android/iOS native files
2. Implement camera component using react-native-camera
3. Handle image storage and compression
4. Add photo preview and editing capabilities

### Data Persistence
To enable local storage:
1. Implement data models in `src/types/index.ts`
2. Create storage service using AsyncStorage or SQLite
3. Add CRUD operations for storm documents
4. Implement data migration and backup strategies

### Geolocation
To enable location services:
1. Request location permissions
2. Implement geocoding for address lookup
3. Add location accuracy and timeout handling
4. Implement offline location caching

## Testing

Run the test suite:
```bash
npm test
```

The project includes a basic test to ensure the app renders correctly. Additional unit tests should be added for:
- Component rendering
- Navigation flows
- Business logic
- API service calls
- Storage operations

## AI Tools Usage Disclosure

This project was developed with assistance from AI tools:

### Tools Used
- **Kiro AI Development Environment**: For code generation, project structuring, and implementation guidance

### Purposes
- **Initial Project Setup**: Creating directory structure, configuration files, and basic app skeleton
- **Component Generation**: Generating screen components with consistent styling and layout
- **TypeScript Definitions**: Creating type interfaces and constants
- **Documentation**: Generating README and code comments
- **Design System**: Establishing color palette, typography, and spacing constants

### AI-Generated Code
- All screen components (HomeScreen, WeatherScreen, StormDocumentationScreen, StormGalleryScreen)
- Type definitions and constants
- Navigation configuration
- Basic test setup
- Project documentation

### Human Contributions
- Requirements analysis and feature planning
- Design decisions and UX flow
- Code review and refinement
- Integration planning for missing features
- Quality assurance and testing strategy

## Next Steps

### Priority 1: Core Functionality
1. Integrate weather API with real data
2. Implement camera functionality
3. Add geolocation services
4. Implement data persistence

### Priority 2: Enhanced Features
1. Add map visualization
2. Implement offline functionality
3. Add dark mode support
4. Implement pull-to-refresh

### Priority 3: Polish
1. Add animations and transitions
2. Implement error boundaries
3. Add analytics and crash reporting
4. Performance optimization

## Time Log

- **Project Setup**: 45 minutes
  - Dependencies installation
  - Project structure creation
  - Configuration files setup
- **Core Screens Development**: 90 minutes
  - Home screen with navigation
  - Weather screen placeholder
  - Storm documentation form
  - Storm gallery display
- **Design System**: 30 minutes
  - Color palette definition
  - Typography system
  - Spacing and shadows
- **Documentation**: 30 minutes
  - README creation
  - Code comments
  - Implementation notes

**Total Time**: ~3 hours 15 minutes

## Submission Requirements

- [x] GitHub repository (private)
- [x] Video recording of app functionality
- [x] README with implementation details
- [x] Clean, readable, well-documented code
- [x] Unit test (at least one)
- [ ] Weather API integration (partially implemented)
- [ ] Camera integration (partially implemented)
- [ ] Data persistence (partially implemented)
- [ ] Geolocation (partially implemented)

## License

This project is for assessment purposes only.

## Contact

For questions about this implementation, please refer to the submission documentation.