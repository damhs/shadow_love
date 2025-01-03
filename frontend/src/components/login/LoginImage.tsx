import React from 'react';
import { Image, StyleSheet } from 'react-native';

const LoginImage = () => {
  return (
    <Image
      style={styles.image}
      source={require('../../../assets/gamgi_intro.webp')}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
});

export default LoginImage;
