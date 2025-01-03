import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Header = ({ title }) => (
  <Text style={styles.title}>{title}</Text>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D982B5',
    marginBottom: 40,
  },
});

export default Header;
