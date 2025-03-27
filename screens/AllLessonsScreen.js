import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

// Function to calculate total number of lessons
const calculateTotalLessons = (sections) => {
  if (!sections) return 0;
  
  return sections.reduce((total, section) => {
    return total + (section.lessons ? section.lessons.length : 0);
  }, 0);
};

const AllLessonsScreen = ({ navigation, route }) => {
  // Get course data from route params
  const { course } = route.params || {};

  if (!course || !course.lessons) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Lessons</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No lessons available</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate total lessons count
  const totalLessons = course.lessons.totalCount || calculateTotalLessons(course.lessons.sections);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Lessons</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Course Info */}
      <View style={styles.courseInfoContainer}>
        <Text style={styles.courseName}>{course.title}</Text>
        <Text style={styles.lessonCount}>{totalLessons} Lessons</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Sections and Lessons */}
        {course.lessons.sections.map((section) => (
          <View key={section.id} style={styles.sectionContainer}>
            {/* Section Header */}
            <View style={styles.sectionHeaderContainer}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionDuration}>{section.totalDuration}</Text>
              </View>
              
              {/* Section Progress */}
              {/* <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${calculateCompletionPercentage(section)}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{calculateCompletionPercentage(section)}% Complete</Text>
              </View> */}
            </View>

            {/* Lessons */}
            <View style={styles.lessonsContainer}>
              {section.lessons.map((lesson) => (
                <View key={lesson.id} style={styles.lessonCard}>
                  <View style={styles.lessonLeftContainer}>
                    <View style={styles.lessonNumberContainer}>
                      <Text style={styles.lessonNumber}>{lesson.number}</Text>
                    </View>
                    <View style={styles.lessonDetails}>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={[
                      styles.lessonActionButton,
                      lesson.isLocked ? styles.lockedButton : styles.playButton
                    ]}
                  >
                    <Ionicons 
                      name={lesson.isLocked ? "lock-closed-outline" : "play"} 
                      size={20} 
                      color={lesson.isLocked ? COLORS.text.lightGray : COLORS.primary} 
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.gray,
    marginTop: 30
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 24,
    color: COLORS.text.primary,
  },
  placeholder: {
    width: 40,
  },
  courseInfoContainer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.gray,
  },
  courseName: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 22,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  lessonCount: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.gray,
  },
  sectionHeaderContainer: {
    marginBottom: SPACING.lg,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 18,
    color: COLORS.text.primary,
  },
  sectionDuration: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 16,
    color: COLORS.primary,
  },
  progressContainer: {
    gap: SPACING.xs,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#EAECF5',
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  progressText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 14,
    color: COLORS.text.lightGray,
  },
  lessonsContainer: {
    gap: SPACING.md,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border.gray,
    ...SHADOWS.small,
  },
  lessonLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lessonNumberContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(51, 94, 247, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  lessonNumber: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.md,
    color: COLORS.primary,
  },
  lessonDetails: {
    flex: 1,
  },
  lessonTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 16,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  lessonDuration: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 14,
    color: COLORS.text.gray,
  },
  lessonActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 94, 247, 0.08)',
  },
  playButton: {
    backgroundColor: 'rgba(51, 94, 247, 0.08)',
  },
  lockedButton: {
    backgroundColor: COLORS.background.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxxl,
  },
  emptyText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 18,
    color: COLORS.text.lightGray,
    textAlign: 'center',
  },
});

export default AllLessonsScreen; 