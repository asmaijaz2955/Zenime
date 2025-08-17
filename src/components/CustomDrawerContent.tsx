import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  StatusBar 
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CustomDrawerContent = (props) => {
  const [activeIndex, setActiveIndex] = useState(1); // Home is initially active (index 1)

  const menuItems = [
    {
      icon: 'search',
      title: 'Search',
      iconType: 'Ionicons',
      onPress: () => {
        props.navigation.navigate('Search'); // ✅ Correct - this matches your Drawer.Screen name
        console.log('Search pressed');
        setActiveIndex(0);
      }
    },
    {
      icon: 'home',
      title: 'Home',
      iconType: 'Ionicons',
      onPress: () => {
        props.navigation.navigate('HomeScreen');
        setActiveIndex(1);
      }
    },
    {
      icon: 'tv',
      title: 'Series',
      iconType: 'Ionicons',
      onPress: () => {
        props.navigation.navigate('Series');
        setActiveIndex(2);
      }
    },
    {
      icon: 'film',
      title: 'Film',
      iconType: 'Ionicons',
      onPress: () => {
        props.navigation.navigate('AnimeHomeScreen'); // ✅ Correct - this matches your Drawer.Screen name

        console.log('Film pressed');
        setActiveIndex(3);
      }
    },
    {
      icon: 'apps',
      title: 'Genres',
      iconType: 'Ionicons',
      onPress: () => {
        props.navigation.navigate('Genres'); // ✅ Correct - this matches your Drawer.Screen name
        console.log('Genres pressed');
        setActiveIndex(4);
      }
    }
  ];

  const renderIcon = (iconName, iconType, isActive = false) => {
    const iconColor = isActive ? '#FFFFFF' : '#CCCCCC';
    const iconSize = 24;

    switch (iconType) {
      case 'MaterialIcons':
        return <MaterialIcons name={iconName} size={iconSize} color={iconColor} />;
      case 'FontAwesome':
        return <FontAwesome name={iconName} size={iconSize} color={iconColor} />;
      default:
        return <Ionicons name={iconName} size={iconSize} color={iconColor} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>
          Zen<Text style={styles.appNameAccent}>ime</Text>
        </Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => {
          const isActive = activeIndex === index;
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                isActive && styles.activeMenuItem
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                {renderIcon(item.icon, item.iconType, isActive)}
                <Text style={[
                  styles.menuText,
                  isActive && styles.activeMenuText
                ]}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Settings at Bottom */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => props.navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            {renderIcon('settings', 'Ionicons')}
            <Text style={styles.menuText}>Setting</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(3),
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  appName: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appNameAccent: {
    color: '#DB202C', // Red accent color for "ime" part
  },
  menuContainer: {
    flex: 1,
    paddingTop: hp(2),
  },
  menuItem: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(2),
    marginVertical: 2,
  },
  activeMenuItem: {
    backgroundColor: '#DB202C', // Red background for active item
    marginRight: wp(20), // Creates the cut-off effect on the right
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: wp(4.2),
    color: '#CCCCCC',
    marginLeft: wp(5),
    fontWeight: '500',
  },
  activeMenuText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bottomSection: {
    paddingBottom: hp(3),
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
});

export default CustomDrawerContent; 