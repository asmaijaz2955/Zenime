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
  const [topSeriesData, setTopSeriesData] = useState<MediaItem[]>([]);
  const [topFilmData, setTopFilmData] = useState<MediaItem[]>([]);
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
  const categorizeByShowType = (randomResponse: any) => {
    const series: MediaItem[] = [];
    const films: MediaItem[] = [];

    console.log('=== CATEGORIZATION DEBUG ===');
    console.log('Full randomResponse keys:', randomResponse ? Object.keys(randomResponse) : 'null');

    // Handle the specific structure from your API
    let dataArray: any[] = [];
    
    if (randomResponse?.success && randomResponse?.results) {
      console.log('Processing successful API response');
      
      // Combine recommended_data and related_data
      const recommendedData = randomResponse.results.recommended_data || [];
      const relatedData = randomResponse.results.related_data || [];
      
      dataArray = [...recommendedData, ...relatedData];
      console.log(`Found ${recommendedData.length} recommended items and ${relatedData.length} related items`);
      console.log(`Total combined items: ${dataArray.length}`);
    } else if (Array.isArray(randomResponse)) {
      dataArray = randomResponse;
      console.log('Input is direct array');
    } else if (randomResponse?.results && Array.isArray(randomResponse.results)) {
      dataArray = randomResponse.results;
      console.log('Input has results array');
    } else if (randomResponse?.data && Array.isArray(randomResponse.data)) {
      dataArray = randomResponse.data;
      console.log('Input has data array');
    } else if (randomResponse && typeof randomResponse === 'object') {
      // Try to find any array in the response
      const keys = Object.keys(randomResponse);
      for (const key of keys) {
        if (Array.isArray(randomResponse[key])) {
          dataArray = randomResponse[key];
          console.log(`Found array in key: ${key}`);
          break;
        }
      }
    }

    console.log('Processing array with length:', dataArray.length);
    
    if (dataArray.length === 0) {
      console.log('No data to process');
      return { series, films };
    }

    // Log first few items structure for debugging
    console.log('Sample item structures:');
    dataArray.slice(0, 3).forEach((item, index) => {
      console.log(`Item ${index}:`, {
        title: item.title,
        showType: item.showType,
        tvInfoShowType: item.tvInfo?.showType,
        hasAnimeInfo: !!item.animeInfo
      });
    });

    dataArray.forEach((item: any, index: number) => {
      if (!item || !item.title) {
        console.log(`Skipping invalid item at index ${index}`);
        return;
      }

      // Extract year from animeInfo if available, or use current year
      let year = 2024;
      if (item.animeInfo?.Aired) {
        const airedInfo = item.animeInfo.Aired;
        year = parseInt(airedInfo.split('-')[0]) || 2024;
      }

      const mediaItem: MediaItem = {
        id: parseInt(item.data_id || item.id || index.toString()),
        title: item.title,
        image: item.poster,
        genre: 'Anime',
        rating: 8.5 + (Math.random() * 1.5),
        year: year,
        japanese_title: item.japanese_title,
        data_id: item.data_id,
      };

      // Get showType - check tvInfo first as it's more reliable in your API structure
      const showType = item.tvInfo?.showType || 
                      item.showType || 
                      item.animeInfo?.tvInfo?.showType || 
                      item.animeInfo?.showType ||
                      item.type ||
                      'TV'; // Default to TV

      console.log(`Item ${index + 1}/${dataArray.length}: "${item.title}" - ShowType: "${showType}"`);
      
      // Categorize based on show type
      // Movies go to films, everything else goes to series
      if (showType && (
        showType === 'Movie' ||
        showType === 'movie' ||
        showType === 'MOVIE' ||
        showType === 'Movies' ||
        showType === 'movies' ||
        showType === 'Film' ||
        showType === 'film'
      )) {
        films.push(mediaItem);
        console.log(`✓ Added to FILMS: ${item.title} (Type: ${showType})`);
      } else {
        // All other types go to series: TV, Special, OVA, ONA, etc.
        series.push(mediaItem);
        console.log(`✓ Added to SERIES: ${item.title} (Type: ${showType})`);
      }
    });

    console.log('=== CATEGORIZATION RESULTS ===');
    console.log(`Total items processed: ${dataArray.length}`);
    console.log(`Series count: ${series.length}`);
    console.log(`Films count: ${films.length}`);
    
    // Show unique show types found
    const allShowTypes = dataArray.map(item => item.tvInfo?.showType || item.showType).filter(Boolean);
    const uniqueShowTypes = [...new Set(allShowTypes)];
    console.log('All show types found:', uniqueShowTypes);
    
    // Show films found
    const filmItems = films.map(f => {
      const originalItem = dataArray.find(d => d.title === f.title);
      return {
        title: f.title,
        showType: originalItem?.tvInfo?.showType || originalItem?.showType
      };
    });
    console.log('Films found:', filmItems);
    
    console.log('================================');

    return { series, films };
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
      const [randomResponse, topTenResponse] = await Promise.all([
       
        GetRandom().catch(err => ({ error: 'Random API failed', details: err })),
        GetTopTen().catch(err => ({ error: 'TopTen API failed', details: err }))
      ]);

     console.log('Random Response:', randomResponse.results);
      console.log('TopTen Response:', topTenResponse);
      // categorizeByShowType(randomResponse)
      // const { series, films } = categorizeByShowType(randomResponse);
      
      // setTopSeriesData(series);
      // setTopFilmData(films);
      
      // console.log('Categorization completed:', {
      //   seriesCount: series.length,
      //   filmsCount: films.length
      // });
      
      if (topTenResponse?.success && topTenResponse?.results) {
        setTopTenData(topTenResponse as TopTenApiResponse);
        const monthlyTopTen = topTenResponse.results.month || [];
        const transformedFeatured = transformTopTenToFeatured(monthlyTopTen);
        setFeaturedData(transformedFeatured);
        const weeklyTopTen = topTenResponse.results.week || [];
        console.log('weekly top ten',weeklyTopTen)
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
      console.log('Processing random data for series/films categorization...');
      console.log('Random response structure:', {
        hasSuccess: randomResponse?.hasOwnProperty('success'),
        hasResults: randomResponse?.hasOwnProperty('results'),
        isArray: Array.isArray(randomResponse),
        keys: randomResponse ? Object.keys(randomResponse) : null,
        hasError: randomResponse?.error
      });
      
      const { series, films } = categorizeByShowType(randomResponse);
      
      setTopSeriesData(series);
      setTopFilmData(films);
      
      console.log('Categorization completed:', {
        seriesCount: series.length,
        filmsCount: films.length
      });
      
      // Log sample items for debugging
      if (series.length > 0) {
        console.log('Sample series:', series.slice(0, 2));
      }
      if (films.length > 0) {
        console.log('Sample films:', films.slice(0, 2));
      }
      
      // Use mock data as fallback only if no data was categorized
      if (series.length === 0 && films.length === 0) {
        console.warn('No data was categorized, using mock data for series/films');
        setTopSeriesData(mockData.topSeries);
        setTopFilmData(mockData.topFilm);
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
          data={topSeriesData.length > 0 ? topSeriesData : mockData.topSeries}
          onItemPress={handleMediaItemPress}
        />
         
        <HorizontalList
          title="Top Film"
          data={topFilmData.length > 0 ? topFilmData : mockData.topFilm}
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