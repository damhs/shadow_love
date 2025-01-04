import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Image, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import config from './src/config';

import HomeScreen from './src/screens/HomeScreen';
import DiaryScreen from './src/screens/DiaryScreen';
import RecordScreen from './src/screens/RecordScreen';
import RegisterScreen from './src/screens/RegisterScreen';

enableScreens();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
          initialRouteName="HomeScreen"
          screenOptions={{
            tabBarLabelPosition: 'below-icon',
            tabBarStyle: {
              height: 60,
              backgroundColor: '#ffffff',
              // borderTopLeftRadius: 20,
              // borderTopRightRadius: 20,
              paddingTop: 5,
            },
            tabBarLabelStyle: {
              marginBottom: 8,
              fontSize: 12,
            },
            tabBarActiveTintColor: '#6667AB',
            tabBarInactiveTintColor: '#8E8E93',
            headerShown: false,
          }}
        >
          <Tab.Screen 
            name="DiaryScreen"
            component={DiaryScreen}
            options={{
              title: '일기',
              tabBarIcon: ({ focused }) => (
                <Image 
                  source={require('./src/assets/img/diary.png')}
                  style={{
                    width: 24, 
                    height: 24,
                    tintColor: focused ? '#6667AB' : '#8E8E93'
                  }} 
                />
              ),
            }} 
          />
          <Tab.Screen 
            name="HomeScreen" 
            component={HomeScreen}
            options={{
              title: '홈',
              tabBarIcon: ({ focused }) => (
                <Image 
                  source={require('./src/assets/img/home.png')}
                  style={{ 
                    width: 24, 
                    height: 24,
                    tintColor: focused ? '#6667AB' : '#8E8E93'
                  }} 
                />
              ),
            }} 
          />
          <Tab.Screen 
            name="RecordScreen" 
            component={RecordScreen}
            options={{
              title: '기록실',
              tabBarIcon: ({ focused }) => (
                <Image 
                  source={require('./src/assets/img/record.png')}
                  style={{ 
                    width: 24, 
                    height: 24,
                    tintColor: focused ? '#6667AB' : '#8E8E93'
                  }} 
                />
              ),
            }} 
          />
        </Tab.Navigator>
  );
}


function App() {
  const [initialRoute, setInitialRoute] = useState<boolean | null>(null);
  useEffect(() => {
    const checkDeviceId = async () => {
      try {
        const deviceId : string = await DeviceInfo.getUniqueId();
        console.log("Device ID:", deviceId);
        const response = await axios.get(`${config.backendUrl}/mainPage/getIds`, 
          { params: { 
            uID: deviceId 
          } }
        );
        const result = response.data;
        console.log("Get response:", result);
        if (result && result.length > 0) {
          setInitialRoute(true);
        } else {
          setInitialRoute(false);
        }
      } catch (error) {
        console.error("Error checking device ID:", error);
        setInitialRoute(false);
      }
    };
    checkDeviceId();
  }, []);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }} />
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute ? "MainTabs" : "RegisterScreen"}>
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;