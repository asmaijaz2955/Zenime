// src/screens/Home/HomeScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
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
import { DrawerActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { GetRandom, Getrandom, GetStream } from '../../service/AxiosConfig';

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

interface ApiError {
  error: string;
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [streamData, setStreamData] = useState<StreamApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStreamData = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      setError(null);
      
      console.log('Fetching stream data...');
      const response = await GetStream();
      const responseone = await GetRandom();
console.log('Response from Random:', responseone.results);
      
      if (response?.error) {
        setError(response.error);
        console.error('API Error:', response.error);
      } else if (response?.success && response?.results) {
        setStreamData(response as StreamApiResponse);
        console.log('Stream data fetched successfully:', response.results);
      } else {
        setError('Invalid response format');
        console.error('Invalid response:', response);
      }
    } catch (err) {
      console.error('Fetch stream data error:', err);
      setError('Failed to fetch stream data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchStreamData();
  }, []);

  // Refetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Optionally refetch data when screen is focused
      // fetchStreamData(false);
    }, [])
  );

  // Pull to refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStreamData(false);
  }, []);

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