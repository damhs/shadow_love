// src/screens/LoginScreen.tsx
import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import LoginContainer from '../components/login/LoginContainer';
import LoginImage from '../components/login/LoginImage';
import Title from '../components/Title';
import InputField from '../components/InputField';
import SignUpLink from '../components/signup/SignUpLink';
import AuthButton from '../components/AuthButton';
import KakaoLoginButton from '../components/login/KakaoLoginButton';

const LoginScreen = () => {
  // Stack Navigator의 navigation 객체
  const navigation = useNavigation();

  const handleLoginPress = () => {
    // 로그인 로직
    console.log('로그인 시도');
  };

  const handleSignUpPress = () => {
    // "SignUp" 스크린으로 이동
    navigation.navigate('SignUp' as never); 
    // ^ TS에서 라우트 이름을 문자열로 인식시키기 위해 as never 사용(또는 타입 선언 방식 조정)
  };

  const handleKakaoLoginPress = () => {
    // 카카오 로그인 로직
    console.log('카카오 로그인 시도');
  };

  return (
    <LoginContainer>
      <LoginImage />
      <Title title="GAMGI" />

      <InputField placeholder="아이디 입력" />
      <InputField placeholder="비밀번호 입력" secureTextEntry />

      {/* "회원가입" 링크 → onPress 시 회원가입 화면으로 이동 */}
      <View style={{ width: '100%', alignItems: 'flex-end' }}>
        <SignUpLink onPress={handleSignUpPress} />
      </View>

      {/* 로그인 버튼 */}
      <AuthButton label="로그인" onPress={handleLoginPress} />
      {/* 카카오 로그인 버튼 */}
      <KakaoLoginButton onPress={handleKakaoLoginPress} />
    </LoginContainer>
  );
};

export default LoginScreen;
