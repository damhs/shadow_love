import React from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const App = () => {
  const handleCalendarPress = () => {
    Alert.alert('Calendar', 'Calendar button pressed!');
  };

  const handleSettingsPress = () => {
    Alert.alert('Settings', 'Settings button pressed!');
  };

  const handleLeftArrowPress = () => {
    Alert.alert('Left Arrow', 'Navigating to the previous item...');
  };

  const handleRightArrowPress = () => {
    Alert.alert('Right Arrow', 'Navigating to the next item...');
  };

  const handlePencilPress = () => {
    Alert.alert('Pencil', 'Opening the drawing feature...');
  };

  const handleGridPress = () => {
    Alert.alert('Grid', 'Opening the gallery...');
  };

  return (
    <View style={styles.container}>
      {/* Top icons */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleCalendarPress}>
          <Icon name="calendar-outline" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSettingsPress}>
          <Icon name="settings-outline" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Frame */}
      <View style={styles.frameContainer}>
        <View style={styles.frame} />
      </View>

      {/* Side arrows */}
      <View style={styles.arrowsContainer}>
        <TouchableOpacity style={styles.arrowButton} onPress={handleLeftArrowPress}>
          <Icon name="chevron-back-outline" size={40} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.arrowButton} onPress={handleRightArrowPress}>
          <Icon name="chevron-forward-outline" size={40} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Bottom buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.iconButton} onPress={handlePencilPress}>
          <Icon name="pencil-outline" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleGridPress}>
          <Icon name="grid-outline" size={30} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  frameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: '80%',
    height: '60%',
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  arrowsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
  },
  arrowButton: {
    padding: 10,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
  iconButton: {
    alignItems: 'center',
  },
});

export default App;
