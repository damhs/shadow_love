import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // 네비게이션 훅 가져오기
import { WebView } from 'react-native-webview';
import axios from 'axios';

const AuthScreen = () => {
  const [isWebViewVisible, setIsWebViewVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation(); // 네비게이션 객체 가져오기

  const KAKAO_REST_API_KEY = '5563e735a457700f9c2b9fee6d1a7539'; // 카카오 REST API 키
  const REDIRECT_URI = 'http://localhost:3000/kakao/callback'; // Redirect URI
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleKakaoLogin = () => {
    setIsWebViewVisible(true); // WebView를 표시하여 카카오 로그인 진행
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
      Alert.alert('로그인 성공', `환영합니다, ${userResponse.data.properties.nickname}님!`);

      // **화면 전환: 로그인 성공 후 HomeScreen으로 이동**
      navigation.navigate('Home'); // HomeScreen으로 전환
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
          <Button title="카카오 로그인" onPress={handleKakaoLogin} />
          {userInfo && (
            <Text style={styles.userInfo}>
              환영합니다, {userInfo.properties.nickname}님!
            </Text>
          )}
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
  },
  userInfo: {
    marginTop: 20,
    fontSize: 18,
  },
});

export default AuthScreen;
