// src/screens/Home/HomeScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import FeaturedContent from '../../components/FeaturedContent';
import ContinueWatching from '../../components/ContinueWatching';
import HorizontalList from '../../components/HorizontalList';
import { mockData } from '../../data/mockData';
import { ContinueWatchingItem, MediaItem } from '../../types';
import { DrawerActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { GetRandom, GetStream, GetTopTen } from '../../service/AxiosConfig';

type DrawerParamList = {
  HomeScreen: undefined;
  SellerHub: undefined;
  MyNetwork: undefined;
  MyProfile: undefined;
};
type HomeScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'HomeScreen'>;
interface StreamApiResponse {
  success: boolean;
  results: {
    streamingLink: {
      id: string;
      type: 'sub' | 'dub';
      link: {
        file: string;
        type: string;
      };
      tracks: Array<{
        file: string;
        label: string;
        kind: string;
        default?: boolean;
      }>;
      intro: {
        start: number;
        end: number;
      };
      outro: {
        start: number;
        end: number;
      };
      server: string;
    };
    servers: Array<{
      type: 'sub' | 'dub';
      data_id: string;
      server_id: string;
      serverName: string;
    }>;
  };
}
interface TopTenApiItem {
  data_id: string;
  id: string;
  japanese_title: string;
  number: string;
  poster: string;
  title: string;
  tvInfo: any; 
}
interface TopTenApiResponse {
  success: boolean;
  results: {
    month: TopTenApiItem[];
    today: TopTenApiItem[];
    week: TopTenApiItem[];
  };
}
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
interface ApiError {
  error: string;
}

// Loader Component
const LoaderScreen = () => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color="#E50914" />
    <Text style={styles.loaderText}>Loading content...</Text>
  </View>
);

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [streamData, setStreamData] = useState<StreamApiResponse | null>(null);
  const [topTenData, setTopTenData] = useState<TopTenApiResponse | null>(null);
  const [featuredData, setFeaturedData] = useState<FeaturedContentData[]>([]);
  const [weeklyTrendingData, setWeeklyTrendingData] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const transformTopTenToFeatured = (topTenItems: TopTenApiItem[]): FeaturedContentData[] => {
    return topTenItems.slice(0, 7).map((item, index) => ({
      id: item.id,
      title: item.title,
      subtitle: item.japanese_title,
      description: `Ranked #${item.number} - ${item.title} is one of the most popular anime series. Join millions of fans watching this incredible story unfold with amazing characters and plot twists.`,
      image: item.poster,
      characters: Array.from({ length: 5 }, (_, i) => 
        `https://images.unsplash.com/photo-${1500000000000 + (index * 5 + i)}?w=80&h=120&fit=crop&crop=face`
      ),
    }));
  };
  
  const transformTopTenToMediaItems = (topTenItems: TopTenApiItem[]): MediaItem[] => {
    return topTenItems.map((item, index) => ({
      id: parseInt(item.data_id),
      title: item.title,
      image: item.poster,
      genre: 'Anime', 
      rating: 8.5 + (Math.random() * 1.5), 
      year: 2024, 
      rank: parseInt(item.number),
      japanese_title: item.japanese_title,
      data_id: item.data_id,
    }));
  };

  const fetchAllData = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      setError(null);
      
      console.log('Fetching all data...');
      const [streamResponse, randomResponse, topTenResponse] = await Promise.all([
        GetStream().catch(err => ({ error: 'Stream API failed', details: err })),
        GetRandom().catch(err => ({ error: 'Random API failed', details: err })),
        GetTopTen().catch(err => ({ error: 'TopTen API failed', details: err }))
      ]);

      console.log('Stream Response:', streamResponse);
      console.log('Random Response:', randomResponse);
      console.log('TopTen Response:', topTenResponse);
      
      if (topTenResponse?.success && topTenResponse?.results) {
        setTopTenData(topTenResponse as TopTenApiResponse);
        const monthlyTopTen = topTenResponse.results.month || [];
        const transformedFeatured = transformTopTenToFeatured(monthlyTopTen);
        setFeaturedData(transformedFeatured);
        const weeklyTopTen = topTenResponse.results.week || [];
        const transformedWeeklyTrending = transformTopTenToMediaItems(weeklyTopTen);
        setWeeklyTrendingData(transformedWeeklyTrending);
        console.log('TopTen data processed successfully:', {
          monthCount: monthlyTopTen.length,
          featuredCount: transformedFeatured.length,
          weekCount: weeklyTopTen.length,
          weeklyTrendingCount: transformedWeeklyTrending.length
        });
      } else {
        console.warn('TopTen API failed, using mock data');
        setFeaturedData(mockData.featured);
        setWeeklyTrendingData(mockData.trending);
      }
  
      if (streamResponse?.error) {
        console.error('Stream API Error:', streamResponse.error);
      } else if (streamResponse?.success && streamResponse?.results) {
        setStreamData(streamResponse as StreamApiResponse);
        console.log('Stream data fetched successfully');
      }

    } catch (err) {
      console.error('Fetch data error:', err);
      setError('Failed to fetch data');
 
      setFeaturedData(mockData.featured);
      setWeeklyTrendingData(mockData.trending);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchAllData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Optionally refetch data when screen is focused
      // fetchAllData(false);
    }, [])
  );

  // Pull to refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllData(false);
  }, []);

  const handleMenuPress = () => {
    console.log('Menu pressed');
    try {
      navigation.dispatch(DrawerActions.openDrawer());
    } catch (error) {
      console.log('Error opening drawer:', error);
      try {
        navigation.openDrawer();
      } catch (altError) {
        console.log('Alternative method also failed:', altError);
      }
    }
  };

  const handlePlayPress = (item: FeaturedContentData, index: number) => {
    console.log('Play pressed for:', item.title, 'at index:', index);
    const topTenItem = topTenData?.results?.month?.[index];
    if (topTenItem) {
      console.log('TopTen item data:', topTenItem);
      // navigation?.navigate('Player', { 
      //   content: item, 
      //   topTenData: topTenItem,
      //   dataId: topTenItem.data_id 
      // });
    }
  };
  
  const handleMoreInfoPress = (item: FeaturedContentData, index: number) => {
    console.log('More info pressed for:', item.title, 'at index:', index);
    const topTenItem = topTenData?.results?.month?.[index];
    if (topTenItem) {
      console.log('TopTen item data for details:', topTenItem);
      // Navigate to details with both featured and TopTen data
      // navigation?.navigate('Details', { 
      //   content: item, 
      //   topTenData: topTenItem,
      //   dataId: topTenItem.data_id 
      // });
    }
  };

  const handleContinueWatchingPress = (item: ContinueWatchingItem) => {
    console.log('Continue watching pressed:', item.title);
    // navigation?.navigate('Player', { content: item });
  };

  const handleMediaItemPress = (item: MediaItem) => {
    console.log('Media item pressed:', item.title);
    
    // Check if this item has additional TopTen data
    if (item.data_id) {
      console.log('Item has TopTen data_id:', item.data_id);
      console.log('Additional info - Rank:', item.rank, 'Japanese Title:', item.japanese_title);
    }
    
    // navigation?.navigate('Details', { content: item });
  };

  // Debug info
  console.log('Current featured data count:', featuredData.length);
  console.log('Current weekly trending data count:', weeklyTrendingData.length);
  console.log('Loading state:', loading);
  console.log('Error state:', error);

  // Show loader when loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <LoaderScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
            colors={['#FFFFFF']}
          />
        }
      >
        <Header onMenuPress={handleMenuPress} />
                   
        <FeaturedContent
          data={featuredData.length > 0 ? featuredData : mockData.featured}
          onPlayPress={handlePlayPress}
          onMoreInfoPress={handleMoreInfoPress}
        />
         
        <ContinueWatching
          data={mockData.continueWatching}
          onItemPress={handleContinueWatchingPress}
        />
         
        <HorizontalList
          title="Trending This Week"
          data={weeklyTrendingData.length > 0 ? weeklyTrendingData : mockData.trending}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loaderText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
});