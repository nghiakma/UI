import React from 'react';
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

// Privacy Policy Content Sections
const POLICY_SECTIONS = [
  {
    id: '1',
    title: 'Lorem ipsum dolor',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.',
  },
  {
    id: '2',
    title: 'Id velit, tincidunt nascetur at rhoncus',
    content: 'Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames. Id velit, tincidunt nascetur at rhoncus. Bibendum sed ut lectus facilisi amet orci sed. A blandit volutpat tortor sed libero facilisis vitae.',
  },
  {
    id: '3',
    title: 'Eget ornare quam vel facilisis',
    content: 'Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames. Id velit, tincidunt nascetur at rhoncus. Bibendum sed ut lectus facilisi amet orci sed. A blandit volutpat tortor sed libero facilisis vitae, et blandit. Sed ut lectus facilisi orci sed volutpa.',
  },
  {
    id: '4',
    title: 'Sagittis arcu, tortor sapien',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.',
  },
  {
    id: '5',
    title: 'Semper sit nulla leo auctor',
    content: 'Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames. Id velit, tincidunt nascetur at rhoncus. Bibendum sed ut lectus facilisi amet orci sed. A blandit volutpat tortor sed libero facilisis vitae.',
  },
];

const PolicySection = ({ title, content }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={[styles.container, {paddingTop: Platform.OS === 'ios' ? 0 : 40}]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>
      
      {/* Policy Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.lastUpdated}>Last updated: April 10, 2023</Text>
        
        <Text style={styles.introText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
        </Text>
        
        {POLICY_SECTIONS.map((section) => (
          <PolicySection 
            key={section.id}
            title={section.title}
            content={section.content}
          />
        ))}
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
    color: '#212121',
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: SPACING.xxxl,
    paddingBottom: SPACING.xxxl,
    paddingTop: 8,
  },
  lastUpdated: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 14,
    color: '#757575',
    marginBottom: 24,
    lineHeight: 20,
  },
  introText: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
    marginBottom: 32,
    letterSpacing: 0.2,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 18,
    color: '#212121',
    marginBottom: 12,
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  sectionContent: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
    letterSpacing: 0.2,
  },
});

export default PrivacyPolicyScreen; 