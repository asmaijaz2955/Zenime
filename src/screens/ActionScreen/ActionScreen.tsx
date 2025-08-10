import { DrawerActions } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ActionScreen({ route, navigation }) {
  const { genreName = 'Action' } = route?.params || {};

  const actionMovies = [
    { id: 1, title: 'KAKEGAT', color: '#8B4513' },
    { id: 2, title: 'BEKER', color: '#4A5568' },
    { id: 3, title: 'LUGGED', color: '#744210' },
    { id: 4, title: 'KAKEGAT', color: '#8B4513' },
    { id: 5, title: 'BEKER', color: '#4A5568' },
    { id: 6, title: 'LUGGED', color: '#744210' },
    { id: 7, title: 'KAKEGAT', color: '#8B4513' },
    { id: 8, title: 'BEKER', color: '#4A5568' },
    { id: 9, title: 'LUGGED', color: '#744210' },
    { id: 10, title: 'KAKEGAT', color: '#8B4513' },
    { id: 11, title: 'BEKER', color: '#4A5568' },
    { id: 12, title: 'LUGGED', color: '#744210' },
    { id: 13, title: 'KAKEGAT', color: '#8B4513' },
    { id: 14, title: 'BEKER', color: '#4A5568' },
    { id: 15, title: 'LUGGED', color: '#744210' },
    { id: 16, title: 'KAKEGAT', color: '#8B4513' },
    { id: 17, title: 'BEKER', color: '#4A5568' },
    { id: 18, title: 'LUGGED', color: '#744210' },
  ];

  const renderMovieCard = ({ item }) => (
    <TouchableOpacity style={styles.movieCard}>
      <View style={[styles.movieImage, { backgroundColor: item.color }]}>
        <View style={styles.movieOverlay}>
          <Text style={styles.movieTitle}>{item.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
        <Text style={styles.appName}>
          Zen<Text style={styles.appNameAccent}>ime</Text>
        </Text>
      </View>

      {/* Genre Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.genreTitle}>{genreName}</Text>
      </View>

      {/* Movies Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FlatList
          data={actionMovies}
          renderItem={renderMovieCard}
          numColumns={3}
          keyExtractor={(item) => `${item.id}-${Math.random()}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.movieGrid}
          columnWrapperStyle={styles.movieRow}
          scrollEnabled={false}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
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
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appNameAccent: {
    color: '#DB202C',
  },
  titleContainer: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },
  genreTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  movieGrid: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('2%'),
  },
  movieRow: {
    justifyContent: 'space-between',
  },
  movieCard: {
    width: wp('28%'),
    marginBottom: hp('2%'),
  },
  movieImage: {
    width: wp('28%'),
    height: hp('20%'),
    borderRadius: 8,
    overflow: 'hidden',
  },
  movieOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: wp('3%'),
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  movieTitle: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});