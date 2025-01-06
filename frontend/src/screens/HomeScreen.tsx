import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Text,
} from 'react-native';
import paintingsData from '../../datas/paintings.json';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// 이미지 매핑 객체
const imageMapping = {
  painting1: require('../assets/painting/painting1.webp'),
  painting2: require('../assets/painting/painting2.webp'),
  painting3: require('../assets/painting/painting3.webp'),
};

const HomeScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 이미지 인덱스

  const handleCalendarPress = () => {
    navigation.navigate('Calendar'); // CalendarScreen으로 이동
  };

  const handleSettingsPress = () => {
    navigation.navigate('Setting');
  };

  const handleLeftArrowPress = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(paintingsData.length - 1); // 첫 번째 이미지에서 마지막으로 이동
    }
  };

  const handleRightArrowPress = () => {
    if (currentIndex < paintingsData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // 마지막 이미지에서 첫 번째로 이동
    }
  };

  const handlePencilPress = () => {
    navigation.navigate('Diary'); // DiaryScreen으로 이동
  };

  const handleGridPress = () => {
    navigation.navigate('Explore');
  };

  const currentPainting = paintingsData[currentIndex]; // 현재 그림 정보 가져오기

  return (
    <ImageBackground
      source={require('../assets/img/background.png')} // 홈 화면 배경 이미지
      style={styles.background}>
      <View style={styles.container}>
        {/* Top icons */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleCalendarPress}>
            <Icon name="calendar-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettingsPress}>
            <Icon name="settings-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 이미지 표시 */}
        <View style={styles.imageContainer}>
          <Image
            source={imageMapping[currentPainting.image]} // 매핑된 이미지 로드
            style={styles.image}
          />
          <Text style={styles.title}>{currentPainting.title}</Text>
          <Text style={styles.date}>{currentPainting.date}</Text>
        </View>

        {/* Side arrows */}
        <View style={styles.arrowsContainer}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={handleLeftArrowPress}>
            <Icon name="chevron-back-outline" size={40} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={handleRightArrowPress}>
            <Icon name="chevron-forward-outline" size={40} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Floating Buttons */}
        <TouchableOpacity
          style={[styles.floatingButton, styles.leftButton]}
          onPress={handlePencilPress}>
          <Icon name="brush-outline" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.floatingButton, styles.rightButton]}
          onPress={handleGridPress}>
          <MaterialIcons name="museum" size={30} color="#fff" />
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
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -30,
  },
  image: {
    width: 275, // 이미지 가로 크기
    height: 345, // 이미지 세로 크기
    resizeMode: 'stretch',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#fff',
  },
  date: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 5,
  },
  arrowsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
  },
  arrowButton: {
    padding: 10,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(44, 44, 44, 0.8)',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  leftButton: {
    bottom: 20,
    left: 20,
  },
  rightButton: {
    bottom: 20,
    right: 20,
  },
});

export default HomeScreen;