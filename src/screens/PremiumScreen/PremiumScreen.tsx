import React, { useState } from 'react';
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

// Plan Card Component
const PlanCard = ({ title, price, period, features, isPopular, onUpgrade }) => (
  <View style={[styles.planCard, isPopular && styles.popularPlan]}>
    <View style={styles.planHeader}>
      <Text style={styles.planTitle}>{title}</Text>
      <Text style={styles.planPrice}>{price}</Text>
      <Text style={styles.planPeriod}>{period}</Text>
    </View>
    
    <View style={styles.featuresContainer}>
      {features.map((feature, index) => (
        <View key={index} style={styles.featureItem}>
          <Text style={styles.featureText}>• {feature}</Text>
        </View>
      ))}
    </View>
    
    <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
      <Text style={styles.upgradeButtonText}>Upgrade</Text>
    </TouchableOpacity>
  </View>
);

export default function PremiumScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'free',
      title: 'Free Tier',
      price: 'Free',
      period: 'Always limited features',
      features: [
        'Limited LoM conversion/month',
        'Ads in audio stream'
      ],
      isPopular: false
    },
    {
      id: 'pro',
      title: 'Pro Tier',
      price: '$9.99/month',
      period: 'Unlimited',
      features: [
        'Unlimited HD streaming',
        'No ads, offline viewing',
        'Access all anime titles'
      ],
      isPopular: true
    },
    {
      id: 'creator',
      title: 'Creator Tier',
      price: '$19.99/month',
      period: 'Stream in Full HD & 4K',
      features: [
        'Early access to new episodes',
        'Includes all Pro features',
        'All Pro Tier features'
      ],
      isPopular: false
    }
  ];

  const handleUpgrade = (planId) => {
    setSelectedPlan(planId);
    // Handle upgrade logic here
    console.log(`Upgrading to ${planId} plan`);
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
        <Text style={styles.headerTitle}>
          Zen<Text style={styles.headerAccent}>ime</Text>
        </Text>
      </View>

      {/* Current Plan Status */}
      <View style={styles.currentPlanContainer}>
        <Text style={styles.currentPlanTitle}>Premium Screen</Text>
        <Text style={styles.currentPlanSubtitle}>Free Tier</Text>
        <Text style={styles.currentPlanDescription}>Access Limited features</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Available Plans Section */}
        <Text style={styles.sectionTitle}>Available Plans</Text>
        
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            title={plan.title}
            price={plan.price}
            period={plan.period}
            features={plan.features}
            isPopular={plan.isPopular}
            onUpgrade={() => handleUpgrade(plan.id)}
          />
        ))}
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
  headerAccent: {
    color: '#DB202C',
  },
  currentPlanContainer: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  currentPlanTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp('1%'),
  },
  currentPlanSubtitle: {
    fontSize: wp('4%'),
    color: '#10B981',
    fontWeight: '600',
    marginBottom: hp('0.5%'),
  },
  currentPlanDescription: {
    fontSize: wp('3.5%'),
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    paddingHorizontal: wp('4%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: hp('2%'),
  },
  planCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: wp('4%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: '#374151',
  },
  popularPlan: {
    borderColor: '#DB202C',
    borderWidth: 2,
  },
  planHeader: {
    marginBottom: hp('2%'),
  },
  planTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp('0.5%'),
  },
  planPrice: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp('0.3%'),
  },
  planPeriod: {
    fontSize: wp('3.2%'),
    color: '#9CA3AF',
  },
  featuresContainer: {
    marginBottom: hp('2%'),
  },
  featureItem: {
    marginBottom: hp('0.8%'),
  },
  featureText: {
    fontSize: wp('3.5%'),
    color: '#D1D5DB',
    lineHeight: hp('2.2%'),
  },
  upgradeButton: {
    backgroundColor: '#374151',
    paddingVertical: hp('1.5%'),
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#FFFFFF',
  },
});