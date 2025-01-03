// src/components/InputField.tsx
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface InputFieldProps {
  placeholder: string;
  secureTextEntry?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  secureTextEntry = false,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginVertical: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    fontSize: 16,
  },
});

export default InputField;
