import { DrawerActions } from '@react-navigation/native';
import React, { useState } from 'react';
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function GenresScreen({ navigation }) {
  const [selectedGenre, setSelectedGenre] = useState('Action');

  const genres = [
    { id: 1, name: 'Action', icon: 'flash', iconType: 'Ionicons' },
    { id: 2, name: 'Adventure', icon: 'compass', iconType: 'MaterialIcons' },
    { id: 3, name: 'Thriller', icon: 'trending-up', iconType: 'Ionicons' },
    { id: 4, name: 'horror', icon: 'skull', iconType: 'Ionicons' },
    { id: 5, name: 'Comedy', icon: 'happy', iconType: 'Ionicons' },
    { id: 6, name: 'Sci-fi', icon: 'planet', iconType: 'Ionicons' },
    { id: 7, name: 'Mystery', icon: 'eye', iconType: 'Ionicons' },
    { id: 8, name: 'Other', icon: 'ellipsis-horizontal', iconType: 'Ionicons' },
  ];

  const handleGenrePress = (genreName) => {
    // Navigate to ActionScreen (or specific genre screen)
    navigation.navigate('ActionScreen', { genreName });
  };
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
  ];

  const renderIcon = (iconName, iconType) => {
    const iconSize = wp('8%');
    const iconColor = '#FFFFFF';

    switch (iconType) {
      case 'MaterialIcons':
        return <MaterialIcons name={iconName} size={iconSize} color={iconColor} />;
      default:
        return <Ionicons name={iconName} size={iconSize} color={iconColor} />;
    }
  };

  const renderGenreCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.genreCard}
      onPress={() => handleGenrePress(item.name)}
    >
      <View style={styles.genreIconContainer}>
        {renderIcon(item.icon, item.iconType)}
      </View>
      <Text style={styles.genreTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderMovieCard = ({ item }) => (
    <TouchableOpacity style={styles.movieCard}>
      <View style={[styles.movieImage, { backgroundColor: item.color }]}>
        <View style={styles.movieOverlay}>
          <Text style={styles.movieTitle}>{item.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Genres Section */}
      <View style={styles.genresSection}>
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

        <Text style={styles.sectionTitle}>Genres</Text>

        {/* Genre Grid */}
        <FlatList
          data={genres}
          renderItem={renderGenreCard}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.genreGrid}
          columnWrapperStyle={styles.genreRow}
          scrollEnabled={false}
        />
      </View>

   
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    flexDirection: 'row',
  },

  // Genres Section (Left Side)
  genresSection: {
    width: wp('100%'),
    backgroundColor: '#000000',
    borderRightWidth: 1,
    borderRightColor: '#1F2937',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  menuButton: {
    marginRight: wp('3%'),
  },
  menuIcon: {
    width: wp('5%'),
    height: hp('2%'),
    justifyContent: 'space-between',
  },
  menuLine: {
    width: wp('5%'),
    height: 2,
    backgroundColor: '#FFFFFF',
  },
  appName: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appNameAccent: {
    color: '#DB202C',
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },
  genreGrid: {
    paddingHorizontal: wp('4%'),
  },
  genreRow: {
    justifyContent: 'space-between',
  },
  genreCard: {
    width: wp('44%'),
    height: hp('15%'),
    backgroundColor: '#4C4C4D',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  genreIconContainer: {
    // fontSize: wp('8%'),
    marginBottom: hp('1%'),
  },
  genreTitle: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // Action Section (Right Side)
  actionSection: {
    width: wp('50%'),
    backgroundColor: '#000000',
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  actionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },
  movieGrid: {
    paddingHorizontal: wp('2%'),
  },
  movieRow: {
    justifyContent: 'space-between',
  },
  movieCard: {
    width: wp('14%'),
    marginBottom: hp('1.5%'),
  },
  movieImage: {
    width: wp('14%'),
    height: hp('18%'),
    borderRadius: 6,
    overflow: 'hidden',
  },
  movieOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: wp('1.5%'),
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  movieTitle: {
    fontSize: wp('2.5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});