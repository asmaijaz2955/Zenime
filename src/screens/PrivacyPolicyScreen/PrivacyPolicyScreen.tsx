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

// Section Component
const PolicySection = ({ title, content, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {content && <Text style={styles.sectionContent}>{content}</Text>}
    {children}
  </View>
);

// Bullet Point Component
const BulletPoint = ({ text }) => (
  <View style={styles.bulletContainer}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

export default function PrivacyPolicyScreen({ navigation }) {
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

      {/* Privacy Policy Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last updated: December 2024</Text>

        <PolicySection
          title="1. Information We Collect"
          content="We collect information you provide directly to us, such as when you create an account, subscribe to our service, or contact us for support."
        >
          <BulletPoint text="Account information (email, username, password)" />
          <BulletPoint text="Payment information for subscriptions" />
          <BulletPoint text="Viewing history and preferences" />
          <BulletPoint text="Device information and app usage data" />
        </PolicySection>

        <PolicySection
          title="2. How We Use Your Information"
          content="We use the information we collect to provide, maintain, and improve our services."
        >
          <BulletPoint text="Provide and deliver anime streaming services" />
          <BulletPoint text="Process payments and manage subscriptions" />
          <BulletPoint text="Send notifications about new episodes" />
          <BulletPoint text="Personalize content recommendations" />
          <BulletPoint text="Improve app performance and user experience" />
        </PolicySection>

        <PolicySection
          title="3. Information Sharing"
          content="We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy."
        >
          <BulletPoint text="Service providers who assist our operations" />
          <BulletPoint text="Legal compliance when required by law" />
          <BulletPoint text="Business transfers in case of merger or acquisition" />
        </PolicySection>

        <PolicySection
                  title="4. Data Security"
                  content="We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction." children={undefined}        />

        <PolicySection
                  title="5. Data Retention"
                  content="We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law." children={undefined}        />

        <PolicySection
          title="6. Your Rights"
          content="Depending on your location, you may have certain rights regarding your personal information."
        >
          <BulletPoint text="Access and review your personal data" />
          <BulletPoint text="Correct inaccurate information" />
          <BulletPoint text="Delete your account and associated data" />
          <BulletPoint text="Opt-out of marketing communications" />
          <BulletPoint text="Data portability for certain information" />
        </PolicySection>

        <PolicySection
                  title="7. Cookies and Tracking"
                  content="We use cookies and similar tracking technologies to enhance your experience, analyze app usage, and provide personalized content." children={undefined}        />

        <PolicySection
                  title="8. Children's Privacy"
                  content="Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13 without parental consent." children={undefined}        />

        <PolicySection
                  title="9. International Data Transfers"
                  content="Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data." children={undefined}        />

        <PolicySection
                  title="10. Changes to This Policy"
                  content="We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the 'Last updated' date." children={undefined}        />

        <PolicySection
          title="11. Contact Us"
          content="If you have any questions about this Privacy Policy or our data practices, please contact us:"
        >
          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>Email: privacy@zenime.com</Text>
            <Text style={styles.contactText}>Address: 123 Anime Street, Tokyo, Japan</Text>
            <Text style={styles.contactText}>Phone: +81-3-1234-5678</Text>
          </View>
        </PolicySection>

        {/* Agreement Section */}
        <View style={styles.agreementSection}>
          <Text style={styles.agreementText}>
            By using Zenime, you acknowledge that you have read and understood this Privacy Policy and agree to our collection, use, and sharing of your information as described herein.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
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
  content: {
    flex: 1,
    paddingHorizontal: wp('4%'),
  },
  pageTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  lastUpdated: {
    fontSize: wp('3.2%'),
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: hp('3%'),
    fontStyle: 'italic',
  },
  section: {
    marginBottom: hp('3%'),
  },
  sectionTitle: {
    fontSize: wp('4.2%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp('1%'),
  },
  sectionContent: {
    fontSize: wp('3.6%'),
    color: '#D1D5DB',
    lineHeight: hp('2.5%'),
    marginBottom: hp('1.5%'),
  },
  bulletContainer: {
    flexDirection: 'row',
    marginBottom: hp('0.8%'),
    paddingLeft: wp('2%'),
  },
  bullet: {
    fontSize: wp('3.6%'),
    color: '#DB202C',
    marginRight: wp('2%'),
    fontWeight: 'bold',
  },
  bulletText: {
    fontSize: wp('3.4%'),
    color: '#D1D5DB',
    flex: 1,
    lineHeight: hp('2.2%'),
  },
  contactInfo: {
    backgroundColor: '#1F2937',
    padding: wp('4%'),
    borderRadius: 8,
    marginTop: hp('1%'),
  },
  contactText: {
    fontSize: wp('3.4%'),
    color: '#FFFFFF',
    marginBottom: hp('0.5%'),
  },
  agreementSection: {
    backgroundColor: '#1F2937',
    padding: wp('4%'),
    borderRadius: 8,
    marginTop: hp('2%'),
    borderLeftWidth: 4,
    borderLeftColor: '#DB202C',
  },
  agreementText: {
    fontSize: wp('3.6%'),
    color: '#FFFFFF',
    lineHeight: hp('2.5%'),
    fontWeight: '500',
  },
  bottomPadding: {
    height: hp('4%'),
  },
});