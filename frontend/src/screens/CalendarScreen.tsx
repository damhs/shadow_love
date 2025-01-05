import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = ({ navigation }) => {
  const [currentMonth, setCurrentMonth] = useState('2025-12'); // 초기 달력 상태

  return (
    <ImageBackground
      source={require('../assets/img/background.png')} // 배경 이미지 경로
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Desk Calendar</Text>

        {/* 기본 달력 */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={currentMonth}
            style={styles.calendar}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'rgba(255, 255, 255, 0.9)',
              textDayFontSize: 16,
              textMonthFontSize: 20,
              textDayHeaderFontSize: 14,
              todayTextColor: 'gold',
              selectedDayBackgroundColor: 'rgba(255, 105, 180, 0.8)',
              selectedDayTextColor: 'white',
            }}
            hideArrows={false} // 화살표 표시
          />
        </View>

        {/* 뒤로 가기 버튼 */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginBottom: 20,
  },
  calendarContainer: {
    width: '90%',
    height: 350,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 5,
  },
  calendar: {
    width: '100%',
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CalendarScreen;
