// src/components/Header/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface HeaderProps {
  onMenuPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
      </TouchableOpacity>
      <Text style={styles.logo}>Zenime</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuButton: {
    padding: 5,
  },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: '#FFFFFF',
    marginVertical: 2,
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});

export default Header;