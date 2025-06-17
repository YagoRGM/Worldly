import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes/Routes';
import FlashMessage from 'react-native-flash-message';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
      <FlashMessage position="top" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
