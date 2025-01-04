// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // 아이콘 사용

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* 상단 배경과 텍스트 */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>오늘의 주제는?</Text>
      </View>

      {/* 가운데 선물 아이콘 */}
      <FontAwesome name="gift" size={100} color="#4A4A4A" style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD7D7', // 배경색 (핑크톤)
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    backgroundColor: '#EDE7FE', // 텍스트 배경색 (보라색)
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10, // 모서리 둥글게
    marginBottom: 40, // 텍스트와 아이콘 간의 간격
  },
  text: {
    fontSize: 18, // 텍스트 크기
    color: '#4A4A4A', // 텍스트 색상 (어두운 회색)
    fontWeight: 'bold',
  },
  icon: {
    marginTop: 20,
  },
});

export default HomeScreen;
