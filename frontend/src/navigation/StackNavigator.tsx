import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        {/* AuthScreen (로그인 화면) */}
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }} // 헤더 숨기기
        />
        {/* HomeScreen (홈 화면) */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home Screen' }} // HomeScreen의 헤더 제목
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
