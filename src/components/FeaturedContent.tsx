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
import { useNavigation } from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

// Navigation types - adjust these according to your navigation setup
type NavigationProps = {
  navigate: (screen: string, params?: any) => void;
};

// Updated interface to match the data structure from HomeScreen
interface FeaturedContentData {
  id?: string;
  title: string;
  description: string;
  image?: string;
  characters?: string[];
  subtitle?: string;
  streamData?: {
    url: string;
    type: string;
    subtitles: any[];
    intro?: { start: number; end: number };
    outro?: { start: number; end: number };
    servers: any[];
    currentServer: string;
  };
}

interface FeaturedContentProps {
  data?: FeaturedContentData[] | FeaturedContentData;
  onPlayPress?: (item: FeaturedContentData, index: number) => void;
  onMoreInfoPress?: (item: FeaturedContentData, index: number) => void;
}

const FeaturedContent: React.FC<FeaturedContentProps> = ({ 
  data, 
  onPlayPress, 
  onMoreInfoPress 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation<NavigationProps>();

  // Convert single object to array, or use empty array as fallback
  const featuredItems: FeaturedContentData[] = React.useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  }, [data]);

  // Early return if no data
  if (featuredItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No featured content available</Text>
      </View>
    );
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

  // Handle play button press with navigation
  const handlePlayPress = (item: FeaturedContentData, index: number) => {
    console.log('Play pressed for:', item.title, 'at index:', index);
    
    // Call the original onPlayPress if provided
    if (onPlayPress) {
      onPlayPress(item, index);
    }
    
    try {
      // Navigate to Anime Home Screen with the selected anime data
      navigation.navigate('AnimeHomeScreen', {
        animeData: {
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          description: item.description,
          image: item.image,
          characters: item.characters,
          streamData: item.streamData,
        },
        fromScreen: 'Featured',
        index: index
      });
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback - you might want to show an alert or handle this differently
      console.log('Failed to navigate to AnimeHome screen');
    }
  };

  // Handle more info button press
  const handleMoreInfoPress = (item: FeaturedContentData, index: number) => {
    console.log('More info pressed for:', item.title, 'at index:', index);
    
    // Call the original onMoreInfoPress if provided
    if (onMoreInfoPress) {
      onMoreInfoPress(item, index);
    }
    
    try {
      // Navigate to Anime Details Screen
      navigation.navigate('AnimeDetails', {
        animeData: {
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          description: item.description,
          image: item.image,
          characters: item.characters,
          streamData: item.streamData,
        },
        fromScreen: 'Featured',
        index: index
      });
    } catch (error) {
      console.error('Navigation error:', error);
      console.log('Failed to navigate to AnimeDetails screen');
    }
  };

  const renderStreamingInfo = (item: FeaturedContentData) => {
    if (!item.streamData) return null;

    return (
      <View style={styles.streamingInfo}>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>STREAMING</Text>
        </View>
        <Text style={styles.serverInfo}>
          Server: {item.streamData.currentServer} • {item.streamData.subtitles.length} Subtitles
        </Text>
      </View>
    );
  };

  const renderFeaturedItem = (item: FeaturedContentData, index: number) => (
    <View key={index} style={styles.featuredSlide}>
      {/* Background Image (if available) */}
      {item.image && (
        <Image 
          source={{ uri: item.image }} 
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      )}
      
      {/* Content Overlay */}
      <View style={styles.contentOverlay}>
        {/* Character Row - with fallback if no characters */}
        <View style={styles.charactersRow}>
          {item.characters && item.characters.length > 0 ? (
            item.characters.map((char, charIndex) => (
              <Image 
                key={charIndex} 
                source={{ uri: char }} 
                style={styles.characterImage} 
              />
            ))
          ) : (
            // Fallback character placeholders
            Array.from({ length: 5 }).map((_, charIndex) => (
              <View 
                key={charIndex} 
                style={[
                  styles.characterImage, 
                  styles.characterPlaceholder,
                  { backgroundColor: charIndex % 2 === 0 ? '#393DA0' : '#8B5CF6' }
                ]} 
              />
            ))
          )}
        </View>
        
        {/* Streaming Info */}
        {renderStreamingInfo(item)}
        
        {/* Title and Subtitle */}
        <Text style={styles.featuredTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.featuredSubtitle}>{item.subtitle}</Text>
        )}
        
        {/* Description */}
        <Text style={styles.featuredDescription} numberOfLines={3}>
          {item.description}
        </Text>
        
        {/* Stream Quality and Info */}
        {item.streamData && (
          <View style={styles.qualityInfo}>
            <View style={styles.qualityBadge}>
              <Text style={styles.qualityText}>HD</Text>
            </View>
            <View style={styles.subtitleBadge}>
              <Text style={styles.subtitleText}>CC</Text>
            </View>
            <Text style={styles.streamType}>
              {item.streamData.type.toUpperCase()}
            </Text>
          </View>
        )}
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.playButton,
              item.streamData && styles.playButtonLive
            ]} 
            onPress={() => handlePlayPress(item, index)}
          >
            <View style={styles.playIcon} />
            <Text style={[
              styles.playButtonText,
              item.streamData && styles.playButtonTextLive
            ]}>
              {item.streamData ? 'Watch Now' : 'Play'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.infoButton} 
            onPress={() => handleMoreInfoPress(item, index)}
          >
            <View style={styles.infoIcon}>
              <Text style={styles.infoIconText}>i</Text>
            </View>
            <Text style={styles.infoButtonText}>More Info</Text>
          </TouchableOpacity>
        </View>
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
      
      {/* Progress Indicator - only show if multiple items */}
      {featuredItems.length > 1 && (
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
      )}
    </View>
  );
};

export default FeaturedContent;

const styles = StyleSheet.create({
  featuredContainer: {
    marginBottom: 30,
    minHeight: hp('45%'),
  },
  emptyContainer: {
    height: hp('30%'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollContent: {
    alignItems: 'flex-start',
  },
  featuredSlide: {
    width: width,
    position: 'relative',
    minHeight: hp('45%'),
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  contentOverlay: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'flex-end',
    paddingBottom: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  streamingInfo: {
    marginBottom: 15,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
    marginRight: 8,
  },
  liveText: {
    color: '#FF0000',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  serverInfo: {
    color: '#CCCCCC',
    fontSize: 12,
    opacity: 0.8,
  },
  charactersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  characterImage: {
    width: wp('15%'),
    height: hp('12%'),
    resizeMode: 'cover',
    borderRadius: 4,
  },
  characterPlaceholder: {
    backgroundColor: '#393DA0',
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  featuredSubtitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    opacity: 0.9,
  },
  featuredDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  qualityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  qualityBadge: {
    backgroundColor: '#00C851',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  qualityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  subtitleBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  subtitleText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  streamType: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playButtonLive: {
    backgroundColor: '#FF0000',
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
  playButtonTextLive: {
    color: '#FFFFFF',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(109, 109, 110, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
    marginTop: 10,
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