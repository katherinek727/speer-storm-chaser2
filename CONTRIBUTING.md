# Contributing to Storm Chaser

Thank you for your interest in contributing to Storm Chaser! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming environment for everyone.

## How Can I Contribute?

### Reporting Bugs
- Check if the bug has already been reported in the [Issues](https://github.com/your-username/storm-chaser/issues)
- Use the bug report template when creating a new issue
- Include detailed steps to reproduce the bug
- Provide screenshots or videos if applicable
- Include device and OS information

### Suggesting Features
- Check if the feature has already been suggested
- Use the feature request template
- Explain why this feature would be useful
- Provide mockups or examples if possible

### Pull Requests
1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add or update tests as needed
5. Ensure the code follows our style guidelines
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation
```bash
# Clone your fork
git clone https://github.com/your-username/storm-chaser.git
cd storm-chaser

# Install dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..

# Start the development server
npm start
```

### Running the App
```bash
# iOS
npm run ios

# Android
npm run android

# Both platforms
npm run start:dev
```

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define interfaces for props and state
- Use strict type checking
- Avoid `any` type when possible

### Code Style
- Follow the existing code style
- Use 2-space indentation
- Use semicolons
- Maximum line length: 100 characters
- Use meaningful variable and function names

### React/React Native
- Use functional components with hooks
- Keep components small and focused
- Use PropTypes or TypeScript interfaces
- Follow React Native best practices

### File Structure
- Place components in `src/components/`
- Place screens in `src/screens/`
- Place services in `src/services/`
- Place types in `src/types/`
- Place constants in `src/constants/`
- Place utilities in `src/utils/`

### Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example: `feat: add interactive storm map with clustering`

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/components/StatCard.test.tsx
```

### Writing Tests
- Write tests for new features
- Update tests when modifying existing code
- Test both success and error cases
- Use descriptive test names
- Mock external dependencies

## Documentation

### Updating Documentation
- Update README.md for significant changes
- Add JSDoc comments for functions and components
- Update type definitions when adding new types
- Document API changes

### Adding Screenshots
- Use high-quality screenshots
- Include both light and dark mode when applicable
- Show different screen sizes when relevant
- Update screenshots for UI changes

## Release Process

### Versioning
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality
- **PATCH** version for bug fixes

### Release Checklist
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Changelog is updated
- [ ] Version number is updated
- [ ] Code is reviewed
- [ ] Build passes for both platforms

## Getting Help

- Check the [documentation](README.md)
- Search existing [issues](https://github.com/your-username/storm-chaser/issues)
- Ask in the [discussions](https://github.com/your-username/storm-chaser/discussions)
- Contact the maintainers

## Recognition

All contributors will be recognized in:
- The project's README.md
- Release notes
- Contributor hall of fame

Thank you for contributing to Storm Chaser! 🎉