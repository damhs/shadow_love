// src/components/SignUpLink.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

/**
 * "회원가입" 링크처럼 쓰는 작은 텍스트 버튼
 */
interface SignUpLinkProps {
  onPress?: () => void;
}

const SignUpLink: React.FC<SignUpLinkProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.signUpText}>회원가입</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  signUpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
});

export default SignUpLink;
