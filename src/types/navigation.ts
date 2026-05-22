/**
 * Navigation type definitions
 */

export type RootStackParamList = {
  Home: undefined;
  Weather: undefined;
  StormDocumentation: undefined;
  StormGallery: undefined;
  StormDetail: { stormId: string };
  Settings: undefined;
};

// Screen props types
export type HomeScreenProps = {
  navigation: any;
};

export type WeatherScreenProps = {
  navigation: any;
};

export type StormDocumentationScreenProps = {
  navigation: any;
};

export type StormGalleryScreenProps = {
  navigation: any;
};