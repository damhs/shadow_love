import React from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
    <ImageBackground
      source={require('./src/assets/img/background.png')}
      style={styles.background}>
      <View style={styles.container}>
        {/* Top icons */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleCalendarPress}>
            <Icon name="calendar-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettingsPress}>
            <Icon name="settings-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Side arrows */}
        <View style={styles.arrowsContainer}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={handleLeftArrowPress}>
            <Icon name="chevron-back-outline" size={40} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={handleRightArrowPress}>
            <Icon name="chevron-forward-outline" size={40} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Floating Buttons */}
        <TouchableOpacity
          style={[styles.floatingButton, styles.leftButton]}
          onPress={handlePencilPress}>
          <Icon name="brush-outline" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.floatingButton, styles.rightButton]}
          onPress={handleGridPress}>
          <MaterialIcons name="museum" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
    paddingHorizontal: 20,
    marginTop: 20,
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
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(44, 44, 44, 0.8)',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  leftButton: {
    bottom: 20,
    left: 20,
  },
  rightButton: {
    bottom: 20,
    right: 20,
  },
});

export default App;
