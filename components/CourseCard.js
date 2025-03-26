import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SIZES, SPACING } from '../constants/theme';
import Tag from './Tag';

const CourseCard = ({
  title,
  category,
  image,
  price,
  originalPrice,
  rating,
  students,
  isBookmarked = false,
  onPress,
  onBookmarkPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Tag label={category} />
          <TouchableOpacity onPress={onBookmarkPress}>
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isBookmarked ? COLORS.primary : COLORS.text.primary}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${price}</Text>
          {originalPrice && (
            <Text style={styles.originalPrice}>${originalPrice}</Text>
          )}
        </View>
        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={COLORS.secondary} />
            <Text style={styles.rating}>{rating}</Text>
          </View>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.students}>{students} students</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    flexDirection: 'row',
    padding: SPACING.xl,
    gap: SPACING.xl,
    ...SHADOWS.xl,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    gap: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.xl,
    color: COLORS.text.primary,
    lineHeight: 24,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
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
  },
  students: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.sm,
    color: COLORS.text.gray,
  },
});

export default CourseCard; 