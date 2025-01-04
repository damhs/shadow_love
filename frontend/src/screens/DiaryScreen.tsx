import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DiaryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diary Screen</Text>
      <Text>This is where you can view and write diary entries.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DiaryScreen;
