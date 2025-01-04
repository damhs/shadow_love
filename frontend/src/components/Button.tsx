import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';

const Button = ({
  title,
  onPress,
  width = '100%',
  height = 50,
  backgroundColor = '#fff',
  textColor = '#000',
  imageSource = null, // 이미지 경로 (기본값: null)
  imageSize = 24, // 이미지 크기 (기본값: 24)
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      { width, height, backgroundColor },
    ]}
    onPress={onPress}
  >
    <View style={styles.content}>
      {/* 이미지가 있을 경우에만 렌더링 */}
      {imageSource && (
        <Image
          source={imageSource}
          style={[styles.image, { width: imageSize, height: imageSize }]}
        />
      )}
      {/* 텍스트 */}
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row', // 이미지와 텍스트를 가로로 정렬
  },
  content: {
    flexDirection: 'row', // 이미지와 텍스트를 가로로 배치
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginRight: 10, // 텍스트와 이미지 간격
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;

