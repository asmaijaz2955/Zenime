// src/components/ContinueWatching/ContinueWatching.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface ContinueWatchingItem {
  id: number;
  title: string;
  image: string;
  progress: number;
}

interface ContinueWatchingProps {
  data: ContinueWatchingItem[];
  onItemPress?: (item: ContinueWatchingItem) => void;
}

const ContinueWatching: React.FC<ContinueWatchingProps> = ({ data, onItemPress }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Continue Watching</Text>
      <View style={styles.continueWatchingContainer}>
        {data.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.continueItem}
            onPress={() => onItemPress?.(item)}
          >
            <Image source={{ uri: item.image }} style={styles.continueImage} />
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  continueWatchingContainer: {
    paddingHorizontal: 20,
  },
  continueItem: {
    marginBottom: 10,
  },
  continueImage: {
    width: 120,
    height: 160,
    borderRadius: 8,
    marginBottom: 5,
  },
  progressBar: {
    width: 120,
    height: 3,
    backgroundColor: '#333333',
    borderRadius: 1.5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E50914',
    borderRadius: 1.5,
  },
});

export default ContinueWatching;