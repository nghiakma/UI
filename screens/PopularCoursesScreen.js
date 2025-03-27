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

const PopularCoursesScreen = ({ navigation }) => {
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
        {/* Most Popular Courses */}
        <View style={styles.section}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Most Popular Courses</Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search-outline" size={24} color={COLORS.text.primary} />
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
              onPress={() => navigation.navigate('CourseDetails', { course })}
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
    marginTop:40
  },
  contentContainer: {
    padding: SPACING.xl,
    gap: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default PopularCoursesScreen; 