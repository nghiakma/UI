import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Modal,
  Dimensions,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import Avatar from '../components/Avatar';
import ReviewItem from '../components/ReviewItem';
import Tag from '../components/Tag';
import { useBookmark } from '../context/BookmarkContext';
import { ResizeMode } from 'expo-av';
import RemoveBookmarkSheet from '../components/RemoveBookmarkSheet';
const { width, height } = Dimensions.get('window');

// Danh sách các video mẫu đáng tin cậy
const SAMPLE_VIDEOS = [
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
];

// Demo data for course reviews
export const COURSE_REVIEWS = [
  {
    id: '1',
    name: 'Jenny Wilson',
    avatar: { uri: 'https://picsum.photos/200?random=10' },
    rating: 5,
    date: '2 days ago',
    review: 'The explanation is concise and complete, easy to understand and the voice is very pleasant to listen to. The way the course is structured makes this a easy course to follow.'
  },
  {
    id: '2',
    name: 'Guy Hawkins',
    avatar: { uri: 'https://picsum.photos/200?random=11' },
    rating: 4,
    date: '1 week ago',
    review: 'Very interesting and engaging course. I learned a lot about design principles and how to apply them in real-world projects.'
  },
  {
    id: '3',
    name: 'Brooklyn Simmons',
    avatar: { uri: 'https://picsum.photos/200?random=12' },
    rating: 5,
    date: '3 weeks ago',
    review: 'Amazing content, well structured, and the instructor explains complex concepts in an easy to understand way.'
  },
  {
    id: '4',
    name: 'Esther Howard',
    avatar: { uri: 'https://picsum.photos/200?random=13' },
    rating: 3,
    date: '1 month ago',
    review: 'Good course but could use more practical examples. The theoretical concepts are well explained though.'
  },
];

// Review Item Component


// Function to calculate total duration for a section
const calculateTotalDuration = (lessons) => {
  return lessons.reduce((total, lesson) => {
    const minutes = parseInt(lesson.duration.split(' ')[0]);
    return total + minutes;
  }, 0) + ' mins';
};

// Function to calculate total number of lessons in a course
const calculateTotalLessons = (sections) => {
  if (!sections) return 0;
  
  return sections.reduce((total, section) => {
    return total + (section.lessons ? section.lessons.length : 0);
  }, 0);
};

const CourseDetailsScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('About');
  const [videoVisible, setVideoVisible] = useState(false);
  const [videoStatus, setVideoStatus] = useState({});
  const [videoError, setVideoError] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmark();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [reviews, setReviews] = useState(COURSE_REVIEWS);
  const [certificateAlertShown, setCertificateAlertShown] = useState(false);
  const [certificateModalVisible, setCertificateModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

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
  // Get course data from route params
  const { course } = route.params || { 
    // Default fallback data if no params passed
    course: {
      id: '1',
      title: 'Intro to UI/UX Design',
      category: 'UI/UX Design',
      image: { uri: 'https://picsum.photos/400/300?random=6' },
      price: '40',
      originalPrice: '75',
      rating: '4.8',
      reviews: '4,479',
      students: '9,839',
      duration: '2,5',
      instructor: {
        name: 'Jonathan Williams',
        role: 'Senior UI/UX Designer at Google',
        image: { uri: 'https://picsum.photos/200?random=1' }
      },
      // Thêm URL video mẫu HTTP (không HTTPS)
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      isCertificate: true,
    }
  };

  // Check for certificate and show notification when screen mounts
  useEffect(() => {
    if (course.isCertificate && !certificateAlertShown) {
      setCertificateModalVisible(true);
      
      // Start animations
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
      
      setCertificateAlertShown(true);
    }
  }, [course.isCertificate, certificateAlertShown, navigation]);

  const handleViewCertificate = () => {
    setCertificateModalVisible(false);
    navigation.navigate('CertificateScreen', { course });
  };

  const handleCertificateLater = () => {
    setCertificateModalVisible(false);
  };

  // Kiểm tra nếu khóa học không có URL video, sử dụng URL mẫu
  useEffect(() => {
    if (!course.videoUrl) {
      course.videoUrl = SAMPLE_VIDEOS[0];
    }
    setCurrentVideoUrl(course.videoUrl);
    console.log("Setting video URL:", course.videoUrl);
  }, []);

  const handlePlayPress = async () => {
    // Thử dùng video đầu tiên từ danh sách SAMPLE_VIDEOS
    setCurrentVideoUrl(SAMPLE_VIDEOS[0]);
    setVideoVisible(true);
    setVideoError(false);
    
    console.log("Play button pressed, playing video from:", SAMPLE_VIDEOS[0]);
  };

  const handleCloseVideo = async () => {
    try {
      if (videoRef.current) {
        // Dừng và unload video khi đóng
        await videoRef.current.pauseAsync();
      }
      
      // Reset orientation về portrait khi đóng video
      if (isFullscreen) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error stopping video or resetting orientation: ', error);
    }
    setVideoVisible(false);
    setVideoError(false);
  };

  // Xử lý khi trạng thái video thay đổi
  const onPlaybackStatusUpdate = (status) => {
    setVideoStatus(status);
    if (status.didJustFinish) {
      handleCloseVideo();
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (isFullscreen) {
        // Quay lại chế độ portrait
        console.log("Switching to portrait mode");
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        setIsFullscreen(false);
      } else {
        // Chuyển sang chế độ landscape
        console.log("Switching to landscape mode and making video fullscreen");
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error("Error changing screen orientation:", error);
      Alert.alert(
        "Lỗi xoay màn hình",
        "Không thể xoay màn hình. Vui lòng thử lại sau.",
        [{ text: "OK" }]
      );
    }
  };

  const getVideoStyles = () => {
    // Lấy kích thước hiện tại của màn hình để đảm bảo giá trị mới nhất
    const currentDimensions = Dimensions.get('window');
    
    if (isFullscreen) {
      // Trong chế độ landscape, đổi chiều dài và chiều rộng
      return {
        width: currentDimensions.width,
        height: currentDimensions.height,
      };
    } else {
      return {
        width: currentDimensions.width * 0.9,
        height: currentDimensions.width * 0.9 * 9/16, // Tỉ lệ 16:9
      };
    }
  };
  
  // Thêm listener để lắng nghe sự thay đổi kích thước màn hình
  useEffect(() => {
    const updateLayout = () => {
      // Force re-render khi kích thước màn hình thay đổi
      setIsFullscreen(prev => {
        if (prev) {
          // Nếu đang ở chế độ fullscreen, đảm bảo vẫn giữ chế độ đó
          return prev;
        }
        return prev;
      });
    };
    
    // Trong phiên bản mới của React Native, addEventListener trả về một subscription
    const subscription = Dimensions.addEventListener('change', updateLayout);
    
    return () => {
      // Cleanup subscription khi component unmount
      subscription.remove();
    };
  }, []);

  // Calculate section durations
  useEffect(() => {
    if (course.lessons && course.lessons.sections) {
      course.lessons.sections.forEach(section => {
        if (section.lessons && section.lessons.length > 0) {
          section.totalDuration = calculateTotalDuration(section.lessons);
        }
      });
    }
  }, [course]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Course Image with Play Button */}
        <View style={styles.courseImageContainer}>
          <ImageBackground
            source={course.image || require('../assets/images/course_image_1.jpg')}
            style={styles.courseImage}
            resizeMode="cover"
          >
            {/* Play Button */}
            <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
              <Ionicons name="play" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Course Header */}
          <View style={styles.courseHeaderContainer}>
            {/* Title and Bookmark */}
            <View style={styles.titleRow}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <TouchableOpacity onPress={() => handleBookmarkPress(course.id)}>
                <Ionicons 
                  name={isBookmarked(course.id) ? "bookmark" : "bookmark-outline"} 
                  size={24} 
                  color={COLORS.primary} 
                />
              </TouchableOpacity>
            </View>

            {/* Category and Rating */}
            <View style={styles.infoRow}>
              <Tag label={course.category} style={styles.categoryTag} />
              <View style={styles.ratingContainer}>
                <View style={styles.starIcon}>
                  <Ionicons name="star" size={16} color={COLORS.secondary} />
                </View>
                <Text style={styles.ratingText}>{course.rating} ({course.reviews || course.students} reviews)</Text>
              </View>
            </View>

            {/* Price */}
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${course.price}</Text>
              {course.originalPrice && (
                <Text style={styles.originalPrice}>${course.originalPrice}</Text>
              )}
            </View>

            {/* Course Stats */}
            <View style={styles.statsContainer}>
              {/* Students */}
              <View style={styles.statItem}>
                <Ionicons name="people" size={18} color={COLORS.primary} />
                <Text style={styles.statText}>{course.students} Students</Text>
              </View>

              {/* Duration */}
              <View style={styles.statItem}>
                <Ionicons name="time" size={18} color={COLORS.primary} />
                <Text style={styles.statText}>{course.duration || '2,5'} Hours</Text>
              </View>

              {/* Certificate */}
              <TouchableOpacity 
                style={styles.statItem}
                onPress={() => course.isCertificate && navigation.navigate('CertificateScreen', { course })}
              >
                <Ionicons 
                  name="document-text" 
                  size={18} 
                  color={course.isCertificate ? '#FF0000' : COLORS.primary} 
                />
                <Text style={[
                  styles.statText, 
                  course.isCertificate && { color: '#FF0000', fontFamily: FONTS.urbanist.bold }
                ]}>Certificate</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'About' && styles.activeTab]} 
              onPress={() => setActiveTab('About')}
            >
              <Text style={[styles.tabText, activeTab === 'About' && styles.activeTabText]}>About</Text>
              {activeTab === 'About' && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'Lessons' && styles.activeTab]} 
              onPress={() => setActiveTab('Lessons')}
            >
              <Text style={[styles.tabText, activeTab === 'Lessons' && styles.activeTabText]}>Lessons</Text>
              {activeTab === 'Lessons' && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'Reviews' && styles.activeTab]} 
              onPress={() => setActiveTab('Reviews')}
            >
              <Text style={[styles.tabText, activeTab === 'Reviews' && styles.activeTabText]}>Reviews</Text>
              {activeTab === 'Reviews' && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'About' && (
              <>
                {/* Mentor Section */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Mentor</Text>
                  <View style={styles.mentorCard}>
                    <View style={styles.mentorInfo}>
                      <Avatar 
                        source={course.instructor?.image || require('../assets/images/mentor_avatar.jpg')} 
                        size={56} 
                      />
                      <View style={styles.mentorDetails}>
                        <Text style={styles.mentorName}>{course.instructor?.name || 'Jonathan Williams'}</Text>
                        <Text style={styles.mentorRole}>{course.instructor?.role || 'Senior UI/UX Designer at Google'}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.chatButton}>
                      <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* About Course Section */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>About Course</Text>
                  <Text style={styles.descriptionText}>
                    {course.description || `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                    \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip. Read more...`}
                  </Text>
                </View>

                {/* Tools Section */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Tools</Text>
                  <View style={styles.toolsContainer}>
                    {course.tools.map((tool, index) => (
                      <View key={index} style={styles.toolItem}>
                        <View style={styles.figmaIcon}>
                          <Image source={tool.image} />
                        </View>
                        <Text style={styles.toolName}>{tool.title}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}

            {activeTab === 'Lessons' && (
              <View style={styles.lessonsTabContent}>
                <View style={styles.lessonsHeader}>
                  <Text style={styles.lessonCount}>{course.lessons?.totalCount || calculateTotalLessons(course.lessons?.sections)} Lessons</Text>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('AllLessons', { course })}
                    style={styles.seeAllButton}
                  >
                    <Text style={styles.seeAllButtonText}>See All</Text>
                  </TouchableOpacity>
                </View>
                
                {course.lessons?.sections?.map((section) => (
                  <View key={section.id} style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>{section.title}</Text>
                      <Text style={styles.sectionDuration}>{section.totalDuration}</Text>
                    </View>
                    
                    {section.lessons.map((lesson) => (
                      <View key={lesson.id} style={styles.lessonCard}>
                        <View style={styles.lessonNumberContainer}>
                          <Text style={styles.lessonNumber}>{lesson.number}</Text>
                        </View>
                        <View style={styles.lessonDetails}>
                          <Text style={styles.lessonTitle}>{lesson.title}</Text>
                          <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                        </View>
                        <TouchableOpacity style={styles.lessonActionButton}>
                          <Ionicons 
                            name={lesson.isLocked ? "lock-closed-outline" : "play"} 
                            size={20} 
                            color={lesson.isLocked ? COLORS.text.lightGray : COLORS.primary} 
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ))}
                
                {!course.lessons && (
                  <View style={styles.comingSoonContainer}>
                    <Text style={styles.comingSoonText}>Lessons content coming soon</Text>
                  </View>
                )}
              </View>
            )}

            {activeTab === 'Reviews' && (
              <View style={styles.reviewsContainer}>
                {/* Reviews Stats */}
                <View style={styles.reviewStats}>
                  <View style={styles.reviewRatingContainer}>
                    <Text style={styles.averageRating}>
                      {(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)}
                    </Text>
                    <View style={styles.starsContainer}>
                      {[...Array(5)].map((_, i) => {
                        const rating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
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
                      const count = reviews.filter(review => review.rating === star).length;
                      const percentage = (count / reviews.length) * 100;
                      
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
                    <TouchableOpacity onPress={() => navigation.navigate('CourseReviews', { reviews, courseId: course.id, courseTitle: course.title })}>
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
            )}
          </View>
        </View>
      </ScrollView>

      {/* Video Modal */}
      <Modal
        visible={videoVisible}
        onRequestClose={handleCloseVideo}
        animationType="fade"
        transparent={false}
        statusBarTranslucent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.videoContainer}>
            {!videoError && (
              <Video
                ref={videoRef}
                style={getVideoStyles()}
                source={{ uri: currentVideoUrl }}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                shouldPlay={true}
                isLooping={false}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                onLoad={() => console.log("Video loaded successfully")}
                onError={(error) => {
                  console.log("Video error: ", error);
                  setVideoError(true);
                  
                  // Thử URL khác nếu lỗi
                  const nextVideoIndex = SAMPLE_VIDEOS.indexOf(currentVideoUrl) + 1;
                  if (nextVideoIndex < SAMPLE_VIDEOS.length) {
                    const nextUrl = SAMPLE_VIDEOS[nextVideoIndex];
                    console.log("Trying next video URL:", nextUrl);
                    setCurrentVideoUrl(nextUrl);
                    setVideoError(false);
                  } else {
                    Alert.alert(
                      "Lỗi phát video",
                      "Không thể phát video. Vui lòng thử lại sau.",
                      [{ text: "OK", onPress: () => setVideoVisible(false) }]
                    );
                  }
                }}
              />
            )}
            
            {videoError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Không thể phát video</Text>
              </View>
            )}
            
            {/* Thêm hiển thị trạng thái tải video */}
            {videoStatus.isBuffering && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Đang tải video...</Text>
              </View>
            )}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseVideo}
            >
              <Ionicons name="close-circle" size={32} color={COLORS.white} />
            </TouchableOpacity>
            
            {/* Nút xoay màn hình */}
            <TouchableOpacity
              style={styles.rotateButton}
              onPress={toggleFullscreen}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={isFullscreen ? "phone-portrait" : "phone-landscape"} 
                size={32} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Enroll Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.enrollButton}>
          <Text style={styles.enrollButtonText}>Enroll Course - ${course.price}</Text>
        </TouchableOpacity>
      </View>
      <RemoveBookmarkSheet
        visible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        onConfirm={handleConfirmRemove}
      />

      {/* Certificate Modal */}
      <Modal
        visible={certificateModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCertificateModalVisible(false)}
      >
        <View style={styles.certificateModalOverlay}>
          <Animated.View 
            style={[
              styles.certificateModalContainer,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim
              }
            ]}
          >
            <View style={styles.certificateIconContainer}>
              <Ionicons name="document-text" size={40} color="#FF0000" />
            </View>
            
            <Text style={styles.certificateModalTitle}>Certificate Available!</Text>
            
            <Text style={styles.certificateModalText}>
              Congratulations! You are eligible to receive a certificate for completing this course.
            </Text>
            
            <View style={styles.certificateModalButtons}>
              <TouchableOpacity 
                style={styles.certificateModalLaterButton} 
                onPress={handleCertificateLater}
              >
                <Text style={styles.certificateModalLaterText}>Later</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.certificateModalViewButton} 
                onPress={handleViewCertificate}
              >
                <Text style={styles.certificateModalViewText}>View Certificate</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  courseImageContainer: {
    width: '100%',
    height: 300,
  },
  courseImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(8px)',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xxxl,
    paddingTop: SPACING.xxxl,
    paddingBottom: 100, // Space for bottom button
  },
  courseHeaderContainer: {
    gap: SPACING.xl,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 32,
    lineHeight: 38,
    color: COLORS.text.primary,
    flex: 1,
    marginRight: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  categoryTag: {
    backgroundColor: COLORS.background.lightBlue,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: BORDER_RADIUS.small,
  },
  categoryTagText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.xs,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  starIcon: {
    flexDirection: 'row',
  },
  ratingText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md,
    lineHeight: SIZES.md * 1.4,
    letterSpacing: 0.2,
    color: COLORS.text.secondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  price: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 20,
    color: COLORS.primary,
  },
  originalPrice: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 20,
    color: COLORS.text.lightGray,
    textDecorationLine: 'line-through',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md,
    lineHeight: SIZES.md * 1.4,
    letterSpacing: 0.2,
    color: COLORS.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border.gray,
    marginTop: SPACING.xxxl,
    marginBottom: SPACING.xl,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxxl,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    paddingBottom: SPACING.lg,
  },
  tabText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 18,
    lineHeight: 25,
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
  tabContent: {
    gap: SPACING.xxxl,
  },
  sectionContainer: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 16,
    color: COLORS.text.gray,
  },
  sectionDuration: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 14,
    color: COLORS.primary,
  },
  mentorCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mentorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  mentorDetails: {
    gap: 4,
  },
  mentorName: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 18,
    lineHeight: 22,
    color: COLORS.text.primary,
  },
  mentorRole: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.2,
    color: COLORS.text.gray,
  },
  chatButton: {
    padding: SPACING.sm,
  },
  descriptionText: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.2,
    color: COLORS.text.secondary,
  },
  toolsContainer:{
    marginBottom: 20
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  figmaIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolIcon: {
    width: 24,
    height: 24,
  },
  toolName: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
    color: COLORS.text.primary,
  },
  comingSoonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  comingSoonText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 16,
    color: COLORS.text.lightGray,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.gray,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.xxxl,
    paddingBottom: 36,
    ...SHADOWS.medium,
  },
  enrollButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  enrollButtonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
    color: COLORS.white,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  loadingContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.medium,
  },
  loadingText: {
    color: COLORS.white,
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.lg,
  },
  errorContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.medium,
  },
  errorText: {
    color: COLORS.white,
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.lg,
  },
  rotateButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: 'rgba(0, 82, 204, 0.8)',
    borderRadius: 30,
    padding: 15,
    zIndex: 9999,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fullscreenContainer: {
    width: '100%',
    height: '100%', 
    backgroundColor: '#000',
  },
  fullscreenVideo: {
    width: height,
    height: width,
    flex: 1,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  lessonNumberContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(51, 94, 247, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  lessonNumber: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.md,
    color: COLORS.primary,
  },
  lessonDetails: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  lessonTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 18,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  lessonDuration: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 14,
    color: COLORS.text.gray,
  },
  lessonActionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonsTabContent: {
    paddingHorizontal: SPACING.md,
  },
  lessonsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.sm,
  },
  lessonCount: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 20,
    color: COLORS.text.primary,
  },
  seeAllButton: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 16,
    color: COLORS.primary,
  },
  seeAllButtonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 16,
    color: COLORS.primary,
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
  certificateModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxxl,
  },
  certificateModalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.xxxl,
    width: '100%',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  certificateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  certificateModalTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 24,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  certificateModalText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  certificateModalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  certificateModalLaterButton: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border.gray,
    alignItems: 'center',
  },
  certificateModalLaterText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 16,
    color: COLORS.text.gray,
  },
  certificateModalViewButton: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  certificateModalViewText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 16,
    color: COLORS.white,
  },
});

export default CourseDetailsScreen; 