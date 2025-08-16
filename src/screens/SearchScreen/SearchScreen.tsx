import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  FlatList,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const topSearches = [
    { id: 1, title: 'Lazarian', image: null },
    { id: 2, title: 'Lazarian', image: null },
    { id: 3, title: 'Lazarian', image: null },
    { id: 4, title: 'Lazarian', image: null },
    { id: 5, title: 'Lazarian', image: null },
    { id: 6, title: 'Lazarian', image: null },
  ];

  const searchResults = [
    { id: 1, title: 'KAKEGAT', color: '#8B4513' },
    { id: 2, title: 'BEKER', color: '#4A5568' },
    { id: 3, title: 'LUGGED', color: '#744210' },
    { id: 4, title: 'KAKEGAT', color: '#8B4513' },
    { id: 5, title: 'BEKER', color: '#4A5568' },
    { id: 6, title: 'LUGGED', color: '#744210' },
  ];

  const handleSearch = (text) => {
    setSearchQuery(text);
    setShowResults(text.length > 0);
  };

  const renderTopSearchItem = ({ item }) => (
    <TouchableOpacity style={styles.topSearchItem}>
      <View style={styles.topSearchThumbnail}>
        {/* Character images placeholder */}
        <View style={styles.characterRow}>
          {[1, 2, 3, 4, 5].map((index) => (
            <View
              key={index}
              style={[
                styles.characterImage,
                { backgroundColor: index % 2 === 0 ? '#3B82F6' : '#8B5CF6' }
              ]}
            />
          ))}
        </View>
      </View>
      <View style={styles.topSearchInfo}>
        <Text style={styles.topSearchTitle}>{item.title}</Text>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Ionicons name="play" size={wp('5%')} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderResultItem = ({ item, index }) => (
    <TouchableOpacity style={[styles.resultItem, { backgroundColor: item.color }]}>
      <View style={styles.resultOverlay}>
        <Text style={styles.resultTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={wp('5%')} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a show, movie, genre, e.t.c"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={styles.micButton}>
            <Ionicons name="mic" size={wp('5%')} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {!showResults ? (
        /* Top Searches Section */
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Top Searches</Text>
          <FlatList
            key="topSearches" // Add unique key for single column layout
            data={topSearches}
            renderItem={renderTopSearchItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.topSearchesList}
          />
        </View>
      ) : (
        /* Search Results Section */
        <View style={styles.content}>
          <Text style={styles.resultsTitle}>Results</Text>
          
          <FlatList
            key="searchResults" // Add unique key for two column layout
            data={searchResults}
            renderItem={renderResultItem}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsList}
            columnWrapperStyle={styles.resultRow}
          />
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
  header: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.2%'),
  },
  searchIcon: {
    marginRight: wp('3%'),
  },
  searchInput: {
    flex: 1,
    fontSize: wp('3.8%'),
    color: '#FFFFFF',
    paddingVertical: 0,
  },
  micButton: {
    marginLeft: wp('3%'),
  },
  content: {
    flex: 1,
    paddingHorizontal: wp('4%'),
  },
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp('2%'),
    marginTop: hp('1%'),
  },
  topSearchesList: {
    paddingBottom: hp('2%'),
  },
  topSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    marginBottom: hp('1%'),
    borderRadius: 8,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('3%'),
  },
  topSearchThumbnail: {
    width: wp('20%'),
    height: hp('6%'),
    backgroundColor: '#374151',
    borderRadius: 6,
    marginRight: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  characterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterImage: {
    width: wp('2.5%'),
    height: hp('3%'),
    marginHorizontal: 1,
    borderRadius: 2,
  },
  topSearchInfo: {
    flex: 1,
  },
  topSearchTitle: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: '#FFFFFF',
  },
  playButton: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  menuButton: {
    marginRight: wp('4%'),
  },
  menuIcon: {
    width: wp('6%'),
    height: hp('2.5%'),
    justifyContent: 'space-between',
  },
  menuLine: {
    width: wp('6%'),
    height: 2,
    backgroundColor: '#FFFFFF',
  },
  appName: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appNameAccent: {
    color: '#DB202C',
  },
  resultsTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp('2%'),
  },
  resultsList: {
    paddingBottom: hp('2%'),
  },
  resultRow: {
    justifyContent: 'space-between',
  },
  resultItem: {
    width: wp('44%'),
    height: hp('25%'),
    borderRadius: 8,
    marginBottom: hp('2%'),
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  resultOverlay: {
    padding: wp('3%'),
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  resultTitle: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});