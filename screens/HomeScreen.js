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

// Function to calculate total duration for a section
const calculateTotalDuration = (lessons) => {
  return lessons.reduce((total, lesson) => {
    const minutes = parseInt(lesson.duration.split(' ')[0]);
    return total + minutes;
  }, 0) + ' mins';
};

// Function to calculate total number of lessons
const calculateTotalLessons = (sections) => {
  return sections.reduce((total, section) => {
    return total + section.lessons.length;
  }, 0);
};

export const COURSES = [
  {
    id: '1',
    title: '3D Design Illustration',
    category: '3D Design',
    difficulty: 'Intermediate',
    image: { uri: 'https://picsum.photos/400/300?random=6' },
    price: '48',
    originalPrice: '80',
    rating: '4.8',
    students: '8,289',
    isBookmarked: true,
    reviews: '4,479',
    duration: '2,5',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    tools:[
      {
        title:"Figma",
        image: require('../assets/images/figma.png')
      },
      {
        title:"Photoshop",
        image: require('../assets/images/photoshop.png')
      },
    ],
    instructor: {
      id: '1',
      name: 'Jacob Kulikowski',
      role: 'Marketing Analyst',
      image: { uri: 'https://picsum.photos/200?random=1' }
    },
    lessons: {
      sections: [
        {
          id: '1',
          title: 'Section 1 - Introduction',
          lessons: [
            {
              id: '1',
              number: '01',
              title: 'Why Using 3D Design',
              duration: '20 mins',
              isLocked: false
            },
            {
              id: '2',
              number: '02',
              title: 'Set up Your Design Environment',
              duration: '5 mins',
              isLocked: true
            }
          ],
          totalDuration: '15 mins' // Will be calculated in CourseDetailsScreen
        },
        {
          id: '2',
          title: 'Section 2 - 3D Design Basics',
          totalDuration: '60 mins',
          lessons: [
            {
              id: '3',
              number: '03',
              title: 'Understanding 3D Interface',
              duration: '15 mins',
              isLocked: true
            },
            {
              id: '4',
              number: '04',
              title: 'Working with Shapes & Objects',
              duration: '10 mins',
              isLocked: true
            },
            {
              id: '5',
              number: '05',
              title: 'Working with Lighting & Textures',
              duration: '10 mins',
              isLocked: true
            },
            {
              id: '6',
              number: '06',
              title: 'Using Design Plugins',
              duration: '25 mins',
              isLocked: true
            }
          ]
        },
        {
          id: '3',
          title: 'Section 3 - Let\'s Practice',
          totalDuration: '75 mins',
          lessons: [
            {
              id: '7',
              number: '07',
              title: 'Let\'s Design a 3D Character',
              duration: '35 mins',
              isLocked: true
            },
            {
              id: '8',
              number: '08',
              title: 'Let\'s Create Animation',
              duration: '20 mins',
              isLocked: true
            },
            {
              id: '9',
              number: '09',
              title: 'Sharing Work with Team',
              duration: '8 mins',
              isLocked: true
            },
            {
              id: '10',
              number: '10',
              title: 'Exporting 3D Assets',
              duration: '12 mins',
              isLocked: true
            }
          ]
        }
      ],
    }
  },
  {
    id: '2',
    title: 'Digital Entrepreneurship',
    category: 'Entrepreneurship',
    difficulty: 'Advanced',
    image: { uri: 'https://picsum.photos/400/300?random=7' },
    price: '39',
    rating: '4.9',
    students: '6,182',
    isBookmarked: false,
    reviews: '4,479',
    duration: '2,5',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    tools:[
      {
        title:"Figma",
        image: require('../assets/images/figma_icon.png')
      }
    ],
    instructor: {
      id: '1',
      name: 'Jacob Kulikowski',
      role: 'Marketing Analyst',
      image: { uri: 'https://picsum.photos/200?random=1' }
    },
    lessons: {
      sections: [
        {
          id: '1',
          title: 'Section 1 - Intro to Entrepreneurship',
          totalDuration: '20 mins',
          lessons: [
            {
              id: '1',
              number: '01',
              title: 'What is Digital Entrepreneurship',
              duration: '12 mins',
              isLocked: false
            },
            {
              id: '2',
              number: '02',
              title: 'Market Research Basics',
              duration: '8 mins',
              isLocked: true
            }
          ]
        },
        {
          id: '2',
          title: 'Section 2 - Business Planning',
          totalDuration: '50 mins',
          lessons: [
            {
              id: '3',
              number: '03',
              title: 'Creating a Business Plan',
              duration: '15 mins',
              isLocked: true
            },
            {
              id: '4',
              number: '04',
              title: 'Financial Planning',
              duration: '18 mins',
              isLocked: true
            },
            {
              id: '5',
              number: '05',
              title: 'Market Strategy',
              duration: '17 mins',
              isLocked: true
            }
          ]
        },
        {
          id: '3',
          title: 'Section 3 - Growth Strategy',
          totalDuration: '65 mins',
          lessons: [
            {
              id: '6',
              number: '06',
              title: 'Digital Marketing',
              duration: '22 mins',
              isLocked: true
            },
            {
              id: '7',
              number: '07',
              title: 'Scaling Your Business',
              duration: '25 mins',
              isLocked: true
            },
            {
              id: '8',
              number: '08',
              title: 'Funding Options',
              duration: '18 mins',
              isLocked: true
            }
          ]
        }
      ],
    }
  },
  {
    id: '3',
    title: 'Intro to UI/UX Design',
    category: 'UI/UX Design',
    difficulty: 'Beginner',
    image: { uri: 'https://picsum.photos/400/300?random=8' },
    price: '42',
    originalPrice: '75',
    rating: '4.7',
    students: '7,938',
    isBookmarked: true,
    reviews: '4,479',
    duration: '2,5',
    tools:[
    {
      title:"Figma",
      image: require('../assets/images/figma_icon.png')
    }
    ],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    instructor: {
      id: '1',
      name: 'Jacob Kulikowski',
      role: 'Marketing Analyst',
      image: { uri: 'https://picsum.photos/200?random=1' }
    },
    lessons: {
      sections: [
        {
          id: '1',
          title: 'Section 1 - Introduction',
          totalDuration: '15 mins',
          lessons: [
            {
              id: '1',
              number: '01',
              title: 'Why Using Figma',
              duration: '10 mins',
              isLocked: false
            },
            {
              id: '2',
              number: '02',
              title: 'Set up Your Figma Account',
              duration: '5 mins',
              isLocked: true
            }
          ]
        },
        {
          id: '2',
          title: 'Section 2 - Figma Basic',
          totalDuration: '60 mins',
          lessons: [
            {
              id: '3',
              number: '03',
              title: 'Take a Look Figma Interface',
              duration: '15 mins',
              isLocked: true
            },
            {
              id: '4',
              number: '04',
              title: 'Working with Frame & Layer',
              duration: '10 mins',
              isLocked: true
            },
            {
              id: '5',
              number: '05',
              title: 'Working with Text & Grids',
              duration: '10 mins',
              isLocked: true
            },
            {
              id: '6',
              number: '06',
              title: 'Using Figma Plugins',
              duration: '25 mins',
              isLocked: true
            }
          ]
        },
        {
          id: '3',
          title: 'Section 3 - Let\'s Practice',
          totalDuration: '75 mins',
          lessons: [
            {
              id: '7',
              number: '07',
              title: 'Let\'s Design a Sign-Up Form',
              duration: '35 mins',
              isLocked: true
            },
            {
              id: '8',
              number: '08',
              title: 'Let\'s Create a Prototype',
              duration: '20 mins',
              isLocked: true
            },
            {
              id: '9',
              number: '09',
              title: 'Sharing Work with Team',
              duration: '8 mins',
              isLocked: true
            },
            {
              id: '10',
              number: '10',
              title: 'Exporting Assets',
              duration: '12 mins',
              isLocked: true
            }
          ]
        }
      ],
    }
  },
];

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const { isBookmarked, toggleBookmark } = useBookmark();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [courses, setCourses] = useState(COURSES);

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
        <TouchableOpacity 
          style={styles.searchContainer}
          onPress={() => navigation.navigate('Search')}
        >
          <View style={styles.searchInput}>
            <Ionicons
              name="search-outline"
              size={24}
              color={COLORS.text.lightGray}
            />
            <Text style={styles.searchPlaceholder}>Search</Text>
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => navigation.navigate('AdvancedSearch')}
          >
            <Ionicons
              name="options-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Special Offer */}
        <SpecialOfferCard />

        {/* Top Mentors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Mentors</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TopMentors')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mentorsContainer}
          >
            {MENTORS.map((mentor) => (
              <TouchableOpacity 
                key={mentor.id}
                onPress={() => navigation.navigate('MentorProfile')}
              >
                <View style={styles.mentorItem}>
                  <Avatar source={mentor.image} size={64} />
                  <Text style={styles.mentorName}>{mentor.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Most Popular Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Most Popular Courses</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PopularCourses',{courses})}>
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
          {filteredCourses.map(( course) => (
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