import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { GetStream } from '../../service/AxiosConfig';

const { width, height } = Dimensions.get('window');

// Types for navigation params
type VideoPlayerRouteParams = {
  animeData: {
    id: string;
    title: string;
    episodeNumber: number;
    season?: string;
    thumbnail?: string;
  };
  episodeId: string;
  server?: string;
  type?: 'sub' | 'dub';
};

type VideoPlayerRouteProp = RouteProp<{ VideoPlayer: VideoPlayerRouteParams }, 'VideoPlayer'>;

// Updated API Interface based on your streaming response
interface StreamApiResponse {
  success: boolean;
  results: {
    servers: Array<{
      data_id: string;
      serverName: string;
      server_id: string;
      type: 'sub' | 'dub';
    }>;
    streamingLink: {
      id: string;
      intro: {
        start: number;
        end: number;
      };
      link: {
        file: string;
        type: string;
      };
      outro: {
        start: number;
        end: number;
      };
      server: string;
      tracks: Array<{
        file: string;
        label: string;
        kind: string;
        default?: boolean;
      }>;
      type: 'sub' | 'dub';
    };
  };
  error?: string;
}

export default function AnimeVideoPlayerScreen() {
  const navigation = useNavigation();
  // const route = useRoute<VideoPlayerRouteProp>();
  
  // Get params from navigation
  // const { animeData, episodeId, server = 'hd-1', type = 'sub' } = route.params;
  
  // State
  const [streamData, setStreamData] = useState<StreamApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [selectedSpeed, setSelectedSpeed] = useState('1x');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [selectedServer, setSelectedServer] = useState('HD-1');
  const [selectedType, setSelectedType] = useState<'sub' | 'dub'>('sub');
  
  // Refs
  const videoRef = useRef<Video>(null);
  const controlsTimeout = useRef<NodeJS.Timeout>();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Available playback speeds
  const playbackSpeeds = ['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x'];

  useEffect(() => {
    fetchStreamData();
    
    // Lock orientation to landscape for video
    Orientation.lockToLandscape();
    
    // Auto-hide controls after 3 seconds
    resetControlsTimeout();
    
    return () => {
      Orientation.unlockAllOrientations();
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, []);

  const fetchStreamData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching stream data...');

      const response = await GetStream();
      console.log('Stream response:', response);
      
      if (response.error) {
        setError(response.error);
        console.error('Stream API Error:', response.error);
      } else if (response.success && response.results) {
        setStreamData(response);
        console.log('Stream data fetched successfully');
        console.log('Available servers:', response.results.servers);
        console.log('Streaming link:', response.results.streamingLink.link.file);
      } else {
        setError('Invalid stream response format');
      }
      
    } catch (err) {
      console.error('Fetch stream error:', err);
      setError('Failed to load video stream');
    } finally {
      setLoading(false);
    }
  };

  const resetControlsTimeout = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    
    controlsTimeout.current = setTimeout(() => {
      hideControls();
    }, 3000);
  };

  const showControlsHandler = () => {
    setShowControls(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    resetControlsTimeout();
  };

  const hideControls = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowControls(false);
    });
  };

  const togglePlayPause = () => {
    setPaused(!paused);
    showControlsHandler();
  };

  const onVideoPress = () => {
    if (showControls) {
      hideControls();
    } else {
      showControlsHandler();
    }
  };

  const onLoad = (data: any) => {
    setDuration(data.duration);
    console.log('Video loaded, duration:', data.duration);
  };

  const onProgress = (data: any) => {
    setCurrentTime(data.currentTime);
    
    // Handle intro/outro skipping
    if (streamData?.results?.streamingLink) {
      const { intro, outro } = streamData.results.streamingLink;
      
      // Auto-skip intro if enabled
      if (data.currentTime >= intro.start && data.currentTime <= intro.end) {
        console.log('In intro section');
      }
      
      // Auto-skip outro if enabled
      if (data.currentTime >= outro.start && data.currentTime <= outro.end) {
        console.log('In outro section');
      }
    }
  };

  const onSeek = (time: number) => {
    videoRef.current?.seek(time);
    setCurrentTime(time);
  };

  const skipIntro = () => {
    if (streamData?.results?.streamingLink?.intro) {
      const introEnd = streamData.results.streamingLink.intro.end;
      onSeek(introEnd);
      showControlsHandler();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleBackPress = () => {
    Orientation.unlockAllOrientations();
    navigation.goBack();
  };

  const skipTime = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    onSeek(newTime);
    showControlsHandler();
  };

  const handleQualitySelect = (quality: string) => {
    setSelectedQuality(quality);
    setShowQualityMenu(false);
    showControlsHandler();
  };

  const handleSpeedSelect = (speed: string) => {
    setSelectedSpeed(speed);
    setShowSpeedMenu(false);
    showControlsHandler();
  };

  const handleServerChange = (serverName: string, type: 'sub' | 'dub') => {
    setSelectedServer(serverName);
    setSelectedType(type);
    setShowQualityMenu(false);
    
    // Find the selected server data
    const selectedServerData = streamData?.results?.servers?.find(
      server => server.serverName === serverName && server.type === type
    );
    
    if (selectedServerData) {
      console.log('Switching to server:', selectedServerData);
      // Here you would typically call your API again with the new server data_id
      // For now, we'll show a message
      Alert.alert(
        'Server Switch',
        `Switching to ${serverName} (${type.toUpperCase()}). This would typically refetch the stream with server ID: ${selectedServerData.server_id}`,
        [
          { text: 'OK', onPress: () => showControlsHandler() }
        ]
      );
    }
    
    showControlsHandler();
  };

  const getVideoSource = () => {
    if (!streamData?.results?.streamingLink?.link?.file) {
      console.log('No video source available');
      return null;
    }
    
    const videoUrl = streamData.results.streamingLink.link.file;
    console.log('Using video source:', videoUrl);
    
    return { 
      uri: videoUrl,
      type: streamData.results.streamingLink.link.type === 'hls' ? 'm3u8' : 'mp4',
      headers: {
        'Referer': 'https://aniwatch.to/',
        'Origin': 'https://aniwatch.to',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site'
      }
    };
  };

  const getSubtitleTracks = () => {
    if (!streamData?.results?.streamingLink?.tracks) return [];
    
    return streamData.results.streamingLink.tracks.map((track, index) => ({
      index,
      title: track.label,
      language: track.label.toLowerCase(),
      type: 'text/vtt', // or track.kind
      uri: track.file,
    }));
  };

  const isInIntro = () => {
    if (!streamData?.results?.streamingLink?.intro) return false;
    const { intro } = streamData.results.streamingLink;
    return currentTime >= intro.start && currentTime <= intro.end;
  };

  const renderControls = () => {
    if (!showControls) return null;

    return (
      <Animated.View style={[styles.controlsOverlay, { opacity: fadeAnim }]}>
        {/* Skip Intro Button */}
        {isInIntro() && (
          <TouchableOpacity style={styles.skipIntroButton} onPress={skipIntro}>
            <Text style={styles.skipIntroText}>Skip Intro</Text>
          </TouchableOpacity>
        )}

        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.animeTitle} numberOfLines={1}>
              Sample Anime Title
            </Text>
            <Text style={styles.episodeInfo}>
              Season 1 Episode 1 • {selectedServer} ({selectedType.toUpperCase()})
            </Text>
          </View>
        </View>

        {/* Center Controls */}
        <View style={styles.centerControls}>
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={() => skipTime(-10)}
          >
            <Text style={styles.skipText}>⟲</Text>
            <Text style={styles.skipLabel}>10</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.playPauseButton} 
            onPress={togglePlayPause}
          >
            <Text style={styles.playPauseIcon}>
              {paused ? '▶' : '⏸'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={() => skipTime(10)}
          >
            <Text style={styles.skipText}>⟳</Text>
            <Text style={styles.skipLabel}>10</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            
            <View style={styles.progressBar}>
              <View style={styles.progressTrack} />
              <View 
                style={[
                  styles.progressFill,
                  { width: `${(currentTime / duration) * 100 || 0}%` }
                ]} 
              />
              <TouchableOpacity
                style={[
                  styles.progressThumb,
                  { left: `${(currentTime / duration) * 100 || 0}%` }
                ]}
              />
            </View>
            
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          {/* Bottom Row Controls */}
          <View style={styles.bottomRow}>
            <View style={styles.leftBottomControls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => setShowSpeedMenu(!showSpeedMenu)}
              >
                <Text style={styles.controlIcon}>⚡</Text>
                <Text style={styles.controlLabel}>Speed ({selectedSpeed})</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rightBottomControls}>
              <TouchableOpacity style={styles.controlButton}>
                <Text style={styles.controlIcon}>💬</Text>
                <Text style={styles.controlLabel}>Episodes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton}>
                <Text style={styles.controlIcon}>🔒</Text>
                <Text style={styles.controlLabel}>Lock</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => setShowQualityMenu(!showQualityMenu)}
              >
                <Text style={styles.controlIcon}>⚙️</Text>
                <Text style={styles.controlLabel}>Servers & Subtitles</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton}>
                <Text style={styles.controlIcon}>⏭</Text>
                <Text style={styles.controlLabel}>Next Ep</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Server/Quality Menu */}
        {showQualityMenu && (
          <View style={styles.qualityMenu}>
            <Text style={styles.menuTitle}>Servers & Quality</Text>
            
            {/* Servers Section */}
            <Text style={styles.sectionTitle}>Servers:</Text>
            {streamData?.results?.servers?.map((server) => (
              <TouchableOpacity
                key={`${server.serverName}-${server.type}`}
                style={[
                  styles.menuItem,
                  selectedServer === server.serverName && selectedType === server.type && styles.selectedMenuItem
                ]}
                onPress={() => handleServerChange(server.serverName, server.type)}
              >
                <Text style={styles.menuItemText}>
                  {server.serverName} ({server.type.toUpperCase()})
                </Text>
                {selectedServer === server.serverName && selectedType === server.type && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
            
            {/* Quality Section */}
            <Text style={styles.sectionTitle}>Quality:</Text>
            {['Auto', '1080p', '720p', '480p'].map((quality) => (
              <TouchableOpacity
                key={quality}
                style={[
                  styles.menuItem,
                  selectedQuality === quality && styles.selectedMenuItem
                ]}
                onPress={() => handleQualitySelect(quality)}
              >
                <Text style={styles.menuItemText}>{quality}</Text>
                {selectedQuality === quality && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Speed Menu */}
        {showSpeedMenu && (
          <View style={styles.speedMenu}>
            <Text style={styles.menuTitle}>Playback Speed</Text>
            {playbackSpeeds.map((speed) => (
              <TouchableOpacity
                key={speed}
                style={[
                  styles.menuItem,
                  selectedSpeed === speed && styles.selectedMenuItem
                ]}
                onPress={() => handleSpeedSelect(speed)}
              >
                <Text style={styles.menuItemText}>{speed}</Text>
                {selectedSpeed === speed && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Animated.View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading video stream...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchStreamData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButtonError} onPress={handleBackPress}>
            <Text style={styles.backButtonErrorText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      
      {/* Video Player */}
      <TouchableOpacity 
        style={styles.videoContainer} 
        onPress={onVideoPress}
        activeOpacity={1}
      >
        {getVideoSource() && (
          <Video
            ref={videoRef}
            source={getVideoSource()}
            style={styles.video}
            paused={paused}
            onLoad={onLoad}
            onProgress={onProgress}
            resizeMode="contain"
            rate={parseFloat(selectedSpeed.replace('x', ''))}
            textTracks={getSubtitleTracks()}
            selectedTextTrack={{
              type: 'title',
              value: streamData?.results?.streamingLink?.tracks?.[0]?.label || 'English'
            }}
            onError={(error) => {
              console.error('Video playback error:', error);
              
              // Handle specific 403 error
              if (error?.error?.errorString?.includes('ERROR_CODE_IO_BAD_HTTP_STATUS')) {
                setError('Stream access denied. This may be due to geo-restrictions or server protection. Try a different server.');
              } else {
                setError(`Video playback failed: ${error?.error?.errorString || 'Unknown error'}`);
              }
            }}
            onLoadStart={() => {
              console.log('Video loading started...');
            }}
            onReadyForDisplay={() => {
              console.log('Video ready for display');
            }}
            onSeek={(data) => {
              console.log('Video seek completed:', data);
            }}
            // Additional props for better HLS handling
            ignoreSilentSwitch="ignore"
            mixWithOthers="duck"
            reportBandwidth={true}
            // Try to handle CORS issues
            allowsExternalPlayback={false}
            bufferConfig={{
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000
            }}
          />
        )}
        
        {renderControls()}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    marginBottom: hp('2%'),
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  backButtonError: {
    backgroundColor: '#374151',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 6,
  },
  backButtonErrorText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
    backgroundColor: '#000000',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  skipIntroButton: {
    position: 'absolute',
    bottom: hp('15%'),
    right: wp('5%'),
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: 6,
  },
  skipIntroText: {
    color: '#FFFFFF',
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
  },
  backButton: {
    padding: wp('2%'),
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: wp('6%'),
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    marginLeft: wp('3%'),
  },
  animeTitle: {
    color: '#FFFFFF',
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
  episodeInfo: {
    color: '#CCCCCC',
    fontSize: wp('3.5%'),
    marginTop: hp('0.5%'),
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    alignItems: 'center',
    marginHorizontal: wp('8%'),
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: wp('8%'),
  },
  skipLabel: {
    color: '#FFFFFF',
    fontSize: wp('3%'),
    marginTop: hp('0.5%'),
    position: 'absolute',
    bottom: wp('1%'),
  },
  playPauseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: wp('12%'),
    padding: wp('4%'),
  },
  playPauseIcon: {
    color: '#FFFFFF',
    fontSize: wp('8%'),
    textAlign: 'center',
  },
  bottomControls: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('2%'),
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: wp('3%'),
    minWidth: wp('12%'),
    textAlign: 'center',
  },
  progressBar: {
    flex: 1,
    height: hp('0.5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: wp('3%'),
    borderRadius: hp('0.25%'),
    position: 'relative',
  },
  progressTrack: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: hp('0.25%'),
  },
  progressFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#DC2626',
    borderRadius: hp('0.25%'),
  },
  progressThumb: {
    position: 'absolute',
    width: wp('3%'),
    height: wp('3%'),
    backgroundColor: '#DC2626',
    borderRadius: wp('1.5%'),
    top: -wp('1.25%'),
    marginLeft: -wp('1.5%'),
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftBottomControls: {
    flexDirection: 'row',
  },
  rightBottomControls: {
    flexDirection: 'row',
  },
  controlButton: {
    alignItems: 'center',
    marginHorizontal: wp('2%'),
  },
  controlIcon: {
    fontSize: wp('4%'),
    marginBottom: hp('0.5%'),
  },
  controlLabel: {
    color: '#FFFFFF',
    fontSize: wp('2.5%'),
    textAlign: 'center',
  },
  qualityMenu: {
    position: 'absolute',
    right: wp('4%'),
    bottom: hp('12%'),
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 8,
    padding: wp('4%'),
    minWidth: wp('40%'),
    maxHeight: hp('50%'),
  },
  speedMenu: {
    position: 'absolute',
    left: wp('4%'),
    bottom: hp('12%'),
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 8,
    padding: wp('4%'),
    minWidth: wp('30%'),
  },
  menuTitle: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '600',
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    color: '#CCCCCC',
    fontSize: wp('3.5%'),
    fontWeight: '500',
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1%'),
  },
  selectedMenuItem: {
    backgroundColor: 'rgba(220, 38, 38, 0.3)',
    borderRadius: 4,
    paddingHorizontal: wp('2%'),
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: wp('3.5%'),
  },
  checkIcon: {
    color: '#DC2626',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
});