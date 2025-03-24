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
import CourseCard from '../components/CourseCard';
import { CATEGORIES, COURSES } from './HomeScreen';
import { useBookmark } from '../context/BookmarkContext';
import RemoveBookmarkSheet from '../components/RemoveBookmarkSheet';

const BookmarkScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const { isBookmarked, toggleBookmark } = useBookmark();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const bookmarkedCourses = COURSES.filter(course => isBookmarked(course.id));
  
  const filteredCourses = bookmarkedCourses.filter(course => {
    if (selectedCategory === '1') return true;
    return CATEGORIES.find(cat => cat.id === selectedCategory)?.label.includes(course.category);
  });

  const handleBookmarkPress = (courseId) => {
    setSelectedCourseId(courseId);
    setIsBottomSheetVisible(true);
  };

  const handleConfirmRemove = () => {
    if (selectedCourseId) {
      toggleBookmark(selectedCourseId);
      setSelectedCourseId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={COLORS.text.primary}
            />
          </TouchableOpacity>
          <Text style={styles.title}>My Bookmark</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons
            name="ellipsis-horizontal-circle-outline"
            size={24}
            color={COLORS.text.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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

        {/* Course List */}
        <View style={styles.courseList}>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    marginTop: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  backButton: {
    padding: SPACING.xs,
  },
  title: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.xxl,
    color: COLORS.text.primary,
  },
  moreButton: {
    padding: SPACING.xs,
  },
  content: {
    padding: SPACING.xl,
    gap: SPACING.xl,
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
  courseList: {
    gap: SPACING.xl,
  },
});

export default BookmarkScreen; 