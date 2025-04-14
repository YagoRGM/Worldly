import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes/Routes';
import FlashMessage from 'react-native-flash-message';

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
      <FlashMessage position="top" />
    </>
  );
}
