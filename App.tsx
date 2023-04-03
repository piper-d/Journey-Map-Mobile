import React from 'react';
import { Routes } from './src/routes';
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { refreshToken } from './config/firebase';

function App() {
  // User stays signed in
  refreshToken();
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}

export default registerRootComponent(App);
