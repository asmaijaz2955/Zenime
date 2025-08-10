import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Reusable Setting Item Component
const SettingItem = ({ icon, title, onPress, showArrow = true }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingLeft}>
      <Ionicons name={icon} size={wp('5%')} color="#FFFFFF" style={styles.settingIcon} />
      <Text style={styles.settingTitle}>{title}</Text>
    </View>
    {showArrow && (
      <Ionicons name="chevron-forward" size={wp('4%')} color="#9CA3AF" />
    )}
  </TouchableOpacity>
);

// Section Header Component
const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

export default function SettingsScreen({ navigation }) {
  const handlePremiumPress = () => {
    navigation.navigate('PremiumScreen');
  };

  const handleNotificationPress = () => {
    navigation.navigate('NotificationScreen');
  };

  const handlePrivacyPress = () => {
    navigation.navigate('PrivacyPolicyScreen');
  };

  const handleRatePress = () => {
    navigation.navigate('RateUsScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={wp('6%')} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setting</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* General Section */}
        <SectionHeader title="General" />
        
        <SettingItem
          icon="diamond-outline"
          title="Premium Screen"
          onPress={handlePremiumPress}
        />
        
        <SettingItem
          icon="notifications-outline"
          title="Notification"
          onPress={handleNotificationPress}
        />
        
        <SettingItem
          icon="shield-checkmark-outline"
          title="Privacy Policy"
          onPress={handlePrivacyPress}
        />
        
        <SettingItem
          icon="star-outline"
          title="Rate Us"
          onPress={handleRatePress}
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
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  backButton: {
    marginRight: wp('4%'),
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingTop: hp('2%'),
  },
  sectionHeader: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
  },
  sectionTitle: {
    fontSize: wp('3.5%'),
    color: '#9CA3AF',
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: wp('4%'),
  },
  settingTitle: {
    fontSize: wp('4%'),
    color: '#FFFFFF',
    fontWeight: '500',
  },
});