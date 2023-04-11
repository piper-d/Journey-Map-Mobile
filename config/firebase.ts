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

// const refreshToken = () => {
//   useEffect(() => {
//     async function refreshCurrentToken() {
//       const user = auth.currentUser;
//       console.log(await AsyncStorage.getItem('accessToken'));

//       if (user) {
//         user
//           .getIdToken(true)
//           .then(async (token) => {
//             await AsyncStorage.setItem('accessToken', token);
//             console.log('Set Token');
//             console.log(token);
//           })
//           .catch((error: any) => {
//             console.error('Error refreshing token:', error);
//           });
//       }
//     }

//     const tokenRefreshInterval = 57 * 60 * 1000; // Refresh every 57 minutes
//     const intervalId = setInterval(refreshCurrentToken, tokenRefreshInterval);

//     // Clean up the interval when the component is unmounted
//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);
// };

export { auth, db, functions };
