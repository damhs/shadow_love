import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen'; // HomeScreen 임포트

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }} // 헤더 숨기기
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }} // HomeScreen의 헤더 제목
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
