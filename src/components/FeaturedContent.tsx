// src/components/FeaturedContent/FeaturedContent.tsx
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Dimensions, 
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

interface FeaturedContentData {
  title: string;
  description: string;
  characters: string[];
}

interface FeaturedContentProps {
  data?: FeaturedContentData[] | FeaturedContentData;
  onPlayPress?: (index: number) => void;
  onMoreInfoPress?: (index: number) => void;
}

const FeaturedContent: React.FC<FeaturedContentProps> = ({ 
  data, 
  onPlayPress, 
  onMoreInfoPress 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Convert single object to array, or use empty array as fallback
  const featuredItems: FeaturedContentData[] = React.useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  }, [data]);

  // Early return if no data
  if (featuredItems.length === 0) {
    return null;
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const renderFeaturedItem = (item: FeaturedContentData, index: number) => (
    <View key={index} style={styles.featuredSlide}>
      {/* Character Row */}
      <View style={styles.charactersRow}>
        {item.characters.map((char, charIndex) => (
          <Image 
            key={charIndex} 
            source={{ uri: char }} 
            style={styles.characterImage} 
          />
        ))} 
      </View>
      
      {/* Title and Description */}
      <Text style={styles.featuredTitle}>{item.title}</Text>
      <Text style={styles.featuredDescription}>{item.description}</Text>
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={() => onPlayPress?.(index)}
        >
          <View style={styles.playIcon} />
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.infoButton} 
          onPress={() => onMoreInfoPress?.(index)}
        >
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>i</Text>
          </View>
          <Text style={styles.infoButtonText}>More Info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.featuredContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="center"
        contentContainerStyle={styles.scrollContent}
      >
        {featuredItems.map((item, index) => renderFeaturedItem(item, index))}
      </ScrollView>
      
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {featuredItems.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => scrollToIndex(index)}
            style={[
              styles.progressDot,
              index === currentIndex && styles.progressDotActive
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  featuredContainer: {
    marginBottom: 30,
  },
  scrollContent: {
    alignItems: 'flex-start',
  },
  featuredSlide: {
    width: width,
    paddingHorizontal: 20,
  },
  charactersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  characterImage: {
    width: wp('15%'),
    height: hp('15%'),
    resizeMode: 'contain',
    backgroundColor: '#393DA0',
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  featuredDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 6,
    marginRight: 15,
  },
  playIcon: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12,
    borderRightWidth: 0,
    borderBottomWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: '#000000',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginRight: 8,
  },
  playButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(109, 109, 110, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  infoIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#333333',
    marginHorizontal: 3,
  },
  progressDotActive: {
    backgroundColor: '#FFFFFF',
  },
});

export default FeaturedContent;