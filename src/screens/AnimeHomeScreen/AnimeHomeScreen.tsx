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
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
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
  },
  mainTitle: {
    fontSize: wp('10%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp('2%'),
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