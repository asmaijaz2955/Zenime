import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Star Rating Component
const StarRating = ({ rating, onRatingChange, size = wp('8%') }) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRatingChange(star)}
          style={styles.starButton}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={star <= rating ? '#FFD700' : '#374151'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Thank You Screen Component
const ThankYouScreen = ({ navigation }) => (
  <View style={styles.thankYouContainer}>
    <View style={styles.checkmarkContainer}>
      <Ionicons name="checkmark-circle" size={wp('20%')} color="#10B981" />
    </View>
    <Text style={styles.thankYouTitle}>Thanks for Rating Us</Text>
    <Text style={styles.thankYouSubtitle}>
      Your feedback helps us improve Zenime
    </Text>
    <TouchableOpacity
      style={styles.doneButton}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.doneButtonText}>Done</Text>
    </TouchableOpacity>
  </View>
);

export default function RateUsScreen({ navigation }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Please select a rating', 'Choose at least one star to continue');
      return;
    }

    // Here you would typically send the rating and feedback to your backend
    console.log('Rating submitted:', { rating, feedback });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
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
        <ThankYouScreen navigation={navigation} />
      </SafeAreaView>
    );
  }

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

      {/* Rate Us Content */}
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Rate Us</Text>
        
        <View style={styles.ratingSection}>
          <Text style={styles.ratingQuestion}>How would you rate your experience?</Text>
          
          <StarRating rating={rating} onRatingChange={setRating} />
          
          {rating > 0 && (
            <Text style={styles.ratingText}>
              {rating === 1 && "We're sorry to hear that"}
              {rating === 2 && "We can do better"}
              {rating === 3 && "Not bad, but we can improve"}
              {rating === 4 && "Great! Thanks for the feedback"}
              {rating === 5 && "Awesome! You made our day"}
            </Text>
          )}
        </View>

        {rating > 0 && (
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackLabel}>
              Tell us more about your experience (optional)
            </Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Share your thoughts..."
              placeholderTextColor="#6B7280"
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        )}

        {rating > 0 && (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
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
    paddingTop: hp('4%'),
  },
  pageTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: hp('4%'),
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  ratingQuestion: {
    fontSize: wp('4%'),
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: hp('3%'),
    lineHeight: hp('2.5%'),
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  starButton: {
    marginHorizontal: wp('1%'),
    padding: wp('1%'),
  },
  ratingText: {
    fontSize: wp('3.5%'),
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  feedbackSection: {
    marginBottom: hp('4%'),
  },
  feedbackLabel: {
    fontSize: wp('4%'),
    color: '#FFFFFF',
    marginBottom: hp('1.5%'),
  },
  feedbackInput: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: wp('4%'),
    fontSize: wp('3.8%'),
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#374151',
    minHeight: hp('12%'),
  },
  submitButton: {
    backgroundColor: '#DB202C',
    paddingVertical: hp('2%'),
    borderRadius: 8,
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  submitButtonText: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  // Thank You Screen Styles
  thankYouContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('8%'),
  },
  checkmarkContainer: {
    marginBottom: hp('3%'),
  },
  thankYouTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: hp('1.5%'),
  },
  thankYouSubtitle: {
    fontSize: wp('4%'),
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: hp('2.5%'),
    marginBottom: hp('4%'),
  },
  doneButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: wp('8%'),
    paddingVertical: hp('1.8%'),
    borderRadius: 8,
  },
  doneButtonText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});