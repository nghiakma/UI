import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

// Custom Input Field Component
const InputField = ({ label, icon, value, onChangeText, keyboardType = 'default', editable = true }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={COLORS.text.secondary}
        keyboardType={keyboardType}
        editable={editable}
      />
      {icon && (
        <View style={styles.iconContainer}>
          {typeof icon === 'string' ? (
            <Ionicons name={icon} size={20} color={COLORS.text.primary} />
          ) : (
            icon
          )}
        </View>
      )}
    </View>
  );
};

// Main Component
const EditProfileScreen = ({ navigation }) => {
  // State for form fields
  const [fullName, setFullName] = useState('Andrew Ainsley');
  const [firstName, setFirstName] = useState('Andrew');
  const [dateOfBirth, setDateOfBirth] = useState('12/27/1995');
  const [email, setEmail] = useState('andrew_ainsley@yourdomain.com');
  const [country, setCountry] = useState('United States');
  const [phone, setPhone] = useState('+1 111 467 378 399');
  const [gender, setGender] = useState('Male');
  const [occupation, setOccupation] = useState('Student');

  // Handler for update button
  const handleUpdate = () => {
    // Save profile info logic would go here
    console.log('Profile updated');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>
      
      {/* Form */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.formContainer}>
          {/* Full Name */}
          <InputField
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          
          {/* First Name */}
          <InputField
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          
          {/* Date of Birth */}
          <InputField
            label="Date of Birth"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            icon="calendar-outline"
          />
          
          {/* Email */}
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="mail-outline"
          />
          
          {/* Country */}
          <InputField
            label="Country"
            value={country}
            onChangeText={setCountry}
            icon={
              <Ionicons name="chevron-down" size={20} color={COLORS.text.primary} />
            }
          />
          
          {/* Phone */}
          <InputField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            icon={
              <View style={styles.flagContainer}>
                <Image 
                  source={require('../assets/images/usa_flag.png')} 
                  style={styles.flagIcon}
                  resizeMode="contain"
                />
                <Ionicons name="chevron-down" size={20} color={COLORS.text.primary} />
              </View>
            }
          />
          
          {/* Gender */}
          <InputField
            label="Gender"
            value={gender}
            onChangeText={setGender}
            icon={
              <Ionicons name="chevron-down" size={20} color={COLORS.text.primary} />
            }
          />
          
          {/* Occupation */}
          <InputField
            label="Occupation"
            value={occupation}
            onChangeText={setOccupation}
          />
        </View>
        
        {/* Update Button */}
        <TouchableOpacity 
          style={styles.updateButton}
          onPress={handleUpdate}
        >
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md,
    paddingTop: SPACING.xxxl,
    marginTop: 40,
    marginBottom: 20
  },
  backButton: {
    marginRight: SPACING.lg,
  },
  headerTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 24,
    color: COLORS.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: SPACING.xxxl,
    paddingBottom: SPACING.xxxl,
  },
  formContainer: {
    gap: SPACING.xl,
    marginBottom: SPACING.xxxl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.gray,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.xl,
    height: 60,
    marginTop: 10,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 14,
    color: COLORS.text.primary,
    height: '100%',
    
  },
  iconContainer: {
    marginLeft: SPACING.md,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  flagIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.lg,
    alignItems: 'center', 
    justifyContent: 'center',
    ...SHADOWS.medium,
    position: 'absolute',
    top:'110%',
    left: SPACING.xxxl,
    right: SPACING.xxxl,
  },
  updateButtonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 0.2,
  },
});

export default EditProfileScreen; 