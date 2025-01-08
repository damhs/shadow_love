import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.goBack(); // 3초 후 Home 화면으로 이동
    }, 30000);

    return () => clearTimeout(timeout); // 컴포넌트 언마운트 시 타이머 제거
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/videos/Loading_D2.mov')} // 로컬 영상 파일 경로
        style={styles.video}
        resizeMode="cover" // 영상 크기 조정
        repeat={true} // 반복 재생
      />
      <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    ...StyleSheet.absoluteFillObject, // 전체 화면으로 영상 표시
  },
  loader: {
    position: 'absolute',
  },
});

export default LoadingScreen;
