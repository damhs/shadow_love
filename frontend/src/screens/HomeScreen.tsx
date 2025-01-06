import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
  Text,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import paintingsData from '../../datas/paintings.json';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useBackground } from './BackgroundContext'; // BackgroundContext 사용

// 이미지 매핑 객체
const imageMapping = {
  painting1: require('../assets/painting/painting1.webp'),
  painting2: require('../assets/painting/painting2.webp'),
  painting3: require('../assets/painting/painting3.webp'),
};

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { background } = useBackground(); // 선택된 배경 가져오기
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCalendarPress = () => navigation.navigate('Calendar');
  const handleSettingsPress = () => navigation.navigate('Setting');

  const handleLeftArrowPress = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else setCurrentIndex(paintingsData.length - 1);
  };

  const handleRightArrowPress = () => {
    if (currentIndex < paintingsData.length - 1) setCurrentIndex(currentIndex + 1);
    else setCurrentIndex(0);
  };

  const handlePencilPress = () => navigation.navigate('Diary');
  const handleGridPress = () => navigation.navigate('Explore');

  const currentPainting = paintingsData[currentIndex];

  // 배경에 따라 동적으로 스타일 설정
  const dynamicStyles = () => {
    if (background === require('../assets/img/background.png')) {
      return {
        imageContainer: {
          marginTop: height * 0.145,
          marginBottom: height * 0.06,
        },
        image: {
          width: width * 0.4,
          height: height * 0.31,
        },
        title: {
          fontSize: width * 0.05,
          marginTop: height * 0.06,
        },
        date: {
          marginTop: height * 0.01,
          fontSize: width * 0.045,
        },
      };
    } else if (background === require('../assets/img/background2.webp')) {
      return {
        imageContainer: {
          marginTop: height * 0.186,
          marginBottom: height * 0.1,
        },
        image: {
          width: width * 0.36,
          height: height * 0.335,
        },
        title: {
          fontSize: width * 0.05,
          marginTop: height * 0.06,
        },
        date: {
          marginTop: height * 0.015,
          fontSize: width * 0.04,
        },
      };
    } else if (background === require('../assets/img/background3.webp')) {
      return {
        imageContainer: {
          marginTop: height * 0.14,
          marginBottom: height * 0.05,
        },
        image: {
          width: width * 0.42,
          height: height * 0.33,
        },
        title: {
          fontSize: width * 0.05,
          marginTop: height * 0.06,
        },
        date: {
          marginTop: height * 0.02,
          fontSize: width * 0.05,
        },
      };
    }
    return {};
  };

  const styles = dynamicStyles();

  return (
    <ImageBackground source={background} style={baseStyles.background}>
      <View style={baseStyles.container}>
        {/* 상단 아이콘 */}
        <View style={baseStyles.topBar}>
          <TouchableOpacity onPress={handleCalendarPress}>
            <Icon name="calendar-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettingsPress}>
            <Icon name="settings-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 그림 및 정보 표시 */}
        <View style={[baseStyles.imageContainer, styles.imageContainer]}>
          <Image source={imageMapping[currentPainting.image]} style={[baseStyles.image, styles.image]} />
          <Text style={[baseStyles.title, styles.title]}>{currentPainting.title}</Text>
          <Text style={[baseStyles.date, styles.date]}>{currentPainting.date}</Text>
        </View>

        {/* 좌우 화살표 */}
        <View style={baseStyles.arrowsContainer}>
          <TouchableOpacity style={baseStyles.arrowButton} onPress={handleLeftArrowPress}>
            <Icon name="chevron-back-outline" size={40} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={baseStyles.arrowButton} onPress={handleRightArrowPress}>
            <Icon name="chevron-forward-outline" size={40} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 하단 버튼 */}
        <TouchableOpacity style={[baseStyles.floatingButton, baseStyles.leftButton]} onPress={handlePencilPress}>
          <Icon name="brush-outline" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[baseStyles.floatingButton, baseStyles.rightButton]} onPress={handleGridPress}>
          <MaterialIcons name="museum" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const baseStyles = StyleSheet.create({
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
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'stretch',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
  },
  date: {
    color: '#aaa',
  },
  arrowsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '50%',
    left: width * 0.05,
    right: width * 0.05,
  },
  arrowButton: {
    padding: width * 0.03,
  },
  floatingButton: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    backgroundColor: 'rgba(44, 44, 44, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  leftButton: {
    bottom: height * 0.05,
    left: width * 0.05,
  },
  rightButton: {
    bottom: height * 0.05,
    right: width * 0.05,
  },
});

export default HomeScreen;
