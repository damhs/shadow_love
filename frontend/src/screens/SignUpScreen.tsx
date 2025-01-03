// src/screens/SignUpScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import SignUpContainer from '../components/signup/SignUpContainer';
import Title from '../components/Title';
import InputField from '../components/InputField';
import AuthButton from '../components/AuthButton';

const SignUpScreen = () => {
  const navigation = useNavigation();

  const handleCreatePress = () => {
    // "생성" 버튼 눌렀을 때의 로직
    console.log('회원가입 생성 클릭');
    // TODO: 서버에 회원가입 요청 → 성공시 이동/알림 처리 등
  };

  const handleCancelPress = () => {
    // "취소" 버튼 → 이전 화면으로 돌아가기
    navigation.goBack();
  };

  return (
    <SignUpContainer>
      <View style={styles.header}>
        <Title title="회원가입" />
      </View>

      {/* 이름, 성별, 아이디, 비번, 비번확인 */}
      <InputField placeholder="이름" />
      <InputField placeholder="성별" />
      <InputField placeholder="생성할 아이디 입력" />
      <InputField placeholder="비밀번호 입력" secureTextEntry />
      <InputField placeholder="비밀번호 확인" secureTextEntry />

      {/* 생성 / 취소 버튼 */}
      <View style={styles.buttonRow}>
        <AuthButton label="생성" onPress={handleCreatePress} />
        <AuthButton label="취소" onPress={handleCancelPress} />
      </View>
    </SignUpContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#EAB6CE', // 분홍/보라색 배경
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 30,
  },
});

export default SignUpScreen;
