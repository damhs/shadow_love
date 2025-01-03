import React from 'react';
import { StyleSheet, View } from 'react-native';

const LoginContainer = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC6C6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

export default LoginContainer;
