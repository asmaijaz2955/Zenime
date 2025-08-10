import React, { useState } from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function AnimeHomeScreen() {
  const [activeTab, setActiveTab] = useState(0);
  
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

  const renderEpisodeCard = (episode) => (
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
        <Text style={styles.detailValue}>Action, Drama, Sci-Fi</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>This episode:</Text>
        <Text style={styles.detailValue}>Violence</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Cast:</Text>
        <Text style={styles.detailValue}>Megumi Hayashibara, Koichi Yamadera</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Creator:</Text>
        <Text style={styles.detailValue}>Shinichiro Watanabe</Text>
      </View>
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
                <Text style={styles.seasonText}>Season 2 ( 1 EP )</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Background */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={{ uri: 'https://via.placeholder.com/400x600/4A5568/FFFFFF?text=Lazarus' }}
            style={styles.heroBackground}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)', '#000000']}
              style={styles.heroGradient}
            >
              <View style={styles.heroContent}>
                {/* Title and Metadata */}
                <Text style={styles.mainTitle}>Lazarus</Text>
                
                <View style={styles.metadataRow}>
                  <Text style={styles.matchPercentage}>99% match</Text>
                  <Text style={styles.year}>2023</Text>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>U/A 18+ [A]</Text>
                  </View>
                  <Text style={styles.seasons}>1 Seasons</Text>
                  <View style={styles.hdBadge}>
                    <Text style={styles.hdText}>HD</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.playButton}>
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
                  The year is 2052—an era of unprecedented peace and prosperity prevails across the globe. The reason for this: mankind has been freed from sickness and pain.
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
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
  heroSection: {
    height: height * 0.7,
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
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  matchPercentage: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginRight: 15,
  },
  year: {
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 15,
  },
  ratingBadge: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 15,
  },
  ratingText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  seasons: {
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 15,
  },
  hdBadge: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  hdText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  playIcon: {
    marginRight: 10,
  },
  playIconText: {
    fontSize: 18,
    color: '#000000',
  },
  playButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  downloadButton: {
    backgroundColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
  },
  downloadIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    marginRight: 10,
  },
  downloadButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    paddingHorizontal: 20,
  },
  tab: {
    marginRight: 30,
    paddingVertical: 15,
    position: 'relative',
  },
  activeTab: {
    // Active tab styles handled by indicator
  },
  tabText: {
    fontSize: 16,
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
    height: 3,
    backgroundColor: '#DC2626',
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  seasonSelector: {
    marginBottom: 20,
  },
  seasonDropdown: {
    backgroundColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 6,
    maxWidth: 200,
  },
  seasonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  episodeCard: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  episodeThumbnail: {
    width: 120,
    height: 68,
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 15,
  },
  episodeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  episodeTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  episodeMeta: {
    flexDirection: 'row',
  },
  episodeMetaText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginRight: 15,
  },
  detailsContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  gridItem: {
    width: (width - 60) / 3,
    height: 120,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItemContent: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
  },
});