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
        
        const response = await axios.get(`${baseUrl}/calendar/colors`, {
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
      source={require('../assets/img/calendarbackground.png')} // 예술적인 배경 이미지
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>기록실</Text>

        <Calendar
          current={new Date().toISOString().split('T')[0]}
          markedDates={markedDates}
          markingType="custom"
          onDayPress={handleDayPress}
          renderHeader={(date) => renderCustomHeader(new Date(date))}
          theme={{
            calendarBackground: 'rgba(255, 255, 255, 0.9)',
            textDayFontSize: 16,
            textMonthFontSize: 24,
            textDayHeaderFontSize: 14,
            todayTextColor: '#FF8C42',
            arrowColor: '#A78B71', // 부드러운 골드 톤
            monthTextColor: '#6B4E3D', // 따뜻한 브라운 톤
            textDayStyle: {
              lineHeight: 20,
              textAlign: 'center',
            },
          }}
          style={styles.calendar}
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>돌아가기</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedPainting && (
                <>
                  <Image
                    source={imageMapping[selectedPainting.image]}
                    style={styles.paintingImage}
                  />
                  <Text style={styles.modalTitle}>
                    {selectedPainting.title}
                  </Text>
                  <Text style={styles.modalDate}>
                    {selectedPainting.date}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButtonText}>닫기</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
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
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6B4E3D',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'serif',
    marginTop: height * 0.15,
  },
  headerContainer: {
    alignItems: 'center',
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B4E3D',
  },
  calendar: {
    borderRadius: 15,
    elevation: 5,
    paddingVertical: 10,
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#6B4E3D',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '85%',
  },
  paintingImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6B4E3D',
    marginBottom: 10,
  },
  modalDate: {
    fontSize: 16,
    color: '#5A5A5A',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#6B4E3D',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CalendarScreen;
