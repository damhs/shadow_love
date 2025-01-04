import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecordScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Record Screen</Text>
      <Text>View your activity and records here.</Text>
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

export default RecordScreen;
