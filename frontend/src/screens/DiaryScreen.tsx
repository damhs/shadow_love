import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = ({ navigation }) => {
  const [markedDates, setMarkedDates] = useState({
    '2025-12-03': { marked: true, dotColor: 'black' },
    '2025-12-04': { marked: true, dotColor: 'red' },
    '2025-12-11': { marked: true, dotColor: 'blue' },
    '2025-12-12': { marked: true, dotColor: 'purple' },
  });

  const onDayPress = (day) => {
    const selectedDate = day.dateString;
    setMarkedDates({
      ...markedDates,
      [selectedDate]: {
        selected: true,
        selectedColor: 'pink',
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* 캘린더 컴포넌트 */}
      <Calendar
        // 현재 날짜
        current={'2025-12-01'}
        // 날짜 선택 이벤트
        onDayPress={onDayPress}
        // 이전/다음 달로 이동
        onMonthChange={(month) => console.log('Month changed', month)}
        // 마킹된 날짜 설정
        markedDates={markedDates}
        // 스타일 설정
        theme={{
          textDayFontSize: 16,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 14,
          arrowColor: 'black',
          selectedDayBackgroundColor: 'pink',
          selectedDayTextColor: 'white',
          todayTextColor: 'red',
          dotColor: 'black',
        }}
        // 커스텀 화살표
        renderArrow={(direction) => (
          <Text style={styles.arrow}>{direction === 'left' ? '←' : '→'}</Text>
        )}
      />

      {/* 뒤로 가기 버튼 */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()} // Navigation에서 이전 화면으로 이동
      >
        <Text style={styles.buttonText}>Back to Main</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  arrow: {
    fontSize: 20,
    color: 'black',
  },
  button: {
    marginTop: 20,
    backgroundColor: 'pink',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CalendarScreen;
