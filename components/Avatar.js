import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { BORDER_RADIUS } from '../constants/theme';

const Avatar = ({ size = 48, source, style }) => {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={source}
        style={[styles.image, { width: size, height: size }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  image: {
    borderRadius: BORDER_RADIUS.full,
  },
});

export default Avatar; 