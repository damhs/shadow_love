import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Modal,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import paintingsData from '../../datas/paintings.json';

const CustomCalendarScreen = ({ navigation }) => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Helper: 날짜 데이터 생성
  useEffect(() => {
    const generateMarkedDates = () => {
      const marked = {};
      paintingsData.forEach((painting) => {
        marked[painting.date] = {
          customStyles: {
            container: {
              backgroundColor: `#${painting.color}`, // 날짜 배경색
              borderRadius: 10, // 둥근 테두리
              padding: 5, // 내부 여백
            },
            text: {
              color: 'white', // 텍스트 색상
              fontWeight: 'bold', // 텍스트 굵기
            },
          },
        };
      });
      setMarkedDates(marked);
    };

    generateMarkedDates();
  }, []);

  // 날짜 선택 이벤트
  const handleDayPress = (day) => {
    const selectedPainting = paintingsData.find(
      (painting) => painting.date === day.dateString
    );
    if (selectedPainting) {
      setSelectedDate(day.dateString);
      setModalVisible(true); // 모달 표시
    } else {
      Alert.alert('No Data', '선택한 날짜에는 그림 데이터가 없습니다.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/img/calendarbackground.png')}
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>커스텀 캘린더</Text>

        <Calendar
          current={new Date().toISOString().split('T')[0]} // 현재 날짜
          markedDates={markedDates} // JSON 데이터를 기반으로 마킹
          markingType="custom" // 커스텀 스타일 적용
          onDayPress={handleDayPress} // 날짜 선택 이벤트
          theme={{
            calendarBackground: '#f0f4f8', // 캘린더 배경
            todayTextColor: '#ff6347', // 오늘 텍스트 색상
            textDayFontSize: 16,
            textMonthFontSize: 20,
            textDayHeaderFontSize: 14,
            monthTextColor: '#007bff',
            arrowColor: '#007bff',
          }}
          style={styles.calendar}
        />

        {/* 뒤로 가기 버튼 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>돌아가기</Text>
        </TouchableOpacity>

        {/* 모달 */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedDate}의 그림
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
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
    padding: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  calendar: {
    borderRadius: 10,
    elevation: 3, // 그림자 효과
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#007bff',
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CustomCalendarScreen;
AV