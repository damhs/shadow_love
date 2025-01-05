import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecordScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>기록실</Text>
      <Text style={styles.description}>여기에서 당신의 활동과 기록들을 확인해보세요.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF3E6', // 부드러운 배경색으로 변경
  },
  title: {
    fontSize: 28, // 제목 폰트 크기 조정
    fontWeight: 'bold',
    marginBottom: 15, // 제목과 내용 사이 간격 증가
    color: '#FF5733', // 따뜻한 색상으로 변경
  },
  description: {
    fontSize: 16,
    color: '#333', // 더 읽기 쉬운 텍스트 색상
    textAlign: 'center',
    paddingHorizontal: 20, // 텍스트가 양옆에 딱 붙지 않도록 여백 추가
  },
});

export default RecordScreen;
