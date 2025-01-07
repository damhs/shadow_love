import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SetPasswordScreen = ({ navigation }) => {
  const [password, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  // 숫자 입력 핸들러
  const handleNumberPress = (num) => {
    if (!isConfirming) {
      if (password.length < 4) setPasswordInput((prev) => prev + num);
    } else {
      if (confirmPassword.length < 4) setConfirmPassword((prev) => prev + num);
    }
  };

  // 초기화 버튼 핸들러
  const handleReset = () => {
    setPasswordInput('');
    setConfirmPassword('');
    setIsConfirming(false);
  };

  // 비밀번호 저장 핸들러
  const savePassword = async (password) => {
    try {
      await AsyncStorage.setItem('userPassword', password);
      Alert.alert('성공', '비밀번호가 설정되었습니다!');
      navigation.goBack(); // 이전 화면으로 이동
    } catch (error) {
      Alert.alert('오류', '비밀번호 저장 중 문제가 발생했습니다.');
    }
  };

  // 제출 핸들러
  const handleSubmit = () => {
    if (password === confirmPassword) {
      savePassword(password); // AsyncStorage에 비밀번호 저장
    } else {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      handleReset();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isConfirming ? '비밀번호 확인' : '새 비밀번호 입력'}
      </Text>
      <Text style={styles.password}>
        {isConfirming ? confirmPassword.replace(/./g, '●') : password.replace(/./g, '●')}
      </Text>

      {/* 키패드 */}
      <View style={styles.keypad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((i) => (
          <TouchableOpacity
            key={i}
            style={styles.key}
            onPress={() => handleNumberPress(i.toString())}>
            <Text style={styles.keyText}>{i}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 다음 또는 확인 버튼 */}
      {isConfirming && confirmPassword.length === 4 ? (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>확인</Text>
        </TouchableOpacity>
      ) : password.length === 4 ? (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => setIsConfirming(true)}>
          <Text style={styles.submitText}>다음</Text>
        </TouchableOpacity>
      ) : null}

      {/* 초기화 버튼 */}
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetText}>초기화</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  password: {
    fontSize: 32,
    letterSpacing: 8,
    marginBottom: 40,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    justifyContent: 'center',
  },
  key: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    margin: 5,
    borderRadius: 10,
  },
  keyText: {
    fontSize: 24,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
  },
  resetButton: {
    marginTop: 20,
  },
  resetText: {
    fontSize: 16,
    color: '#007bff',
  },
});

export default SetPasswordScreen;
