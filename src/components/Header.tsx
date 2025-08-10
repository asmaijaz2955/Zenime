// src/components/Header.tsx - Make sure your Header component looks like this
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

interface HeaderProps {
  onMenuPress: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress, title = "Zenime" }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          {/* Replace this with your menu icon */}
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.rightSpace} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#000000',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
  },
  menuButton: {
    padding: 8,
    borderRadius: 4,
  },
  menuIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  rightSpace: {
    width: 40, // To balance the left menu button
  },
});

export default Header;