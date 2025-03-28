import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import Avatar from '../components/Avatar';
import Tag from '../components/Tag';
import { useBookmark } from '../context/BookmarkContext';
import CourseCard from '../components/CourseCard';
import RemoveBookmarkSheet from '../components/RemoveBookmarkSheet';
import ReviewItem from '../components/ReviewItem';

const STUDENTS = [
    {
        id: '1',
        name: 'John Doe',
        role: 'student',
        image: require('../assets/images/Ellipse.png'),
    },
    {
        id: '2',
        name: 'Mary Caval',
        role: 'student',
        image: require('../assets/images/Ellipse.png'),
    },
    {
        id: '3',
        name: 'Coulson',
        role: 'student',
        image: require('../assets/images/Ellipse.png'),
    }
]

// Demo data for courses
const COURSES = [
  {
    id: '1',
    title: 'Learn UX User Persona',
    category: 'UI/UX Design',
    image: require('../assets/images/course_image_1.jpg'),
    price: '42',
    originalPrice: '75',
    rating: '4.7',
    students: '7,938',
    isBookmarked: true,
  },
  {
    id: '2',
    title: '3D Design Illustration',
    category: '3D Design',
    image: require('../assets/images/course_image_2.jpg'),
    price: '42',
    originalPrice: '45',
    rating: '4.1',
    students: '9,927',
    isBookmarked: false,
  },
];

// Demo data for reviews
const REVIEWS = [
  {
    id: '1',
    name: 'Jenny Wilson',
    avatar: { uri: 'https://picsum.photos/200?random=10' },
    rating: 5,
    date: '2 days ago',
    review: 'The explanation is concise and complete, easy to understand and the voice is very pleasant to listen to. The way the course is structured makes this a easy course to follow.',
  },
  {
    id: '2',
    name: 'Guy Hawkins',
    avatar: { uri: 'https://picsum.photos/200?random=11' },
    rating: 4,
    date: '1 week ago',
    review: 'Very interesting and engaging course. I learned a lot about user experience design and how to create effective user personas.',
  },
  {
    id: '3',
    name: 'Brooklyn Simmons',
    avatar: { uri: 'https://picsum.photos/200?random=12' },
    rating: 5,
    date: '3 weeks ago',
    review: 'Amazing content, well structured, and the instructor explains complex concepts in an easy to understand way.',
  },
  {
    id: '4',
    name: 'Tran Nghia',
    avatar: { uri: 'https://picsum.photos/200?random=12' },
    rating: 5,
    date: '2 days ago',
    review: 'Amazing content, well structured, and the instructor explains complex concepts in an easy to understand way.',
  },
];

const MentorProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Courses');
  const { isBookmarked, toggleBookmark } = useBookmark();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [reviews, setReviews] = useState(REVIEWS);

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Courses':
        return (
            <View style={styles.coursesContainer}>
            {COURSES.map((course) => (
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
                onBookmarkPress={() => handleBookmarkPress(course.id)}
              />
            ))}
            </View>
            
        );
      case 'Students':
        return (
            <View style={styles.coursesContainer}>
            {STUDENTS.map((student) => (
                <TouchableOpacity style={styles.mentorItem}>
                <View style={styles.mentorInfo}>
                  <Avatar source={student.image} size={56} />
                  <View style={styles.mentorTextContainer}>
                    <Text style={styles.mentorName}>{student.name}</Text>
                    <Text style={styles.mentorRole}>{student.role}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.chatButton}>
                  <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            </View>
        );
        // <TouchableOpacity onPress={() => navigation.navigate('MentorReviews', { reviews: REVIEWS })}>
      case 'Reviews':
        return (
          <View style={styles.reviewsContainer}>
          {/* Reviews Stats */}
          <View style={styles.reviewStats}>
            <View style={styles.reviewRatingContainer}>
              <Text style={styles.averageRating}>
                {(REVIEWS.reduce((acc, review) => acc + review.rating, 0) / REVIEWS.length).toFixed(1)}
              </Text>
              <View style={styles.starsContainer}>
                {[...Array(5)].map((_, i) => {
                  const rating = REVIEWS.reduce((acc, review) => acc + review.rating, 0) / REVIEWS.length;
                  return (
                    <Ionicons 
                      key={i} 
                      name={i < Math.round(rating) ? "star" : "star-outline"} 
                      size={16} 
                      color={COLORS.secondary} 
                    />
                  );
                })}
              </View>
              <Text style={styles.totalReviews}>
                Based on {reviews.length} reviews
              </Text>
            </View>
            
            {/* Rating distribution */}
            <View style={styles.ratingDistribution}>
              {[5, 4, 3, 2, 1].map(star => {
                const count = REVIEWS.filter(review => review.rating === star).length;
                const percentage = (count / REVIEWS.length) * 100;
                
                return (
                  <View key={star} style={styles.ratingRow}>
                    <Text style={styles.ratingLabel}>{star}</Text>
                    <Ionicons name="star" size={16} color={COLORS.secondary} />
                    <View style={styles.ratingBarBackground}>
                      <View 
                        style={[
                          styles.ratingBar,
                          { width: `${percentage}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.ratingCount}>{count}</Text>
                  </View>
                );
              })}
            </View>
          </View>
          
          {/* Reviews List */}
          <View style={styles.reviewsList}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.reviewsTitle}>Recent Reviews</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MentorReviews', { reviews  })}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {/* Display only first 3 reviews for compact view */}
            {reviews.slice(0, 3).map(review => (
              <ReviewItem
                key={review.id}
                review={review}
              />
            ))}
          </View>
        </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with back button and more options */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Information */}
        <View style={styles.profileContainer}>
          <Avatar 
            source={require('../assets/images/mentor_avatar.jpg')} 
            size={120} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Jonathan Williams</Text>
            <Text style={styles.profileRole}>Senior UI/UX Designer at Google</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>25</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>22,379</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>9,287</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.messageButton}>
            <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.white} />
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.websiteButton}>
            <Ionicons name="globe-outline" size={20} color={COLORS.primary} />
            <Text style={styles.websiteButtonText}>Website</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.sectionDivider} />

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'Courses' && styles.activeTabItem]} 
            onPress={() => setActiveTab('Courses')}
          >
            <Text style={[styles.tabText, activeTab === 'Courses' && styles.activeTabText]}>
              Courses
            </Text>
            {activeTab === 'Courses' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'Students' && styles.activeTabItem]} 
            onPress={() => setActiveTab('Students')}
          >
            <Text style={[styles.tabText, activeTab === 'Students' && styles.activeTabText]}>
              Students
            </Text>
            {activeTab === 'Students' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'Reviews' && styles.activeTabItem]} 
            onPress={() => setActiveTab('Reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'Reviews' && styles.activeTabText]}>
              Reviews
            </Text>
            {activeTab === 'Reviews' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
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
  scrollContent: {
    paddingHorizontal: SPACING.xxxl,
    paddingTop: 60, // Status bar height
    paddingBottom: SPACING.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  profileName: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.h1,
    lineHeight: SIZES.h1 * 1.2,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  profileRole: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.md,
    lineHeight: SIZES.md * 1.4,
    letterSpacing: 0.2,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.h1,
    lineHeight: SIZES.h1 * 1.2,
    color: COLORS.text.primary,
  },
  statLabel: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md,
    lineHeight: SIZES.md * 1.4,
    letterSpacing: 0.2,
    color: COLORS.text.gray,
    marginTop: SPACING.sm,
  },
  divider: {
    width: 1,
    height: 42,
    backgroundColor: COLORS.border.gray,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.sm,
  },
  buttonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.xl,
    lineHeight: SIZES.xl * 1.4,
    letterSpacing: 0.2,
    color: COLORS.white,
  },
  websiteButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.sm,
  },
  websiteButtonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.xl,
    lineHeight: SIZES.xl * 1.4,
    letterSpacing: 0.2,
    color: COLORS.primary,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.border.gray,
    marginBottom: SPACING.xxl,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.xxl,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SPACING.lg,
    position: 'relative',
  },
  activeTabItem: {
    borderBottomWidth: 0,
  },
  tabText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.xl,
    lineHeight: SIZES.xl * 1.4,
    letterSpacing: 0.2,
    color: COLORS.text.lightGray,
  },
  activeTabText: {
    color: COLORS.primary,
    fontFamily: FONTS.urbanist.bold,
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '24%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  coursesContainer: {
    gap: SPACING.xl,
  },
  courseCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    flexDirection: 'row',
    padding: SPACING.xl,
    gap: SPACING.xl,
    ...SHADOWS.small,
  },
  courseImageContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: '100%',
  },
  courseContent: {
    flex: 1,
    gap: SPACING.sm,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.xl,
    lineHeight: SIZES.xl * 1.2,
    color: COLORS.text.primary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  price: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.xl,
    color: COLORS.primary,
  },
  originalPrice: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.sm,
    color: COLORS.text.gray,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  rating: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.sm,
    color: COLORS.text.gray,
  },
  separator: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.sm,
    color: COLORS.text.gray,
    marginHorizontal: SPACING.xs,
  },
  students: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.sm,
    color: COLORS.text.gray,
  },
  emptyContainer: {
    paddingVertical: SPACING.section,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md,
    color: COLORS.text.lightGray,
  },
  mentorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10
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
  reviewsContainer: {
    gap: SPACING.xl,
  },
  reviewStats: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xl,
    gap: SPACING.xl,
    ...SHADOWS.small,
  },
  reviewRatingContainer: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  averageRating: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.h1,
    color: COLORS.text.primary,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  totalReviews: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.sm,
    color: COLORS.text.gray,
    marginTop: SPACING.xs,
  },
  ratingDistribution: {
    gap: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.gray,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  ratingLabel: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.text.primary,
    width: 10,
    textAlign: 'center',
  },
  ratingBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.background.gray,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  ratingBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  ratingCount: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.sm,
    color: COLORS.text.gray,
    width: 20,
    textAlign: 'right',
  },
  reviewsList: {
    gap: SPACING.xl,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewsTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 18,
    color: COLORS.text.primary,
  },
  seeAllText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 16,
    color: COLORS.primary,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.xl,
    gap: SPACING.md,
    ...SHADOWS.small,
    marginBottom: SPACING.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reviewerInfo: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'center',
  },
  reviewerDetails: {
    gap: SPACING.xs,
  },
  reviewerName: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.md,
    color: COLORS.text.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  reviewDate: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.sm,
    color: COLORS.text.lightGray,
  },
  moreButton: {
    padding: SPACING.xs,
  },
  reviewText: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: SIZES.md,
    lineHeight: SIZES.md * 1.6,
    color: COLORS.text.secondary,
  },
});

export default MentorProfileScreen;