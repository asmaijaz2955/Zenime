import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { HomeScreen, Splash } from '../screens';

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
         <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false}}
      />

     
    </Stack.Navigator>
  );
};

export default MainStack;
