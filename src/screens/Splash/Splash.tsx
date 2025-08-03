// src/screens/Splash/Splash.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Dimensions,
} from 'react-native';

import { Images } from '../../assets/images';

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
};

type SplashScreenProps = {
  navigation: {
    replace: (screen: string) => void;
  };
};

const { width, height } = Dimensions.get('window');

const Splash: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    // Navigate to main app after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('HomeScreen');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1a1a2e" barStyle="light-content" />
      
      {/* Full Background Image */}
      <ImageBackground
        source={Images.Splash}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Optional overlay for better text visibility */}
       
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 46, 0.5)', // Semi-transparent overlay
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1, // Ensures content appears above overlay
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#e94560',
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  versionText: {
    color: '#ffffff',
    opacity: 0.7,
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default Splash;