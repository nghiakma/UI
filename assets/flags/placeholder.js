// This file provides placeholder colored squares for flag icons
// In a real application, you would replace these with actual flag images

import React from 'react';
import { View } from 'react-native';

const generateFlagPlaceholder = (color) => {
  return () => (
    <View 
      style={{
        width: 24,
        height: 24,
        backgroundColor: color,
        borderRadius: 12,
      }}
    />
  );
};

// For a real app, replace with actual flag images
export default {
  uk: generateFlagPlaceholder('#1A47B8'),
  us: generateFlagPlaceholder('#3C3B6E'),
  china: generateFlagPlaceholder('#DE2910'),
  india: generateFlagPlaceholder('#FF9933'),
  spain: generateFlagPlaceholder('#AA151B'),
  france: generateFlagPlaceholder('#0055A4'),
  uae: generateFlagPlaceholder('#00732F'),
  bangladesh: generateFlagPlaceholder('#006A4E'),
  russia: generateFlagPlaceholder('#0039A6'),
  portugal: generateFlagPlaceholder('#006600'),
}; 