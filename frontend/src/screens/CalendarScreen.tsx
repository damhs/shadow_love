import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Calendar } from 'react-native-calendars';
import paintingsData from '../../datas/paintings.json';

const CalendarScreen = ({ navigation }) => {
  const [markedDates, setMarkedDates] = useState({});

  // Helper: RGB 값을 기반으로 텍스트 색상 계산
  const getTextColor = (hexColor) => {
    const r = parseInt(hexColor.slice(0, 2), 16);
    const g = parseInt(hexColor.slice(2, 4), 16);
    const b = parseInt(hexColor.slice(4, 6), 16);
    const brightness = (r + g + b) / (255 * 3); // 밝기 비율 계산
    return brightness > 0.5 ? '#000000' : '#FFFFFF'; // 밝기 기준으로 텍스트 색상 결정
  };

  useEffect(() => {
    // JSON 데이터를 기반으로 마킹된 날짜 생성
    const generateMarkedDates = () => {
      const marked = {};
      paintingsData.forEach((painting) => {
        marked[painting.date] = {
          customStyles: {
            container: {
              backgroundColor: `#${painting.color}`, // 날짜 배경색
            },
            text: {
              color: getTextColor(painting.color), // 날짜 텍스트 색상
            },
          },
        };
      });
      setMarkedDates(marked);
    };

    generateMarkedDates();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/img/background.png')} // 배경 이미지 경로
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Desk Calendar</Text>

        {/* 캘린더 */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={'2025-01'} // 초기 달력 월
            markedDates={markedDates} // JSON 데이터를 기반으로 마킹
            markingType={'custom'} // 커스텀 마킹 사용
            style={styles.calendar}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'rgba(255, 255, 255, 0.9)',
              textDayFontSize: 16,
              textMonthFontSize: 20,
              textDayHeaderFontSize: 14,
              todayTextColor: 'gold',
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
