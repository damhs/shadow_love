import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BottomNavigationBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Home');

  return (
    <View style={styles.container}>
      {['Home', 'Profile', 'Settings'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            activeTab === tab && styles.activeTab,
          ]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={styles.tabText}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 56,
    backgroundColor: '#6200ea',
    position: 'absolute',
    bottom: 0, // Position at the bottom of the screen
    left: 0,
    right: 0,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  activeTab: {
    backgroundColor: '#3700b3',
  },
  tabText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default BottomNavigationBar;
