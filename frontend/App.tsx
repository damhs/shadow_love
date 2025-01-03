import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppBar from './src/components/AppBar';
import BottomNavigationBar from './src/components/BottomNavigationBar';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AppBar title="My First App" />
      <BottomNavigationBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;
