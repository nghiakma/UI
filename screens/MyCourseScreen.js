import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

// Utility function to parse duration string (e.g., "45 mins") to minutes
const parseDuration = (durationString) => {
  // Check if durationString is just a number
  if (/^\d+$/.test(durationString)) {
    return parseInt(durationString);
  }
  
  const minutesMatch = durationString.match(/(\d+)\s*mins/);
  const hoursMatch = durationString.match(/(\d+)\s*hrs/);
  
  let totalMinutes = 0;
  if (minutesMatch) totalMinutes += parseInt(minutesMatch[1]);
  if (hoursMatch) totalMinutes += parseInt(hoursMatch[1]) * 60;
  
  return totalMinutes;
};

// Utility function to format minutes to readable duration
const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}${remainingMinutes > 0 ? `,${remainingMinutes}` : ''}`;
  }
};

// Utility function to calculate total duration from sections
const calculateTotalDuration = (sections) => {
  if (!sections || sections.length === 0) return 0;
  
  let totalMinutes = 0;
  sections.forEach(section => {
    totalMinutes += parseDuration(section.totalDuration);
  });
  
  return totalMinutes;
};

// Sample data for ongoing courses
const ONGOING_COURSES = [
  {
    id: '1',
    title: 'Intro to UI/UX Design',
    image: { uri: 'https://picsum.photos/200/300?random=1' },
    progress: 75,
    completedLessons: 93,
    totalLessons: 124,
    color: '#FF4D67',
    category: 'UI/UX Design',
    price: '40',
    isCertificate: false,
    originalPrice: '75',
    rating: '4.8',
    reviews: '4,479',
    students: '9,839',
    instructor: {
      name: 'Jonathan Williams',
      role: 'Senior UI/UX Designer at Google',
      image: { uri: 'https://picsum.photos/200?random=10' }
    },
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    tools: [
      { title: 'Figma', image: require('../assets/images/figma.png') },
      { title: 'Photoshop', image: require('../assets/images/photoshop.png') },
    ],
    lessons: {
      totalCount: 124,
      sections: [
        {
          id: 's1',
          title: 'Introduction',
          totalDuration: '45',
          lessons: [
            { id: 'l1', number: '01', title: 'Welcome to the Course', duration: '15', isLocked: false },
            { id: 'l2', number: '02', title: 'What is UI/UX Design', duration: '20', isLocked: false },
            { id: 'l3', number: '03', title: 'Tools Overview', duration: '10', isLocked: false },
          ]
        },
        {
          id: 's2',
          title: 'User Interface Basics',
          totalDuration: '90',
          lessons: [
            { id: 'l4', number: '04', title: 'Visual Design Principles', duration: '25', isLocked: false },
            { id: 'l5', number: '05', title: 'Color Theory', duration: '30', isLocked: false },
            { id: 'l6', number: '06', title: 'Typography', duration: '20', isLocked: true },
            { id: 'l7', number: '07', title: 'Layout and Composition', duration: '15', isLocked: true },
          ]
        }
      ]
    },
    get duration() {
      return formatDuration(calculateTotalDuration(this.lessons.sections));
    }
  },
  {
    id: '2',
    title: 'Wordpress Website Development',
    image: { uri: 'https://picsum.photos/200/300?random=2' },
    progress: 50,
    completedLessons: 73,
    totalLessons: 146,
    color: '#FACC15',
    category: 'Web Development',
    price: '35',
    isCertificate: false,
    originalPrice: '65',
    rating: '4.6',
    reviews: '3,245',
    students: '8,567',
    instructor: {
      name: 'Sarah Johnson',
      role: 'WordPress Expert & Web Developer',
      image: { uri: 'https://picsum.photos/200?random=11' }
    },
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    tools: [
      { title: 'WordPress', image: require('../assets/images/figma.png') },
      { title: 'Elementor', image: require('../assets/images/photoshop.png') },
    ],
    lessons: {
      totalCount: 146,
      sections: [
        {
          id: 's1',
          title: 'Getting Started',
          totalDuration: '60',
          lessons: [
            { id: 'l1', number: '01', title: 'Introduction to WordPress', duration: '20', isLocked: false },
            { id: 'l2', number: '02', title: 'Setting Up Your Environment', duration: '25', isLocked: false },
            { id: 'l3', number: '03', title: 'WordPress Dashboard Overview', duration: '15', isLocked: false },
          ]
        },
        {
          id: 's2',
          title: 'Building Your Website',
          totalDuration: '105',
          lessons: [
            { id: 'l4', number: '04', title: 'Choosing and Installing a Theme', duration: '30', isLocked: false },
            { id: 'l5', number: '05', title: 'Working with Pages and Posts', duration: '25', isLocked: false },
            { id: 'l6', number: '06', title: 'Essential Plugins', duration: '30', isLocked: true },
            { id: 'l7', number: '07', title: 'Customizing Your Site', duration: '20', isLocked: true },
          ]
        }
      ]
    },
    get duration() {
      return formatDuration(calculateTotalDuration(this.lessons.sections));
    }
  },
  {
    id: '3',
    title: '3D Blender and UI/UX',
    image: { uri: 'https://picsum.photos/200/300?random=3' },
    progress: 25,
    completedLessons: 30,
    totalLessons: 119,
    color: '#22BB9C',
    category: '3D Design',
    price: '45',
    isCertificate: false,
    originalPrice: '80',
    rating: '4.7',
    reviews: '2,835',
    students: '6,429',
    instructor: {
      name: 'Michael Chen',
      role: '3D Designer & UI/UX Specialist',
      image: { uri: 'https://picsum.photos/200?random=12' }
    },
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    tools: [
      { title: 'Blender', image: require('../assets/images/figma.png') },
      { title: 'Figma', image: require('../assets/images/figma.png') },
    ],
    lessons: {
      totalCount: 119,
      sections: [
        {
          id: 's1',
          title: '3D Basics',
          totalDuration: '90',
          lessons: [
            { id: 'l1', number: '01', title: 'Introduction to 3D Design', duration: '25', isLocked: false },
            { id: 'l2', number: '02', title: 'Blender Interface Overview', duration: '35', isLocked: false },
            { id: 'l3', number: '03', title: 'Basic Modeling Techniques', duration: '30', isLocked: false },
          ]
        },
        {
          id: 's2',
          title: 'UI/UX Integration',
          totalDuration: '75',
          lessons: [
            { id: 'l4', number: '04', title: 'From 3D to UI Design', duration: '25', isLocked: false },
            { id: 'l5', number: '05', title: '3D Elements in User Interfaces', duration: '30', isLocked: true },
            { id: 'l6', number: '06', title: 'Practical Applications', duration: '20', isLocked: true },
          ]
        }
      ]
    },
    get duration() {
      return formatDuration(calculateTotalDuration(this.lessons.sections));
    }
  },
  {
    id: '4',
    title: 'Learn UX User Persona',
    image: { uri: 'https://picsum.photos/200/300?random=4' },
    progress: 60,
    completedLessons: 82,
    totalLessons: 137,
    color: '#FB9400',
    category: 'UX Research',
    price: '30',
    isCertificate: false,
    originalPrice: '60',
    rating: '4.9',
    reviews: '3,562',
    students: '7,821',
    instructor: {
      name: 'Emily Rodriguez',
      role: 'UX Research Lead at Microsoft',
      image: { uri: 'https://picsum.photos/200?random=13' }
    },
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    tools: [
      { title: 'Figma', image: require('../assets/images/figma.png') },
      { title: 'Miro', image: require('../assets/images/photoshop.png') },
    ],
    lessons: {
      totalCount: 137,
      sections: [
        {
          id: 's1',
          title: 'Understanding User Personas',
          totalDuration: '85',
          lessons: [
            { id: 'l1', number: '01', title: 'What is a User Persona', duration: '20', isLocked: false },
            { id: 'l2', number: '02', title: 'User Research Fundamentals', duration: '35', isLocked: false },
            { id: 'l3', number: '03', title: 'Data Collection Methods', duration: '30', isLocked: false },
          ]
        },
        {
          id: 's2',
          title: 'Creating Effective Personas',
          totalDuration: '95',
          lessons: [
            { id: 'l4', number: '04', title: 'Persona Template Development', duration: '25', isLocked: false },
            { id: 'l5', number: '05', title: 'User Goals and Frustrations', duration: '30', isLocked: false },
            { id: 'l6', number: '06', title: 'Bringing Personas to Life', duration: '20', isLocked: true },
            { id: 'l7', number: '07', title: 'Using Personas in Design Process', duration: '20', isLocked: true },
          ]
        }
      ]
    },
    get duration() {
      return formatDuration(calculateTotalDuration(this.lessons.sections));
    }
  },
];

// Sample data for completed courses
const COMPLETED_COURSES = [
  {
    id: '5',
    title: 'Advanced UI/UX Design',
    image: { uri: 'https://picsum.photos/200/300?random=5' },
    progress: 100,
    completedLessons: 150,
    totalLessons: 150,
    color: '#335EF7',
    category: 'UI/UX Design',
    price: '50',
    isCertificate: true,
    originalPrice: '90',
    rating: '4.9',
    reviews: '5,247',
    students: '10,536',
    instructor: {
      name: 'Alexandra Lewis',
      role: 'Design Lead at Apple',
      image: { uri: 'https://picsum.photos/200?random=14' }
    },
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    tools: [
      { title: 'Figma', image: require('../assets/images/figma.png') },
      { title: 'Sketch', image: require('../assets/images/photoshop.png') },
    ],
    lessons: {
      totalCount: 150,
      sections: [
        {
          id: 's1',
          title: 'Advanced UI Concepts',
          totalDuration: '105',
          lessons: [
            { id: 'l1', number: '01', title: 'Design Systems at Scale', duration: '35', isLocked: false },
            { id: 'l2', number: '02', title: 'Component-Based Design', duration: '40', isLocked: false },
            { id: 'l3', number: '03', title: 'Visual Hierarchy Mastery', duration: '30', isLocked: false },
          ]
        },
        {
          id: 's2',
          title: 'UX Strategy',
          totalDuration: '95',
          lessons: [
            { id: 'l4', number: '04', title: 'User Journey Mapping', duration: '25', isLocked: false },
            { id: 'l5', number: '05', title: 'Usability Testing Methods', duration: '30', isLocked: false },
            { id: 'l6', number: '06', title: 'Measuring Design Impact', duration: '40', isLocked: false },
          ]
        }
      ]
    },
    get duration() {
      return formatDuration(calculateTotalDuration(this.lessons.sections));
    }
  },
  {
    id: '6',
    title: 'Mobile App Development',
    image: { uri: 'https://picsum.photos/200/300?random=6' },
    progress: 100,
    completedLessons: 132,
    totalLessons: 132,
    color: '#FF4D67',
    category: 'App Development',
    price: '60',
    isCertificate: true,
    originalPrice: '110',
    rating: '4.8',
    reviews: '4,863',
    students: '9,274',
    instructor: {
      name: 'Daniel Park',
      role: 'Senior Mobile Developer at Uber',
      image: { uri: 'https://picsum.photos/200?random=15' }
    },
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    tools: [
      { title: 'React Native', image: require('../assets/images/figma.png') },
      { title: 'Firebase', image: require('../assets/images/photoshop.png') },
    ],
    lessons: {
      totalCount: 132,
      sections: [
        {
          id: 's1',
          title: 'React Native Fundamentals',
          totalDuration: '120',
          lessons: [
            { id: 'l1', number: '01', title: 'Setting Up Your Environment', duration: '30', isLocked: false },
            { id: 'l2', number: '02', title: 'Component Structure', duration: '45', isLocked: false },
            { id: 'l3', number: '03', title: 'State Management', duration: '45', isLocked: false },
          ]
        },
        {
          id: 's2',
          title: 'Building Real Apps',
          totalDuration: '165',
          lessons: [
            { id: 'l4', number: '04', title: 'Navigation Systems', duration: '40', isLocked: false },
            { id: 'l5', number: '05', title: 'API Integration', duration: '45', isLocked: false },
            { id: 'l6', number: '06', title: 'Authentication Flow', duration: '40', isLocked: false },
            { id: 'l7', number: '07', title: 'Publishing Your App', duration: '40', isLocked: false },
          ]
        }
      ]
    },
    get duration() {
      return formatDuration(calculateTotalDuration(this.lessons.sections));
    }
  }
];

const CourseCard = ({ course }) => {
  // Calculate width of progress bar based on percentage
  const progressWidth = `${course.progress}%`;

  return (
    <View style={styles.courseCard}>
      <View style={styles.courseImageContainer}>
        <Image source={course.image} style={styles.courseImage} />
      </View>
      <View style={styles.courseDetails}>
        <Text style={styles.courseTitle} numberOfLines={1}>{course.title}</Text>
        <Text style={styles.courseDuration}>{course.duration} Hours</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBar, 
                { width: progressWidth, backgroundColor: course.color }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{course.completedLessons} / {course.totalLessons}</Text>
        </View>
      </View>
    </View>
  );
};

const MyCourseScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Ongoing');
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.headerTitle}>My Courses</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('SearchScreen')}
          >
            <Ionicons name="search-outline" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => {}}
          >
            <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Ongoing' && styles.activeTab]}
          onPress={() => setActiveTab('Ongoing')}
        >
          <Text style={[styles.tabText, activeTab === 'Ongoing' && styles.activeTabText]}>Ongoing</Text>
          {activeTab === 'Ongoing' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}
          onPress={() => setActiveTab('Completed')}
        >
          <Text style={[styles.tabText, activeTab === 'Completed' && styles.activeTabText]}>Completed</Text>
          {activeTab === 'Completed' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>
      
      {/* Course List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.courseListContainer}
      >
        {activeTab === 'Ongoing' ? (
          ONGOING_COURSES.map(course => (
            <TouchableOpacity 
              key={course.id} 
              onPress={() => navigation.navigate('CourseDetailsScreen', { course })}
            >
              <CourseCard course={course} />
            </TouchableOpacity>
          ))
        ) : (
          COMPLETED_COURSES.map(course => (
            <TouchableOpacity 
              key={course.id} 
              onPress={() => navigation.navigate('CourseDetailsScreen', { course })}
            >
              <CourseCard course={course} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
    marginTop: 40
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md,
    paddingTop: SPACING.xxxl,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  logoContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 24,
    color: COLORS.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xxxl,
    marginTop: SPACING.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    paddingVertical: SPACING.md,
  },
  activeTab: {},
  tabText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 18,
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
    width: 24,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  courseListContainer: {
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.xl,
    gap: SPACING.xl,
  },
  courseCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    flexDirection: 'row',
    padding: SPACING.xl,
    gap: SPACING.xl,
    ...SHADOWS.xl,
  },
  courseImageContainer: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: '100%',
  },
  courseDetails: {
    marginTop: 10,
    flex: 1,
    gap: SPACING.lg,
  },
  courseTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 18,
    color: COLORS.text.primary,
  },
  courseDuration: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 14,
    letterSpacing: 0.2,
    color: COLORS.text.gray,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.background.gray,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
  },
  progressText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 12,
    color: COLORS.text.gray,
  },
});

export default MyCourseScreen; 