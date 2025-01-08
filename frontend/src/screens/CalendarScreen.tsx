import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import paintingsData from '../../datas/paintings.json';
import DeviceInfo from "react-native-device-info";
import axios from 'axios';
import config from '../config';
import Icon from 'react-native-vector-icons/Ionicons'; // Ionicons 사용
import { ScrollView } from 'react-native-gesture-handler';


const baseUrl = config.backendUrl;
const imageMapping = {
  painting1: require('../assets/painting/painting1.webp'),
  painting2: require('../assets/painting/painting2.webp'),
  painting3: require('../assets/painting/painting3.webp'),
};

const { width, height } = Dimensions.get('window');

// Locale 설정 (한국어)
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월',
  ],
  monthNamesShort: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월',
  ],
  dayNames: [
    '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

const renderCustomHeader = (date) => {
  const year = date.getFullYear();
  const month = LocaleConfig.locales['ko'].monthNames[date.getMonth()];
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => { /* 이전 달 이동 */ }}>
        <Icon name="chevron-back-outline" size={25} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.headerText}>{`${year}년 ${month}`}</Text>
      <TouchableOpacity onPress={() => { /* 다음 달 이동 */ }}>
        <Icon name="chevron-forward-outline" size={25} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};


const CalendarScreen = ({ navigation }) => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getTextColor = (hexColor) => {
    const r = parseInt(hexColor.slice(0, 2), 16);
    const g = parseInt(hexColor.slice(2, 4), 16);
    const b = parseInt(hexColor.slice(4, 6), 16);
    const brightness = (r + g + b) / (255 * 3);
    return brightness > 0.5 ? '#000000' : '#FFFFFF';
  };

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const deviceID = await DeviceInfo.getUniqueId(); // 사용자 ID 가져오기
        console.log('Device ID:', deviceID);
        
        const response = await axios.get(`${baseUrl}/calendar/getEmotionColors`, {
          params: { ID: deviceID },
        });
  
        const data = response.data;
        
        console.log('Response:', response.data);
        // 날짜별 색상을 캘린더 형식으로 변환
        const formattedDates = {};
        data.forEach((item) => {
          formattedDates[item.date] = { selected: true, selectedColor: item.color };
        });
        
        setMarkedDates(formattedDates); // 상태 업데이트
      } catch (error) {
        console.error('Error fetching calendar colors:', error);
      }
    };
  
    fetchColors();
  }, []);
  
  const handleDayPress = (day) => {
    const selected = paintingsData.find(
      (painting) => painting.date === day.dateString
    );
    if (selected) {
      setSelectedPainting(selected);
      setModalVisible(true);
    } else {
      Alert.alert('데이터 없음', '선택한 날짜에는 그림 데이터가 없습니다.');
    }
  };

  const renderCustomHeader = (date) => {
    const year = date.getFullYear();
    const month = LocaleConfig.locales['ko'].monthNames[date.getMonth()];
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{`${year}년 ${month}`}</Text>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/img/calendar_background.webp')} // 배경 이미지 경로
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back-outline" size={30} color="#333" />
        </TouchableOpacity>

        {/* 액자 이미지 */}
        <Image
          source={require('../assets/img/frame.png')} // 액자 이미지 경로
          style={styles.frame}
        />

        {/* 제목 */}
        <Text style={styles.title}>제목</Text>

        {/* 캘린더 */}
        <Calendar
          current={new Date().toISOString().split('T')[0]}
          markedDates={markedDates}
          theme={{
            backgroundColor: '#000',
            calendarBackground: '#FFF',
            textSectionTitleColor: '#000',
            todayTextColor: '#FF3B30',
            dayTextColor: '#333',
            arrowColor: '#FF9500',
            selectedDayBackgroundColor: '#FF3B30',
            selectedDayTextColor: '#FFF',
          }}
          style={styles.calendar}
        />
      </ScrollView>
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
    justifyContent: 'center', // 세로 방향으로 중앙 정렬
    alignItems: 'center', // 가로 방향으로 중앙 정렬
  },
  backButton: {
    position: 'absolute', // 버튼을 독립적으로 배치
    top: 30, // 화면 상단에서 약간 아래로
    left: width*0.03, // 화면 왼쪽에서 약간 안쪽으로
    zIndex: 10, // 캘린더 위에 표시되도록 설정
  },
  frame: {
    width: width * 0.8, // 화면 너비의 80%
    height: height * 0.4, // 화면 높이의 40%
    resizeMode: 'contain', // 이미지 비율 유지
    marginBottom: 20, // 캘린더와 간격 조정
  },
  title: {
    fontSize: 24, // 텍스트 크기
    fontWeight: 'bold', // 텍스트 두께
    color: '#333', // 텍스트 색상
    marginBottom: 20, // 캘린더와의 간격
    textAlign: 'center', // 텍스트 중앙 정렬
  },
  calendar: {
    width: width * 0.9, // 캘린더 너비
    borderRadius: 10, // 모서리 둥글게
    elevation: 5, // 그림자 효과 (Android)
    paddingVertical: 10,
    backgroundColor: '#FFF', // 캘린더 배경색
  },
});

export default CalendarScreen;
