import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import paintingsData from '../../datas/paintings.json';

const imageMapping = {
  painting1: require('../assets/painting/painting1.webp'),
  painting2: require('../assets/painting/painting2.webp'),
  painting3: require('../assets/painting/painting3.webp'),
};

const ExploreScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLeftArrowPress = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(paintingsData.length - 1);
    }
  };

  const handleRightArrowPress = () => {
    if (currentIndex < paintingsData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const currentPainting = paintingsData[currentIndex];

  const handleCalendarPress = () => {
    navigation.navigate('Calendar'); // 달력 화면으로 이동
  };

  return (
    <ImageBackground
      source={require('../assets/img/background.png')}
      style={styles.background}>
      <View style={styles.container}>
        {/* Top icons */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={handleCalendarPress}>
              <Icon name="calendar-outline" size={30} color="#fff" />
            </TouchableOpacity>
          </View>

        {/* 그림 표시 */}
        <View style={styles.imageContainer}>
          <Image
            source={imageMapping[currentPainting.image]}
            style={styles.image}
          />
          <Text style={styles.title}>{currentPainting.title}</Text>
          <Text style={styles.date}>{currentPainting.date}</Text>
        </View>

        {/* 화살표 */}
        <View style={styles.arrowsContainer}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={handleLeftArrowPress}>
            <Text style={styles.arrowText}>◀</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={handleRightArrowPress}>
            <Text style={styles.arrowText}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* 뒤로가기 버튼 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>돌아가기</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 134,
  },
  image: {
    width: 275,
    height: 345,
    resizeMode: 'stretch',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 30,
  },
  date: {
    fontSize: 16,
    color: '#aaa',
  },
  arrowsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  arrowButton: {
    marginHorizontal: 20,
  },
  arrowText: {
    fontSize: 30,
    color: '#fff',
  },
  topBar: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  calendarButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  calendarButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ExploreScreen;
