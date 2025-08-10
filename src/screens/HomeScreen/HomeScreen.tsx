// src/screens/Home/HomeScreen.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import FeaturedContent from '../../components/FeaturedContent';
import ContinueWatching from '../../components/ContinueWatching';
import HorizontalList from '../../components/HorizontalList';
import { mockData } from '../../data/mockData';
import { ContinueWatchingItem, MediaItem } from '../../types';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type DrawerParamList = {
  HomeScreen: undefined;
  SellerHub: undefined;
  MyNetwork: undefined;
  MyProfile: undefined;
};

type HomeScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'HomeScreen'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleMenuPress = () => {
    console.log('Menu pressed');
    try {
      // Direct method to open drawer
      navigation.dispatch(DrawerActions.openDrawer());
    } catch (error) {
      console.log('Error opening drawer:', error);
      
      // Alternative method if the above doesn't work
      try {
        navigation.openDrawer();
      } catch (altError) {
        console.log('Alternative method also failed:', altError);
      }
    }
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
});