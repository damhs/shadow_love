// src/screens/AuthScreen.tsx
import React, { useState } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import Header from '../components/Header';
import LoginImage from '../components/login/LoginImage';
import Button from '../components/Button';
import axios from 'axios';

const AuthScreen = () => {
  const [isWebViewVisible, setIsWebViewVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();

  // 카카오 REST API 설정
  const KAKAO_REST_API_KEY = '5563e735a457700f9c2b9fee6d1a7539'; // REST API 키 입력
  const REDIRECT_URI = 'http://localhost:3000/kakao/callback'; // Redirect URI 입력
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleKakaoLogin = () => {
    setIsWebViewVisible(true); // WebView 열기
  };

  const handleKakaoCallback = async (code: string) => {
    try {
      // Access Token 요청
      const response = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        null,
        {
          params: {
            grant_type: 'authorization_code',
            client_id: KAKAO_REST_API_KEY,
            redirect_uri: REDIRECT_URI,
            code,
          },
        }
      );

      const { access_token } = response.data;

      // 사용자 정보 요청
      const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      setUserInfo(userResponse.data);

      // 환영 메시지와 화면 전환
      Alert.alert('로그인 성공', `${userResponse.data.properties.nickname}님 환영합니다!`);
      navigation.navigate('Home'); // 'Home' 스크린으로 이동
    } catch (error) {
      console.error('카카오 로그인 에러:', error);
      Alert.alert('로그인 실패', '카카오 로그인 중 문제가 발생했습니다.');
    }
  };

  const handleNavigationStateChange = (event: any) => {
    if (event.url.startsWith(REDIRECT_URI)) {
      const code = event.url.split('code=')[1];
      setIsWebViewVisible(false); // WebView 닫기
      handleKakaoCallback(code); // Access Token 요청 및 사용자 정보 가져오기
    }
  };

  return (
    <View style={styles.container}>
      {isWebViewVisible ? (
        <WebView
          source={{ uri: KAKAO_AUTH_URL }}
          onNavigationStateChange={handleNavigationStateChange}
        />
      ) : (
        <>
          <LoginImage /> {/* GAMGI 스타일 이미지 */}
          <Header title="GAMGI" /> {/* GAMGI 스타일 헤더 */}
          <Button
            title="카카오 로그인"
            width="90%"
            height={55}
            backgroundColor="#FEE500"
            textColor="#000"
            onPress={() => navigation.navigate('Home')} // 카카오 로그인 함수 호출
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
  },
});

export default AuthScreen;
