import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';

const TransitionScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home'); // 5초 후 'Home' 화면으로 이동
    }, 5000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/videos/transition.mp4')} // 비디오 파일 경로
        style={styles.video}
        resizeMode="cover"
        repeat={false} // 반복하지 않음
        onEnd={() => navigation.navigate('Home')} // 비디오 끝나면 이동
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // 검은 배경
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default TransitionScreen;
