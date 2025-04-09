import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Login} from './app/screens/Login';
import LoginScreen from './app/screens/LoginScreen';
import { Register } from './app/screens/Register';
import home from './app/screens/Inbox';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from './navigation';
import { StatusBar } from 'expo-status-bar';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="auto" />
        <Navigation />
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});