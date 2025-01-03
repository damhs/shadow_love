import React from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Header from '../components/Header';

const AuthScreen = () => {
  return (
    <ScreenContainer>
      <Image
        source={{ uri: 'https://example.com/your-image-url.png' }} // 이미지 경로 수정
        style={{ width: '80%', height: 200, marginBottom: 20 }}
        resizeMode="contain"
      />
      <Header title="GAMGI" />
      {/* InputField와 Button에 동적 스타일 적용 */}
      <InputField placeholder="아이디 입력" width="90%" height={55} backgroundColor="#f0f0f0" borderColor="#888" />
      <InputField placeholder="비밀번호 입력" width="90%" height={55} backgroundColor="#f0f0f0" borderColor="#888" />
      <Button
        title="카카오 로그인"
        width="90%"
        height={55}
        backgroundColor="#FFC0CB"
        textColor="#fff"
        onPress={() => console.log('카카오 로그인 클릭')}
      />
      <TouchableOpacity onPress={() => console.log('회원가입 클릭')}>
        <Text style={{ color: '#000', fontSize: 14, textDecorationLine: 'underline' }}>회원가입</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

export default AuthScreen;
