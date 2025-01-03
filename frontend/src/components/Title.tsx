import React from 'react';
import { StyleSheet, Text } from 'react-native';

const Title = ({ title }: { title: string }) => {
  return <Text style={styles.title}>{title}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F0A8D0',
    marginBottom: 30,
  },
});

export default Title;
