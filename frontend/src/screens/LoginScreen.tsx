// src/screens/LoginScreen.tsx
import React from 'react';
import { View } from 'react-native';

import LoginContainer from '../components/login/LoginContainer';
import LoginImage from '../components/login/LoginImage';
import Title from '../components/login/Title';
import InputField from '../components/login/InputField';
import SignUpLink from '../components/login/SignUpLink';
import AuthButton from '../components/login/AuthButton';
import KakaoLoginButton from '../components/login/KakaoLoginButton';

const LoginScreen = () => {
  const handleLoginPress = () => {
    // 로그인 버튼 클릭 시 로직
    console.log('로그인 시도');
  };

  const handleSignUpPress = () => {
    // 회원가입 버튼 클릭 시 로직
    console.log('회원가입 이동');
  };

  const handleKakaoLoginPress = () => {
    // 카카오 로그인 클릭 시 로직
    console.log('카카오 로그인 시도');
  };

  return (
    <LoginContainer>
      <LoginImage />
      <Title title="GAMGI" />

      <InputField placeholder="아이디 입력" />
      <InputField placeholder="비밀번호 입력" secureTextEntry={true} />

      {/* 회원가입 링크는 비밀번호 입력 아래 오른쪽에 표시되게끔 위치 조정 */}
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
