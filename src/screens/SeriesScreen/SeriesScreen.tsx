import { DrawerActions, useNavigation } from '@react-navigation/native';
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

export default function SeriesScreen() {
    const navigation = useNavigation();
  const topFilms = [
    { id: 1, title: 'LAST KINGDOM', color: '#8B4513', genre: 'Historical Drama' },
    { id: 2, title: 'VIKINGS', color: '#4A5568', genre: 'Historical Drama' },
    { id: 3, title: 'WARRIOR', color: '#744210', genre: 'Action Drama' },
  ];

  const todaysPicks = [
    { id: 1, title: 'KAKEGAT', color: '#8B4513', rating: '8.5' },
    { id: 2, title: 'BEKER', color: '#4A5568', rating: '7.8' },
    { id: 3, title: 'LUGGED', color: '#744210', rating: '8.2' },
    { id: 4, title: 'KAKEGAT', color: '#8B4513', rating: '8.5' },
    { id: 5, title: 'BEKER', color: '#4A5568', rating: '7.8' },
    { id: 6, title: 'LUGGED', color: '#744210', rating: '8.2' },
    { id: 7, title: 'KAKEGAT', color: '#8B4513', rating: '8.5' },
    { id: 8, title: 'BEKER', color: '#4A5568', rating: '7.8' },
    { id: 9, title: 'LUGGED', color: '#744210', rating: '8.2' },
  ];

  const renderTopFilmItem = ({ item, index }) => (
    <TouchableOpacity style={styles.topFilmCard}>
      <View style={[styles.topFilmImage, { backgroundColor: item.color }]}>
        <View style={styles.topFilmOverlay}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>{index + 1}</Text>
          </View>
        </View>
      </View>
      <View style={styles.topFilmInfo}>
        <Text style={styles.topFilmTitle}>{item.title}</Text>
        <Text style={styles.topFilmGenre}>{item.genre}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTodaysPickItem = ({ item }) => (
    <TouchableOpacity style={styles.todaysPickCard}>
      <View style={[styles.todaysPickImage, { backgroundColor: item.color }]}>
        <View style={styles.todaysPickOverlay}>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={wp('3%')} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.todaysPickTitle}>{item.title}</Text>
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top 10 Film Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top 10 Film</Text>
          <FlatList
            data={topFilms}
            renderItem={renderTopFilmItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topFilmList}
          />
        </View>

        {/* Today's Pick Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's pick</Text>
          <FlatList
            data={todaysPicks}
            renderItem={renderTodaysPickItem}
            numColumns={3}
            keyExtractor={(item) => `${item.id}-${Math.random()}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.todaysPickList}
            columnWrapperStyle={styles.todaysPickRow}
            scrollEnabled={false}
          />
        </View>
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
  content: {
    flex: 1,
  },
  section: {
    marginBottom: hp('3%'),
  },
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp('2%'),
    marginHorizontal: wp('4%'),
  },
  
  // Top Film Styles
  topFilmList: {
    paddingHorizontal: wp('4%'),
  },
  topFilmCard: {
    marginRight: wp('4%'),
    width: wp('40%'),
  },
  topFilmImage: {
    width: wp('40%'),
    height: hp('25%'),
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: hp('1%'),
  },
  topFilmOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: wp('2%'),
  },
  rankBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 4,
  },
  rankText: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  topFilmInfo: {
    paddingHorizontal: wp('1%'),
  },
  topFilmTitle: {
    fontSize: wp('3.8%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp('0.5%'),
  },
  topFilmGenre: {
    fontSize: wp('3%'),
    color: '#9CA3AF',
  },
  
  // Today's Pick Styles
  todaysPickList: {
    paddingHorizontal: wp('4%'),
  },
  todaysPickRow: {
    justifyContent: 'space-between',
  },
  todaysPickCard: {
    width: wp('28%'),
    marginBottom: hp('2%'),
  },
  todaysPickImage: {
    width: wp('28%'),
    height: hp('18%'),
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: hp('1%'),
  },
  todaysPickOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: wp('2%'),
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: wp('1.5%'),
    paddingVertical: hp('0.3%'),
    borderRadius: 4,
  },
  ratingText: {
    fontSize: wp('2.8%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: wp('1%'),
  },
  todaysPickTitle: {
    fontSize: wp('3.2%'),
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});