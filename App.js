import React from 'react';
import { StatusBar } from 'react-native'; 
import { StyleSheet } from 'react-native';
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

const styles = StyleSheet.create({
});
