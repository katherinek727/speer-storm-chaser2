# Storm Chaser

<div align="center">

![Storm Chaser Logo](https://img.shields.io/badge/Storm%20Chaser-Professional%20Storm%20Tracking-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.72.0-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6)
![License](https://img.shields.io/badge/License-MIT-green)

**A professional mobile application for storm chasing hobbyist meteorologists**

</div>

## 📱 Overview

Storm Chaser is a comprehensive mobile application designed for weather enthusiasts, storm chasers, and professional meteorologists. The app provides real-time weather data, storm documentation capabilities, interactive mapping, and a gallery for tracking storm events.

### Key Features

- **🌤️ Real-time Weather Data**: Current conditions and hourly forecasts
- **📸 Storm Documentation**: Capture and document storms with photos and metadata
- **🗺️ Interactive Maps**: Visualize storm locations with clustering and filtering
- **🖼️ Storm Gallery**: Browse and manage documented storm events
- **📊 Analytics**: Track storm patterns and statistics
- **🔒 Local Storage**: Secure data persistence with AsyncStorage

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- React Native development environment
- iOS Simulator (macOS) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/storm-chaser.git
   cd storm-chaser
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies (macOS only)**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the application**
   ```bash
   # iOS
   npx react-native run-ios
   
   # Android
   npx react-native run-android
   ```

## 🏗️ Project Structure

```
storm-chaser/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── StatCard.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── WeatherDetailCard.tsx
│   │   ├── ForecastCard.tsx
│   │   ├── PhotoCaptureCard.tsx
│   │   ├── StormTypeSelector.tsx
│   │   ├── StormCard.tsx
│   │   ├── FilterBar.tsx
│   │   └── CameraView.tsx
│   ├── screens/            # Application screens
│   │   ├── HomeScreen.tsx
│   │   ├── WeatherScreen.tsx
│   │   ├── StormDocumentationScreen.tsx
│   │   ├── StormGalleryScreen.tsx
│   │   └── MapScreen.tsx
│   ├── services/           # Business logic and API services
│   │   ├── openMeteoService.ts
│   │   ├── weatherService.ts
│   │   ├── cameraService.ts
│   │   ├── storageService.ts
│   │   └── mapService.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── navigation.ts
│   │   ├── weather.ts
│   │   ├── storm.ts
│   │   ├── api.ts
│   │   └── index.ts
│   ├── constants/          # App constants and configuration
│   │   └── index.ts
│   └── utils/              # Utility functions
├── assets/                 # Images, fonts, and other assets
├── android/                # Android native code
├── ios/                    # iOS native code
└── __tests__/             # Test files
```

## 📖 Features in Detail

### 1. Home Screen
- Dashboard with quick stats and weather overview
- Feature cards for easy navigation
- Safety reminders and quick actions
- Pull-to-refresh for real-time updates

### 2. Weather Screen
- Current weather conditions with detailed metrics
- Hourly forecast with temperature and precipitation
- Weather alerts and warnings
- Open-Meteo API integration

### 3. Storm Documentation Screen
- Camera integration for photo capture
- Storm type selection (thunderstorm, tornado, hurricane, etc.)
- Weather condition and location tracking
- Notes and metadata storage

### 4. Storm Gallery Screen
- Grid view of documented storms
- Advanced filtering and sorting
- Search functionality
- Data export and sharing
- Statistics and visualizations

### 5. Map Screen
- Interactive Google Maps integration
- Storm location visualization with clustering
- Filter by storm type and date
- Distance calculations and heatmaps
- Marker details on tap

## 🔧 Technical Implementation

### Dependencies

#### Core
- **React Native**: 0.72.0
- **React**: 18.2.0
- **TypeScript**: 5.0.0

#### Navigation
- **@react-navigation/native**: 6.1.9
- **@react-navigation/stack**: 6.3.20

#### UI & Styling
- **react-native-vector-icons**: 10.0.0
- **react-native-safe-area-context**: 4.7.4

#### Features
- **react-native-maps**: 1.27.2 (Interactive maps)
- **react-native-camera**: 4.2.1 (Photo capture)
- **@react-native-async-storage/async-storage**: 1.21.0 (Local storage)
- **react-native-permissions**: 3.8.0 (Camera and location permissions)

#### Development
- **ESLint**: 8.56.0
- **Prettier**: 3.1.1
- **Jest**: 29.7.0

### API Integration

#### Open-Meteo Weather API
- Real-time weather data
- Hourly forecasts
- Multiple weather parameters
- Free and open-source

### Data Storage

#### AsyncStorage
- Local data persistence
- Offline functionality
- Fast read/write operations
- Automatic data backup

### Camera Integration

#### react-native-camera
- Photo capture with metadata
- GPS location tagging
- Flash and zoom controls
- Permission handling

### Maps Integration

#### react-native-maps
- Google Maps provider
- Marker clustering
- Interactive controls
- Performance optimization

## 🎨 Design System

### Colors
```typescript
primary: '#4A90E2'      // Main brand color
secondary: '#50E3C2'    // Accent color
accent: '#FF6B6B'       // Warning/error
background: '#F5F7FA'   // App background
surface: '#FFFFFF'      // Card backgrounds
text: '#333333'         // Primary text
```

### Typography
- **Font Family**: System default
- **Font Sizes**: 12px to 36px scale
- **Font Weights**: Regular to Bold

### Spacing
```typescript
xs: 4px    // Extra small
sm: 8px    // Small
md: 16px   // Medium
lg: 24px   // Large
xl: 32px   // Extra large
```

## 📱 Platform Support

### iOS
- Minimum: iOS 13.0
- Optimized for iPhone
- iPad support (responsive)

### Android
- Minimum: Android 8.0 (API 26)
- Material Design guidelines
- Various screen sizes

## 🔒 Permissions

The app requires the following permissions:

### iOS
- **Camera**: For taking storm photos
- **Location (When in Use)**: For geotagging photos
- **Photo Library**: For saving photos

### Android
- **Camera**: For taking storm photos
- **Fine Location**: For accurate GPS coordinates
- **External Storage**: For saving photos

## 🧪 Testing

### Unit Tests
```bash
npm test
# or
yarn test
```

### Test Coverage
- Component rendering tests
- Service function tests
- Navigation tests
- Snapshot tests

## 🚀 Deployment

### Building for Production

#### iOS
```bash
cd ios
xcodebuild -workspace StormChaser.xcworkspace -scheme StormChaser -configuration Release
```

#### Android
```bash
cd android
./gradlew assembleRelease
```

### App Store Guidelines

#### iOS App Store
- Privacy policy required
- App Store Connect setup
- TestFlight for beta testing

#### Google Play Store
- Privacy policy required
- Google Play Console setup
- Internal testing track

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, please:
1. Check the [Issues](https://github.com/your-username/storm-chaser/issues) page
2. Create a new issue if needed
3. Provide detailed information about the problem

## 🙏 Acknowledgments

- **Open-Meteo** for free weather API
- **React Native community** for excellent libraries
- **Weather enthusiasts** for inspiration and feedback

## 📊 Roadmap

### Version 1.1 (Planned)
- [ ] Push notifications for severe weather alerts
- [ ] Social sharing of storm documentation
- [ ] Cloud backup and sync
- [ ] Advanced analytics dashboard

### Version 1.2 (Future)
- [ ] Augmented Reality storm visualization
- [ ] Live streaming integration
- [ ] Community features
- [ ] Professional meteorologist tools

---

<div align="center">

**Built with ❤️ for storm chasers everywhere**

[Report Bug](https://github.com/your-username/storm-chaser/issues) · [Request Feature](https://github.com/your-username/storm-chaser/issues)

</div>