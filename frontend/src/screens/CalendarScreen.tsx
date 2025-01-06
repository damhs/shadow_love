import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import paintingsData from '../../datas/paintings.json';

const CalendarScreen = ({ navigation }) => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedPainting, setSelectedPainting] = useState(null); // 선택된 그림
  const [modalVisible, setModalVisible] = useState(false); // 상세보기 모달 표시 여부

  // Helper: RGB 값을 기반으로 텍스트 색상 계산
  const getTextColor = (hexColor) => {
    const r = parseInt(hexColor.slice(0, 2), 16);
    const g = parseInt(hexColor.slice(2, 4), 16);
    const b = parseInt(hexColor.slice(4, 6), 16);
    const brightness = (r + g + b) / (255 * 3);
    return brightness > 0.5 ? '#000000' : '#FFFFFF';
  };

  // 이미지 매핑 객체
  const imageMap = {
    'painting1.webp': require('../assets/painting/painting1.webp'),
    'painting2.webp': require('../assets/painting/painting2.webp'),
    'painting3.webp': require('../assets/painting/painting3.webp'),
  };

  const getImagePath = (fileName) => imageMap[fileName] || null;

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

  // 날짜 선택 시 호출
  const handleDayPress = (day) => {
    const selected = paintingsData.find(
      (painting) => painting.date === day.dateString
    );
    if (selected) {
      setSelectedPainting(selected);
      setModalVisible(true); // 모달 표시
    } else {
      Alert.alert('No Data', 'There is no painting for this date.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/img/background.png')}
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Desk Calendar</Text>

        {/* 캘린더 */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={new Date().toISOString().split('T')[0]} // 현재 날짜로 설정
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
            onDayPress={handleDayPress} // 날짜 선택 시 호출
          />
        </View>

        {/* 뒤로 가기 버튼 */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>

        {/* 상세보기 모달 */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            {selectedPainting && (
              <View style={styles.modalContent}>
                <Image
                  source={getImagePath(selectedPainting.image_path)} // 동적 이미지 로드
                  style={styles.paintingImage}
                />
                <Text style={styles.paintingTitle}>{selectedPainting.title}</Text>
                <Text style={styles.paintingDate}>{selectedPainting.date}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  paintingImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  paintingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paintingDate: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CalendarScreen;