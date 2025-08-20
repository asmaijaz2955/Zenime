import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { GetEpisodes, GetInfo } from '../../service/AxiosConfig';

const { width, height } = Dimensions.get('window');

// Types for navigation params
type AnimeHomeRouteParams = {
  animeData: {
    id?: string;
    title: string;
    subtitle?: string;
    description: string;
    image?: string;
    characters?: string[];
    streamData?: any;
  };
  fromScreen: string;
  index: number;
};

type AnimeHomeRouteProp = RouteProp<{ AnimeHome: AnimeHomeRouteParams }, 'AnimeHome'>;

// API Interface for GetInfo response
interface InfoApiResponse {
  success: boolean;
  results: {
    anime: {
      info: {
        id: string;
        title: string;
        japanese_title: string;
        poster: string;
        description: string;
        stats: {
          rating: string;
          quality: string;
          episodes: {
            sub: number;
            dub: number;
          };
          type: string;
          duration: string;
        };
        promotionalVideos: any[];
        charactersVoiceActors: any[];
      };
      moreInfo: {
        aired: string;
        genres: string[];
        status: string;
        studios: string[];
        duration: string;
        season: string;
        synonyms: string[];
        premiered: string;
        broadcast: string;
        source: string;
        producers: string[];
        licensors: string[];
      };
    };
    seasons: any[];
    relatedAnimes: any[];
    recommendedAnimes: any[];
  };
}

// API function (you can move this to your service file)

export default function AnimeHomeScreen() {
  const navigation = useNavigation();
  const route = useRoute<AnimeHomeRouteProp>();
  
  // Get params from navigation
  const { animeData, fromScreen, index } = route.params;
  
  // State
  const [activeTab, setActiveTab] = useState(0);
  const [apiData, setApiData] = useState<InfoApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const tabs = ['Episodes', 'More Details', 'More like this'];
  
  const episodes = [
    {
      id: 1,
      title: "Episode name",
      season: "S1",
      episode: "E1",
      duration: "50m",
      thumbnail: null
    }
  ];

  const moreAnime = [
    { id: 1, color: '#8B5CF6' },
    { id: 2, color: '#3B82F6' },
    { id: 3, color: '#EF4444' },
    { id: 4, color: '#10B981' },
    { id: 5, color: '#F59E0B' },
    { id: 6, color: '#EC4899' }
  ];

  // Fetch anime info on component mount
  useEffect(() => {
    fetchAnimeInfo();
  }, [animeData.id]);

  const fetchAnimeInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching anime info for ID:', animeData.id);
      console.log('Received anime data:', animeData);
      
      if (!animeData.id) {
        setError('No anime ID provided');
        return;
      }

      const response = await GetInfo(animeData.id);
   
      if (response.error) {
        setError(response.error);
        console.error('API Error:', response.error);
      } else if (response.success && response.results) {
        setApiData(response);
        console.log('API data fetched successfully:', response.results);
      } else {
        setError('Invalid response format');
        console.error('Invalid response:', response);
      }
      const res = await GetEpisodes(animeData.id);
      console.log('Episodes response:', res);
           
    } catch (err) {
      console.error('Fetch anime info error:', err);
      setError('Failed to fetch anime information');
    } finally {
      setLoading(false);
    }
  };

  // Handle back button press
  const handleBackPress = () => {
    console.log(`Navigating back from ${fromScreen} (index: ${index})`);
    navigation.goBack();
  };

  // Get display data (API data takes priority over params)
  const getDisplayData = () => {
    if (apiData?.results?.anime) {
      const apiAnime = apiData.results.anime;
      return {
        title: apiAnime.info.title || animeData.title,
        subtitle: apiAnime.info.japanese_title || animeData.subtitle,
        description: apiAnime.info.description || animeData.description,
        image: apiAnime.info.poster || animeData.image,
        rating: apiAnime.info.stats?.rating,
        year: apiAnime.moreInfo?.aired,
        genres: apiAnime.moreInfo?.genres || [],
        status: apiAnime.moreInfo?.status,
        episodes: apiAnime.info.stats?.episodes,
        duration: apiAnime.info.stats?.duration,
        studios: apiAnime.moreInfo?.studios || [],
        source: apiAnime.moreInfo?.source,
        producers: apiAnime.moreInfo?.producers || [],
      };
    }
    
    // Fallback to params data
    return {
      title: animeData.title,
      subtitle: animeData.subtitle,
      description: animeData.description,
      image: animeData.image,
      rating: null,
      year: '2023',
      genres: ['Action', 'Drama'],
      status: 'Unknown',
      episodes: null,
      duration: null,
      studios: [],
      source: null,
      producers: [],
    };
  };

  const displayData = getDisplayData();

  const renderEpisodeCard = (episode: any) => (
    <View key={episode.id} style={styles.episodeCard}>
      <View style={styles.episodeThumbnail} />
      <View style={styles.episodeInfo}>
        <Text style={styles.episodeTitle}>{episode.title}</Text>
        <View style={styles.episodeMeta}>
          <Text style={styles.episodeMetaText}>{episode.season}</Text>
          <Text style={styles.episodeMetaText}>{episode.episode}</Text>
          <Text style={styles.episodeMetaText}>{episode.duration}</Text>
        </View>
      </View>
    </View>
  );

  const renderMoreDetails = () => (
    <View style={styles.detailsContent}>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Genres:</Text>
        <Text style={styles.detailValue}>{displayData.genres.join(', ') || 'N/A'}</Text>
      </View>
      {displayData.status && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={styles.detailValue}>{displayData.status}</Text>
        </View>
      )}
      {displayData.studios.length > 0 && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Studios:</Text>
          <Text style={styles.detailValue}>{displayData.studios.join(', ')}</Text>
        </View>
      )}
      {displayData.source && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Source:</Text>
          <Text style={styles.detailValue}>{displayData.source}</Text>
        </View>
      )}
      {displayData.producers.length > 0 && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Producers:</Text>
          <Text style={styles.detailValue}>{displayData.producers.join(', ')}</Text>
        </View>
      )}
      {displayData.duration && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>{displayData.duration}</Text>
        </View>
      )}
    </View>
  );

  const renderMoreLikeThis = () => (
    <View style={styles.gridContainer}>
      {moreAnime.map((item) => (
        <TouchableOpacity key={item.id} style={[styles.gridItem, { backgroundColor: item.color }]}>
          <View style={styles.gridItemContent} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <View style={styles.tabContent}>
            <View style={styles.seasonSelector}>
              <TouchableOpacity style={styles.seasonDropdown}>
                <Text style={styles.seasonText}>
                  Season 1 ({displayData.episodes ? `${displayData.episodes.sub || 0} EP` : '1 EP'})
                </Text>
                <Text style={styles.dropdownArrow}>⌄</Text>
              </TouchableOpacity>
            </View>
            {episodes.map(renderEpisodeCard)}
          </View>
        );
      case 1:
        return renderMoreDetails();
      case 2:
        return renderMoreLikeThis();
      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        
        {/* Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading anime information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        
        {/* Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchAnimeInfo}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section with Background */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={{ 
              uri: displayData.image || 'https://via.placeholder.com/400x600/4A5568/FFFFFF?text=Anime' 
            }}
            style={styles.heroBackground}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)', '#000000']}
              style={styles.heroGradient}
            >
              <View style={styles.heroContent}>
                {/* Title and Metadata */}
                <Text style={styles.mainTitle}>{displayData.title}</Text>
                {displayData.subtitle && (
                  <Text style={styles.subtitle}>{displayData.subtitle}</Text>
                )}
                
                <View style={styles.metadataRow}>
                  {displayData.rating && (
                    <Text style={styles.matchPercentage}>{displayData.rating}★</Text>
                  )}
                  <Text style={styles.year}>{displayData.year}</Text>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>U/A 18+ [A]</Text>
                  </View>
                  <Text style={styles.seasons}>1 Season</Text>
                  <View style={styles.hdBadge}>
                    <Text style={styles.hdText}>HD</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.playButton} onPress={()=>navigation.navigate('AnimeVideoPlayerScreen')}>
                    <View style={styles.playIcon}>
                      <Text style={styles.playIconText}>▶</Text>
                    </View>
                    <Text style={styles.playButtonText}>Play</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.downloadButton}>
                    <Text style={styles.downloadIcon}>⬇</Text>
                    <Text style={styles.downloadButtonText}>Download</Text>
                  </TouchableOpacity>
                </View>

                {/* Description */}
                <Text style={styles.description}>
                  {displayData.description}
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollContainer}
          >
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tab,
                  activeTab === index && styles.activeTab
                ]}
                onPress={() => setActiveTab(index)}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === index && styles.activeTabText
                ]}>
                  {tab}
                </Text>
                {activeTab === index && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
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
  header: {
    position: 'absolute',
    top: hp('2%'),
    left: wp('5%'),
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    marginTop: hp('2%'),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: wp('4%'),
    textAlign: 'center',
    marginBottom: hp('3%'),
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  heroSection: {
    height: hp('70%'),
  },
  heroBackground: {
    flex: 1,
    width: '100%',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroContent: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('4%'),
    paddingTop: hp('8%'), // Add padding to avoid back button overlap
  },
  mainTitle: {
    fontSize: wp('10%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp('1%'),
  },
  subtitle: {
    fontSize: wp('4%'),
    color: '#FFD700',
    marginBottom: hp('2%'),
    fontStyle: 'italic',
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
    flexWrap: 'wrap',
  },
  matchPercentage: {
    fontSize: wp('3.5%'),
    color: '#10B981',
    fontWeight: '600',
    marginRight: wp('4%'),
  },
  year: {
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
    marginRight: wp('4%'),
  },
  ratingBadge: {
    backgroundColor: '#374151',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: 4,
    marginRight: wp('4%'),
  },
  ratingText: {
    fontSize: wp('3%'),
    color: '#FFFFFF',
    fontWeight: '500',
  },
  seasons: {
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
    marginRight: wp('4%'),
  },
  hdBadge: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: wp('1.5%'),
    paddingVertical: hp('0.3%'),
    borderRadius: 2,
  },
  hdText: {
    fontSize: wp('2.5%'),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: hp('2.5%'),
  },
  playButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.5%'),
    borderRadius: 6,
    marginBottom: hp('1.2%'),
  },
  playIcon: {
    marginRight: wp('2.5%'),
  },
  playIconText: {
    fontSize: wp('4.5%'),
    color: '#000000',
  },
  playButtonText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#000000',
  },
  downloadButton: {
    backgroundColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.5%'),
    borderRadius: 6,
  },
  downloadIcon: {
    fontSize: wp('4.5%'),
    color: '#FFFFFF',
    marginRight: wp('2.5%'),
  },
  downloadButtonText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  description: {
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
    lineHeight: hp('2.5%'),
  },
  tabNavigation: {
    backgroundColor: '#000000',
  },
  tabScrollContainer: {
    paddingHorizontal: wp('5%'),
  },
  tab: {
    marginRight: wp('8%'),
    paddingVertical: hp('2%'),
    position: 'relative',
  },
  activeTab: {
    // Active tab styles handled by indicator
  },
  tabText: {
    fontSize: wp('4%'),
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: hp('0.4%'),
    backgroundColor: '#DC2626',
  },
  tabContent: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2.5%'),
  },
  seasonSelector: {
    marginBottom: hp('2.5%'),
  },
  seasonDropdown: {
    backgroundColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 6,
    maxWidth: wp('50%'),
  },
  seasonText: {
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: wp('4%'),
    color: '#FFFFFF',
    marginLeft: wp('2.5%'),
  },
  episodeCard: {
    flexDirection: 'row',
    marginBottom: hp('2%'),
    paddingBottom: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  episodeThumbnail: {
    width: wp('30%'),
    height: hp('8%'),
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: wp('4%'),
  },
  episodeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  episodeTitle: {
    fontSize: wp('4%'),
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: hp('0.6%'),
  },
  episodeMeta: {
    flexDirection: 'row',
  },
  episodeMetaText: {
    fontSize: wp('3.5%'),
    color: '#9CA3AF',
    marginRight: wp('4%'),
  },
  detailsContent: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2.5%'),
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: hp('2%'),
  },
  detailLabel: {
    fontSize: wp('3.5%'),
    color: '#9CA3AF',
    width: wp('25%'),
  },
  detailValue: {
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2.5%'),
  },
  gridItem: {
    width: wp('28%'),
    height: hp('15%'),
    borderRadius: 8,
    marginBottom: hp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItemContent: {
    width: wp('7.5%'),
    height: wp('7.5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: wp('3.75%'),
  },
});