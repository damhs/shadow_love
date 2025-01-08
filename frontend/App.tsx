import React, {useEffect, useState, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {ActivityIndicator, View} from 'react-native';
import {BackgroundProvider} from './src/screens/BackgroundContext'; // BackgroundProvider 가져오기
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import config from './src/config';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import DiaryScreen from './src/screens/DiaryScreen';
import SettingsScreen from './src/screens/SettingScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import RegisterToHomeScreen from './src/screens/RegisterToHomeScreen';
import LockScreen from './src/screens/LockScreen';
import SetPasswordScreen from './src/screens/SetPasswordScreen';

const Stack = createStackNavigator();
const baseUrl = config.backendUrl;

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [password, setPassword] = useState('0000');
  const navigationRef = useRef(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 1. 유저 등록 확인 및 초기화
        await checkDeviceRegistration();
  
        // 2. OneSignal 설정
        await setOneSignal();
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
  
    const checkDeviceRegistration = async () => {
      try {
        const deviceID = await DeviceInfo.getUniqueId();
        console.log(deviceID);
  
        // 병렬 요청으로 데이터 가져오기
        const [userResponse, coupleResponse] = await Promise.all([
          axios.get(`${baseUrl}/auth/getUser`, { params: { ID: deviceID } }),
          axios.get(`${baseUrl}/auth/getCouple`, { params: { ID: deviceID } }),
        ]);
  
        console.log('userResponse:', userResponse.data);
        // console.log('coupleResponse:', coupleResponse.data);
  
        if (userResponse.data.length === 0) {
          await axios.post(`${baseUrl}/auth/createUser`, { ID: deviceID });
        }
  
        // 데이터 확인 후 초기 라우트 설정
        if (
          coupleResponse.data.length === 0 ||
          coupleResponse.data[0].coupleID === null
        ) {
          setInitialRoute('Register');
        } else {
          setInitialRoute('Home');
        }
      } catch (error) {
        console.error('Error fetching device registration:', error);
        // 에러 발생 시 기본 라우트를 Register으로 설정
        setInitialRoute('Register');
      }
    };
  
    const setOneSignal = async () => {
      try {
        console.log('Setting up OneSignal...');
        // OneSignal 초기화
        OneSignal.initialize(config.oneSignalAppId);
        OneSignal.Debug.setLogLevel(LogLevel.Verbose);
        console.log('OneSignal initialized.');
  
        // 알림 권한 요청
        OneSignal.Notifications.requestPermission(true);
        console.log('Notification permission requested.');
  
        // 알림 수신 시 처리
        OneSignal.Notifications.addEventListener('click', notification => {
          console.log('Notification opened:', notification);
  
          // 알림 클릭 시 홈으로
          if (navigationRef.current) {
            navigationRef.current.navigate('Home');
          }
        });
  
        const playerID = await OneSignal.User.getOnesignalId();
        console.log('Player ID:', playerID);
  
        const deviceID = await DeviceInfo.getUniqueId();
  
        // MySQL로 Player ID 업데이트
        await axios
          .patch(`${baseUrl}/auth/updatePlayerID`, { ID: deviceID, playerID })
          .then(response => {
            console.log('Axios Response:', response.data);
          })
          .catch(error => {
            console.error('Axios Error:', error.response?.data || error.message);
          });
        console.log('Player ID updated.');
      } catch (error) {
        console.error('Error setting up OneSignal:', error);
      }
    };
  
    initializeApp();
  }, []);

  if (initialRoute === null) {
    // 로딩 화면
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <BackgroundProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="Diary" component={DiaryScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Setting" component={SettingsScreen} />
          <Stack.Screen name="Explore" component={ExploreScreen} />
          <Stack.Screen name="Transition" component={RegisterToHomeScreen} />
          <Stack.Screen
            name="Lock"
            component={LockScreen}
            initialParams={{savedPassword: password}}
          />
          <Stack.Screen
            name="Password"
            component={SetPasswordScreen}
            initialParams={{savedPassword: password}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </BackgroundProvider>
  );
};

export default App;
