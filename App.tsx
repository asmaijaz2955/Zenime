import React, {useEffect, useState} from 'react';
import {CommonActions, NavigationContainer} from '@react-navigation/native';
import MainStack from './src/navigation/MainStack';
const App = () => {


  return (

          <NavigationContainer>
            <MainStack />
            {/* <Toast position="bottom" /> */}
          </NavigationContainer>

  );
};
export default App;
