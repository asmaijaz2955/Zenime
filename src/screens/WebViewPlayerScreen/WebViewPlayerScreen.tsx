// WebView Player Fallback Component
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Orientation from 'react-native-orientation-locker';

export default function WebViewPlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { url } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Orientation.lockToLandscape();
    
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const handleBackPress = () => {
    Orientation.unlockAllOrientations();
    navigation.goBack();
  };

  // Create a custom HTML page that handles the proxy URL
  const createVideoHTML = (streamUrl: string) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #000;
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }
            .video-container {
                width: 100%;
                height: 100vh;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            video {
                width: 100%;
                height: 100%;
                object-fit: contain;
                background-color: #000;
            }
            .loading {
                position: absolute;
                color: white;
                font-size: 16px;
                z-index: 10;
            }
            .error {
                position: absolute;
                color: #ff6b6b;
                font-size: 14px;
                text-align: center;
                padding: 20px;
                z-index: 10;
            }
            .controls {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.7);
                padding: 10px;
                border-radius: 5px;
                color: white;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="video-container">
            <div id="loading" class="loading">Loading video...</div>
            <div id="error" class="error" style="display: none;">
                Unable to load video stream. The URL may be protected or expired.
            </div>
            <video id="videoPlayer" controls style="display: none;">
                <source src="${streamUrl}" type="application/x-mpegURL">
                <source src="${streamUrl}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div id="controls" class="controls" style="display: none;">
                <span id="status">Ready to play</span>
            </div>
        </div>

        <script>
            const video = document.getElementById('videoPlayer');
            const loading = document.getElementById('loading');
            const error = document.getElementById('error');
            const controls = document.getElementById('controls');
            const status = document.getElementById('status');

            // Try to load the video
            function loadVideo() {
                console.log('Attempting to load video:', '${streamUrl}');
                
                video.addEventListener('loadstart', () => {
                    console.log('Video load started');
                    status.textContent = 'Loading...';
                });

                video.addEventListener('canplay', () => {
                    console.log('Video can play');
                    loading.style.display = 'none';
                    video.style.display = 'block';
                    controls.style.display = 'block';
                    status.textContent = 'Ready to play';
                });

                video.addEventListener('error', (e) => {
                    console.error('Video error:', e);
                    loading.style.display = 'none';
                    error.style.display = 'block';
                    
                    // Try alternative approach with iframe
                    tryIframeApproach();
                });

                video.addEventListener('playing', () => {
                    status.textContent = 'Playing';
                });

                video.addEventListener('pause', () => {
                    status.textContent = 'Paused';
                });

                // Set source and load
                video.src = '${streamUrl}';
                video.load();
            }

            function tryIframeApproach() {
                console.log('Trying iframe approach...');
                const container = document.querySelector('.video-container');
                
                // Create iframe for the proxy URL
                const iframe = document.createElement('iframe');
                iframe.src = '${streamUrl}';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.style.background = '#000';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                
                container.innerHTML = '';
                container.appendChild(iframe);
            }

            // Extract direct URL if it's a proxy
            function extractDirectUrl(proxyUrl) {
                try {
                    const url = new URL(proxyUrl);
                    const directUrl = url.searchParams.get('url');
                    if (directUrl) {
                        console.log('Extracted direct URL:', directUrl);
                        return directUrl;
                    }
                } catch (e) {
                    console.error('URL extraction failed:', e);
                }
                return proxyUrl;
            }

            // Initialize
            const directUrl = extractDirectUrl('${streamUrl}');
            if (directUrl !== '${streamUrl}') {
                // If we extracted a direct URL, use it
                video.src = directUrl;
                loadVideo();
            } else {
                // Try the original URL first, then fallback to iframe
                loadVideo();
            }

            // Prevent context menu and selection
            document.addEventListener('contextmenu', e => e.preventDefault());
            document.addEventListener('selectstart', e => e.preventDefault());
        </script>
    </body>
    </html>
    `;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      {/* WebView */}
      <WebView
        source={{ html: createVideoHTML(url) }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={true}
        mixedContentMode="compatibility"
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => setError(true)}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView HTTP error:', nativeEvent);
          setError(true);
        }}
        userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        // Allow navigation to handle redirects
        onShouldStartLoadWithRequest={(request) => {
          console.log('WebView navigation request:', request.url);
          return true;
        }}
      />
      
      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading video player...</Text>
        </View>
      )}
      
      {/* Error Overlay */}
      {error && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>Failed to load video player</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              setError(false);
              setLoading(true);
            }}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backButton: {
    position: 'absolute',
    top: hp('2%'),
    left: wp('4%'),
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: 8,
    zIndex: 1000,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    marginTop: hp('2%'),
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: wp('4%'),
    marginBottom: hp('3%'),
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
});