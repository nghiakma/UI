import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyCourseScreen from '../screens/MyCourseScreen';
import CourseDetailsScreen from '../screens/CourseDetailsScreen';
import AllLessonsScreen from '../screens/AllLessonsScreen';
import CourseReviewsScreen from '../screens/CourseReviewsScreen';
import { BookmarkProvider } from '../context/BookmarkContext';
import CertificateScreen from '../screens/CertificateScreen';
const Stack = createNativeStackNavigator();

const MyCourseStack = () => {
  return (
    <BookmarkProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MyCourseMain" component={MyCourseScreen} />
        <Stack.Screen name="CourseDetailsScreen" component={CourseDetailsScreen} />
        <Stack.Screen name="AllLessons" component={AllLessonsScreen} />
        <Stack.Screen name="CourseReviews" component={CourseReviewsScreen} />
        <Stack.Screen name="CertificateScreen" component={CertificateScreen} />
      </Stack.Navigator>
    </BookmarkProvider>
  );
};

export default MyCourseStack;