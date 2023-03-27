import 'dotenv/config';

export default {
  expo: {
    owner: 'ryans195195',
    name: 'Journey-Map-Mobile',
    slug: 'journey-map-mobile',
    privacy: 'hidden',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      bundleIdentifier: 'com.JourneyMap',
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: 'Your camera is used to add media to the trip.',
        NSLocationWhenInUseUsageDescription:
          'Your location is used to track your trip, and display it only to yourself.',
        NSPhotoLibraryUsageDescription:
          'Your library is used to add media to previously created trips.',
      },
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      package: 'com.JourneyMap',
      versionCode: 1,
      permissions: [
        'CAMERA',
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'READ_MEDIA_IMAGES',
        'READ_MEDIA_VIDEO',
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: process.env.easProjectId,
      },
      // Firebase
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId,
      apiUrl: process.env.apiUrl,
    },
  },
};
