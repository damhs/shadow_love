import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';


interface AuthButtonProps {
  label: string;
  onPress?: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    color: '#333',
  },
});

export default AuthButton;
