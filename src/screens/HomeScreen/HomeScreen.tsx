// src/screens/Home/HomeScreen.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import Header from '../../components/Header';
import FeaturedContent from '../../components/FeaturedContent';
import ContinueWatching from '../../components/ContinueWatching';
import HorizontalList from '../../components/HorizontalList';

// Data and Types
import { mockData } from '../../data/mockData';
import { NavigationProps, ContinueWatchingItem, MediaItem } from '../../types';

interface HomeScreenProps {
  navigation?: NavigationProps;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Handler functions
  const handleMenuPress = () => {
    console.log('Menu pressed');
    // navigation?.navigate('Menu');
  };

  const handlePlayPress = () => {
    console.log('Play pressed');
    // navigation?.navigate('Player', { content: mockData.featured });
  };

  const handleMoreInfoPress = () => {
    console.log('More info pressed');
    // navigation?.navigate('Details', { content: mockData.featured });
  };

  const handleContinueWatchingPress = (item: ContinueWatchingItem) => {
    console.log('Continue watching pressed:', item.title);
    // navigation?.navigate('Player', { content: item });
  };

  const handleMediaItemPress = (item: MediaItem) => {
    console.log('Media item pressed:', item.title);
    // navigation?.navigate('Details', { content: item });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Header onMenuPress={handleMenuPress} />
        
        <FeaturedContent 
          data={mockData.featured}
          onPlayPress={handlePlayPress}
          onMoreInfoPress={handleMoreInfoPress}
        />
        
        <ContinueWatching 
          data={mockData.continueWatching}
          onItemPress={handleContinueWatchingPress}
        />
        
        <HorizontalList 
          title="Trending Now" 
          data={mockData.trending}
          onItemPress={handleMediaItemPress}
        />
        
        <HorizontalList 
          title="Top Series" 
          data={mockData.topSeries}
          onItemPress={handleMediaItemPress}
        />
        
        <HorizontalList 
          title="Top Film" 
          data={mockData.topFilm}
          onItemPress={handleMediaItemPress}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
});

export default HomeScreen;