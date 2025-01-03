import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface KakaoLoginButtonProps {
  onPress?: () => void;
}

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.label}>카카오 로그인</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});

export default KakaoLoginButton;
