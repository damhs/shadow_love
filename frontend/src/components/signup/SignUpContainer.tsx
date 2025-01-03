// src/components/SignUpContainer.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * 회원가입 화면 배경/레이아웃 컨테이너
 */
const SignUpContainer = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD6DA', // 연한 핑크 배경
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default SignUpContainer;
