import React, { createContext, useState, useContext } from 'react';
import { COURSES } from '../screens/HomeScreen';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarkedCourses, setBookmarkedCourses] = useState(
    COURSES.filter(course => course.isBookmarked).map(course => course.id)
  );

  const toggleBookmark = (courseId) => {
    setBookmarkedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  const isBookmarked = (courseId) => {
    return bookmarkedCourses.includes(courseId);
  };

  return (
    <BookmarkContext.Provider value={{ toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmark must be used within a BookmarkProvider');
  }
  return context;
}; 