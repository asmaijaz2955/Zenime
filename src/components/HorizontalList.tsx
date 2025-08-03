// src/components/HorizontalList/HorizontalList.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface ListItem {
  id: number;
  title: string;
  image: string;
}

interface HorizontalListProps {
  title: string;
  data: ListItem[];
  onItemPress?: (item: ListItem) => void;
}

const HorizontalList: React.FC<HorizontalListProps> = ({ title, data, onItemPress }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.horizontalList}
        contentContainerStyle={styles.horizontalListContent}
      >
        {data.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.listItem}
            onPress={() => onItemPress?.(item)}
          >
            <Image source={{ uri: item.image }} style={styles.listItemImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  horizontalList: {
    paddingLeft: 20,
  },
  horizontalListContent: {
    paddingRight: 20,
  },
  listItem: {
    marginRight: 10,
  },
  listItemImage: {
    width: 120,
    height: 160,
    borderRadius: 8,
  },
});

export default HorizontalList;