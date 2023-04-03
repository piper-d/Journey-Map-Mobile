import { initializeApp } from 'firebase/app';
import Constants from 'expo-constants';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import { useEffect } from 'react';

//Initialize Firebase
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.apiKey,
  authDomain: Constants.expoConfig?.extra?.authDomain,
  projectId: Constants.expoConfig?.extra?.projectId,
  storageBucket: Constants.expoConfig?.extra?.storageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.messagingSenderId,
  appId: Constants.expoConfig?.extra?.appId,
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const functions = getFunctions(app);
functions;

// Add local storage token add and delete
const refreshToken = () => {
  useEffect(() => {
    function refreshCurrentToken() {
      const user = auth.currentUser;

      if (user) {
        user
          .getIdToken(true)
          .then((token) => {
            AsyncStorage.setItem('accessToken', token);
            console.log('Set Token');
          })
          .catch((error: any) => {
            console.error('Error refreshing token:', error);
          });
      }
    }

    const tokenRefreshInterval = 57 * 60 * 1000; // Refresh every 57 minutes
    const intervalId = setInterval(refreshCurrentToken, tokenRefreshInterval);

    // Clean up the interval when the component is unmounted
    return () => {
      clearInterval(intervalId);
    };
  }, []);
};

export { auth, db, functions, refreshToken };
