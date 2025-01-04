import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const handleRegister = () => {
    // Navigate to the main tabs after registration
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Screen</Text>
      <Text>Register your account to get started!</Text>
      <Button title="Register" onPress={handleRegister} />
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

export default RegisterScreen;
