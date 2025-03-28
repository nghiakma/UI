import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import FlagPlaceholders from '../assets/flags/placeholder';

// List of language options
const LANGUAGES = [
  { id: '1', name: 'English (UK)', code: 'en_UK', flag: 'uk' },
  { id: '2', name: 'English (US)', code: 'en_US', flag: 'us' },
  { id: '3', name: 'Mandarin', code: 'zh', flag: 'china' },
  { id: '4', name: 'Hindi', code: 'hi', flag: 'india' },
  { id: '5', name: 'Spanish', code: 'es', flag: 'spain' },
  { id: '6', name: 'French', code: 'fr', flag: 'france' },
  { id: '7', name: 'Arabic', code: 'ar', flag: 'uae' },
  { id: '8', name: 'Bengali', code: 'bn', flag: 'bangladesh' },
  { id: '9', name: 'Russian', code: 'ru', flag: 'russia' },
  { id: '10', name: 'Portuguese', code: 'pt', flag: 'portugal' },
];

const LanguageSettingsScreen = ({ navigation }) => {
  // State to manage selected language
  const [selectedLanguage, setSelectedLanguage] = useState('2'); // Default to English (US)

  // Handle language selection
  const handleLanguageSelect = (id) => {
    setSelectedLanguage(id);
  };

  // Render Flag component based on flag key
  const renderFlag = (flagKey) => {
    const FlagComponent = FlagPlaceholders[flagKey];
    return FlagComponent ? <FlagComponent /> : null;
  };

  return (
    <SafeAreaView style={[styles.container, {paddingTop: Platform.OS === 'ios' ? 0 : 40}]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
      </View>
      
      {/* Language List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.languageContainer}>
          {LANGUAGES.map((language) => (
            <TouchableOpacity
              key={language.id}
              style={styles.languageItem}
              onPress={() => handleLanguageSelect(language.id)}
            >
              <View style={styles.languageInfo}>
                {renderFlag(language.flag)}
                <Text style={styles.languageName}>{language.name}</Text>
              </View>
              <View style={[
                styles.radioCircle,
                selectedLanguage === language.id && styles.radioCircleSelected
              ]}>
                {selectedLanguage === language.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  languageContainer: {
    marginTop: SPACING.xl,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageName: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 18,
    color: '#424242',
    letterSpacing: 0.2,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
});

export default LanguageSettingsScreen; 