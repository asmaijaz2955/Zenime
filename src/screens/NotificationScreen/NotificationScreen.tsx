import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Toggle Setting Component
const ToggleSetting = ({ title, description, value, onValueChange }) => (
  <View style={styles.toggleContainer}>
    <View style={styles.toggleLeft}>
      <Text style={styles.toggleTitle}>{title}</Text>
      {description && <Text style={styles.toggleDescription}>{description}</Text>}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#374151', true: '#DB202C' }}
      thumbColor={value ? '#FFFFFF' : '#9CA3AF'}
      ios_backgroundColor="#374151"
    />
  </View>
);

export default function NotificationScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [newEpisodes, setNewEpisodes] = useState(true);
  const [recommendations, setRecommendations] = useState(false);

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
        <Text style={styles.headerTitle}>
          Zen<Text style={styles.headerAccent}>ime</Text>
        </Text>
      </View>

      {/* Notification Content */}
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Notification</Text>
        
        {/* Main Toggle */}
        <View style={styles.mainToggleContainer}>
          <Text style={styles.mainToggleLabel}>No/off</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#374151', true: '#DB202C' }}
            thumbColor={notificationsEnabled ? '#FFFFFF' : '#9CA3AF'}
            ios_backgroundColor="#374151"
            style={styles.mainToggle}
          />
        </View>

        {/* Notification Settings */}
        {notificationsEnabled && (
          <View style={styles.settingsContainer}>
            <ToggleSetting
              title="Push Notifications"
              description="Receive notifications on your device"
              value={pushNotifications}
              onValueChange={setPushNotifications}
            />
            
            <ToggleSetting
              title="Email Notifications"
              description="Receive notifications via email"
              value={emailNotifications}
              onValueChange={setEmailNotifications}
            />
            
            <ToggleSetting
              title="New Episodes"
              description="Get notified when new episodes are available"
              value={newEpisodes}
              onValueChange={setNewEpisodes}
            />
            
            <ToggleSetting
              title="Recommendations"
              description="Receive personalized anime recommendations"
              value={recommendations}
              onValueChange={setRecommendations}
            />
          </View>
        )}

        {!notificationsEnabled && (
          <View style={styles.disabledContainer}>
            <Ionicons name="notifications-off" size={wp('15%')} color="#374151" />
            <Text style={styles.disabledText}>Notifications are currently disabled</Text>
            <Text style={styles.disabledSubtext}>
              Enable notifications to receive updates about new episodes and recommendations
            </Text>
          </View>
        )}
      </View>
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
  headerAccent: {
    color: '#DB202C',
  },
  content: {
    flex: 1,
    paddingHorizontal: wp('4%'),
    paddingTop: hp('3%'),
  },
  pageTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp('3%'),
  },
  mainToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    marginBottom: hp('3%'),
  },
  mainToggleLabel: {
    fontSize: wp('4.5%'),
    color: '#FFFFFF',
    fontWeight: '500',
  },
  mainToggle: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  settingsContainer: {
    marginTop: hp('2%'),
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  toggleLeft: {
    flex: 1,
    marginRight: wp('4%'),
  },
  toggleTitle: {
    fontSize: wp('4%'),
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: hp('0.5%'),
  },
  toggleDescription: {
    fontSize: wp('3.2%'),
    color: '#9CA3AF',
    lineHeight: hp('2%'),
  },
  disabledContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('8%'),
  },
  disabledText: {
    fontSize: wp('4.5%'),
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  disabledSubtext: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: hp('2.5%'),
  },
});