import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const InputField = ({ placeholder, width = '100%', height = 50, backgroundColor = '#fff', borderColor = '#ccc' }) => (
  <TextInput
    style={[
      styles.input,
      { width, height, backgroundColor, borderColor },
    ]}
    placeholder={placeholder}
    placeholderTextColor="#999"
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
});

export default InputField;
