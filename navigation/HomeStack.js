import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import NotificationScreen from '../screens/NotificationScreen';
import BookmarkScreen from '../screens/BookmarkScreen';
import { BookmarkProvider } from '../context/BookmarkContext';

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
      </Stack.Navigator>
    </BookmarkProvider>
  );
};

export default HomeStack; 