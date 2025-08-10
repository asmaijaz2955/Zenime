// src/navigation/DrawerStack.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import { Text, View, StyleSheet } from 'react-native';

const Drawer = createDrawerNavigator();

const SellerHubScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Series Screen</Text>
  </View>
);

const MyNetworkScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>My Network Screen</Text>
  </View>
);

const ProfileMain = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Profile Screen</Text>
  </View>
);

const SearchScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Search Screen</Text>
  </View>
);

const FilmScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Film Screen</Text>
  </View>
);

const GenresScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Genres Screen</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Settings Screen</Text>
  </View>
);

export default function DrawerStack() {
  return (
    <Drawer.Navigator
      drawerContent={(props: any) => <CustomDrawerContent {...props} />}
      initialRouteName="HomeScreen"
      screenOptions={{
        drawerType: 'front',
        drawerPosition: 'left',
        drawerStyle: {
          width: '80%', // Slightly wider to match the image
          backgroundColor: '#000000',
        },
        overlayColor: 'rgba(0, 0, 0, 0.7)',
        headerShown: false,
      }}
    >
      <Drawer.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Drawer.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ headerShown: false }} 
      />
      <Drawer.Screen 
        name="SellerHub" 
        component={SellerHubScreen} 
        options={{ headerShown: false }} 
      />
      <Drawer.Screen 
        name="Film" 
        component={FilmScreen} 
        options={{ headerShown: false }} 
      />
      <Drawer.Screen 
        name="Genres" 
        component={GenresScreen} 
        options={{ headerShown: false }} 
      />
      <Drawer.Screen 
        name="MyNetwork" 
        component={MyNetworkScreen} 
        options={{ headerShown: false }} 
      />
      <Drawer.Screen 
        name="MyProfile" 
        component={ProfileMain} 
        options={{ headerShown: false }} 
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ headerShown: false }} 
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  screenText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});