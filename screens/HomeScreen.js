import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';
import Avatar from '../components/Avatar';
import SpecialOfferCard from '../components/SpecialOfferCard';
import CourseCard from '../components/CourseCard';
import { useBookmark } from '../context/BookmarkContext';
import RemoveBookmarkSheet from '../components/RemoveBookmarkSheet';

export const CATEGORIES = [
  { id: '1', label: '🔥 All' },
  { id: '2', label: '💡 3D Design' },
  { id: '3', label: '💰 Business' },
  { id: '4', label: '🎨 UI/UX Design' },
  { id: '5', label: '🎨 Entrepreneurship' },
];

const MENTORS = [
  { id: '1', name: 'Jacob', image: { uri: 'https://picsum.photos/200?random=1' } },
  { id: '2', name: 'Claire', image: { uri: 'https://picsum.photos/200?random=2' } },
  { id: '3', name: 'Priscilla', image: { uri: 'https://picsum.photos/200?random=3' } },
  { id: '4', name: 'Wade', image: { uri: 'https://picsum.photos/200?random=4' } },
  { id: '5', name: 'Kathryn', image: { uri: 'https://picsum.photos/200?random=5' } },
];

export const COURSES = [
  {
    id: '1',
    title: '3D Design Illustration',
    category: '3D Design',
    image: { uri: 'https://picsum.photos/400/300?random=6' },
    price: '48',
    originalPrice: '80',
    rating: '4.8',
    students: '8,289',
    isBookmarked: true,
  },
  {
    id: '2',
    title: 'Digital Entrepreneurship',
    category: 'Entrepreneurship',
    image: { uri: 'https://picsum.photos/400/300?random=7' },
    price: '39',
    rating: '4.9',
    students: '6,182',
    isBookmarked: false,
  },
  {
    id: '3',
    title: 'Learn UX User Persona',
    category: 'UI/UX Design',
    image: { uri: 'https://picsum.photos/400/300?random=8' },
    price: '42',
    originalPrice: '75',
    rating: '4.7',
    students: '7,938',
    isBookmarked: true,
  },
];

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const { isBookmarked, toggleBookmark } = useBookmark();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const filteredCourses = COURSES.filter(course => {
    if (selectedCategory === '1') return true;
    return CATEGORIES.find(cat => cat.id === selectedCategory)?.label.includes(course.category);
  });

  const handleBookmarkPress = (courseId) => {
    if (isBookmarked(courseId)) {
      setSelectedCourseId(courseId);
      setIsBottomSheetVisible(true);
    } else {
      toggleBookmark(courseId);
    }
  };

  const handleConfirmRemove = () => {
    if (selectedCourseId) {
      toggleBookmark(selectedCourseId);
      setSelectedCourseId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Avatar
              size={48}
              source={{ uri: 'https://picsum.photos/200?random=9' }}
            />
            <View>
              <Text style={styles.greeting}>Good Morning 👋</Text>
              <Text style={styles.username}>Andrew Ainsley</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('Notification')}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={COLORS.text.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('Bookmark')}
            >
              <Ionicons
                name="bookmark-outline"
                size={24}
                color={COLORS.text.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <Ionicons
              name="search-outline"
              size={24}
              color={COLORS.text.lightGray}
            />
            <Text style={styles.searchPlaceholder}>Search</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons
              name="options-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Special Offer */}
        <SpecialOfferCard />

        {/* Top Mentors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Mentors</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mentorsContainer}
          >
            {MENTORS.map((mentor) => (
              <View key={mentor.id} style={styles.mentorItem}>
                <Avatar source={mentor.image} size={64} />
                <Text style={styles.mentorName}>{mentor.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Most Popular Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Most Popular Courses</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.activeCategoryButton,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.id && styles.activeCategoryButtonText,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
          </ScrollView>

          {/* Course Cards */}
          <View style={styles.coursesContainer}>
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              category={course.category}
              image={course.image}
              price={course.price}
              originalPrice={course.originalPrice}
              rating={course.rating}
              students={course.students}
              isBookmarked={isBookmarked(course.id)}
              onPress={() => navigation.navigate('CourseDetail', { course })}
              onBookmarkPress={() => handleBookmarkPress(course.id)}
            />
          ))}
          </View>
        </View>
      </ScrollView>

      <RemoveBookmarkSheet
        visible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        onConfirm={handleConfirmRemove}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  contentContainer: {
    padding: SPACING.xl,
    gap: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  greeting: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: SIZES.lg,
    color: COLORS.text.secondary,
    letterSpacing: 0.2,
  },
  username: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.xxl,
    color: COLORS.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  searchInput: {
    flex: 1,
    height: 56,
    backgroundColor: COLORS.background.gray,
    borderRadius: BORDER_RADIUS.medium,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
  },
  searchPlaceholder: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: SIZES.md,
    color: COLORS.text.lightGray,
    letterSpacing: 0.2,
  },
  filterButton: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.background.gray,
    borderRadius: BORDER_RADIUS.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    gap: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.xxl,
    color: COLORS.text.primary,
  },
  seeAll: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.lg,
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
  mentorsContainer: {
    paddingVertical: SPACING.xs,
    gap: SPACING.xl,
  },
  mentorItem: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  mentorName: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.text.primary,
    letterSpacing: 0.2,
  },
  categoriesContainer: {
    paddingVertical: SPACING.xs,
    gap: SPACING.lg,
  },
  categoryButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  activeCategoryButton: {
    backgroundColor: COLORS.primary,
  },
  categoryButtonText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
  activeCategoryButtonText: {
    color: COLORS.white,
  },
  coursesContainer: {
    gap: SPACING.xl,
  },
});

export default HomeScreen; 