import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import NotificationScreen from '../screens/NotificationScreen';
import BookmarkScreen from '../screens/BookmarkScreen';
import { BookmarkProvider } from '../context/BookmarkContext';
import TopMentorsScreen from '../screens/TopMentorsScreen';
import PopularCoursesScreen from '../screens/PopularCoursesScreen';
import SearchScreen from '../screens/SearchScreen';
import AdvancedSearchScreen from '../screens/AdvancedSearchScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import MentorProfileScreen from '../screens/MentorProfileScreen';
import MentorReviewsScreen from '../screens/MentorReviewsScreen';
import CourseDetailsScreen from '../screens/CourseDetailsScreen';
import AllLessonsScreen from '../screens/AllLessonsScreen';
import CourseReviewsScreen from '../screens/CourseReviewsScreen';
import CertificateScreen from '../screens/CertificateScreen';
import LessonDetailScreen from '../screens/LessonDetailScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <BookmarkProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="HomeMain" component={HomeScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="Bookmark" component={BookmarkScreen} />
        <Stack.Screen name="TopMentors" component={TopMentorsScreen} />
        <Stack.Screen name="PopularCourses" component={PopularCoursesScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="AdvancedSearch" component={AdvancedSearchScreen} />
        <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
        <Stack.Screen name="MentorProfile" component={MentorProfileScreen} />
        <Stack.Screen name="MentorReviews" component={MentorReviewsScreen} />
        <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
        <Stack.Screen name="AllLessons" component={AllLessonsScreen} />
        <Stack.Screen name="CourseReviews" component={CourseReviewsScreen} />
        <Stack.Screen name="CertificateScreen" component={CertificateScreen} />
        <Stack.Screen name="LessonDetail" component={LessonDetailScreen} />
      </Stack.Navigator>
    </BookmarkProvider>
  );
};

export default HomeStack; 