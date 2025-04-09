import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from 'react';

import Inbox from './app/screens/Inbox';
import { Login } from './app/screens/Login';
import { Register } from './app/screens/Register';
import Account from './app/screens/Account';
import Explore from './app/screens/Explore';
import Memory from './app/screens/Memory';
import Contact from './app/screens/Contact';
import LoginScreen from './app/screens/LoginScreen';
import {ForgotPasswordScreen} from './app/screens/ForgotPasswordScreen';
import Icon from "react-native-vector-icons/Ionicons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Inbox":
              return <Icon name="chatbox-ellipses-outline" size={size} color={color} />;
            case "Contact":
              return <Icon name="cart-outline" size={size} color={color} />;
            case "Explore":
              return <Icon name="heart" size={size} color={color} />;
            case "Memory":
              return <Icon name="chatbox-ellipses-outline" size={size} color={color} />;
            case "Account":
              return <Icon name="person-circle-outline" size={size} color={color} />;
            default:
              return null;
          }
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: true,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inbox" component={Inbox} />
      <Tab.Screen name="Contact" component={Contact} />
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="Memory" component={Memory} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
}
