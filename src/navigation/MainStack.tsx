// src/navigation/MainStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerStack from './DrawerStack';  // Import the DrawerStack
import { Splash } from '../screens';

const Stack = createStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
      <Stack.Screen name="DrawerStack" component={DrawerStack} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
