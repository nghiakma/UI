import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import Avatar from '../components/Avatar';

const MENTORS = [
  {
    id: '1',
    name: 'Jacob Kulikowski',
    role: 'Marketing Analyst',
    image: { uri: 'https://picsum.photos/200?random=1' }
  },
  {
    id: '2',
    name: 'Claire Ordonez',
    role: 'VP of Sales',
    image: { uri: 'https://picsum.photos/200?random=2' }
  },
  {
    id: '3',
    name: 'Priscilla Ehrman',
    role: 'UX Designer',
    image: { uri: 'https://picsum.photos/200?random=3' }

  },
  {
    id: '4',
    name: 'Wade Chenail',
    role: 'Manager, Solution Engineering',
    image: { uri: 'https://picsum.photos/200?random=4' }
  },
  {
    id: '5',
    name: 'Kathryn Pera',
    role: 'Product Manager',
    image: { uri: 'https://picsum.photos/200?random=5' }
  },
  {
    id: '6',
    name: 'Francene Vandyne',
    role: 'EVP and GM, Sales Cloud',
    image: { uri: 'https://picsum.photos/200?random=6' }
  },
  {
    id: '7',
    name: 'Benny Spanbauer',
    role: 'Senior Product Manager',
    image: { uri: 'https://picsum.photos/200?random=7' }
  },
  {
    id: '8',
    name: 'Jamel Eusebio',
    role: 'Product Designer',
    image: { uri: 'https://picsum.photos/200?random=8' }
  },
  {
    id: '9',
    name: 'Cyndy Lillibridge',
    role: 'VP of Marketing',
    image: { uri: 'https://picsum.photos/200?random=9' }
  },
  {
    id: '10',
    name: 'Titus Kitamura',
    role: 'Information',
    image: { uri: 'https://picsum.photos/200?random=10' }
  },
];

const MentorItem = ({ mentor }) => (
  <TouchableOpacity style={styles.mentorItem}>
    <View style={styles.mentorInfo}>
      <Avatar source={mentor.image} size={56} />
      <View style={styles.mentorTextContainer}>
        <Text style={styles.mentorName}>{mentor.name}</Text>
        <Text style={styles.mentorRole}>{mentor.role}</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.chatButton}>
      <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.primary} />
    </TouchableOpacity>
  </TouchableOpacity>
);

const TopMentorsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Top Mentors</Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search-outline" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Mentors List */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {MENTORS.map((mentor) => (
            <MentorItem key={mentor.id} mentor={mentor} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  content: {
    flex: 1,
    paddingTop: 60, // Based on Figma's top spacing
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 4,
    gap: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 24,
    lineHeight: 28.8, // 1.2 line height ratio from Figma
    color: COLORS.text.primary,
  },
  searchButton: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 24,
  },
  mentorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  mentorInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  mentorTextContainer: {
    gap: 4,
  },
  mentorName: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 18,
    lineHeight: 21.6, // 1.2 line height ratio from Figma
    letterSpacing: 0.2,
    color: COLORS.text.primary,
  },
  mentorRole: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 14,
    lineHeight: 19.6, // 1.4 line height ratio from Figma
    letterSpacing: 0.2,
    color: COLORS.text.gray,
  },
  chatButton: {
    padding: 4,
  },
});

export default TopMentorsScreen; 