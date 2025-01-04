import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import Button from '../components/Button';
import Header from '../components/Header';
import LoginImage from '../components/login/LoginImage';

const AuthScreen = () => {
  const navigation = useNavigation();

  const handleKakaoLoginPress = () => {
    navigation.navigate('Home'); // HomeScreen으로 이동
    console.log('카카오 로그인 클릭');
  };

  return (
    <ScreenContainer>
      <LoginImage />
      <Header title="GAMGI" />
      <Button
        title="카카오 로그인"
        width="90%"
        height={55}
        backgroundColor="#FFC0CB"
        textColor="#fff"
        onPress={handleKakaoLoginPress}
      />
      <TouchableOpacity onPress={() => console.log('회원가입 클릭')}>
        <Text style={{ color: '#000', fontSize: 14, textDecorationLine: 'underline' }}>회원가입</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

export default AuthScreen;
