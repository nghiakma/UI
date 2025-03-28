import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import Avatar from '../components/Avatar';
const ReviewItem = ({ review }) => {
    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewerInfo}>
            <Avatar source={review.avatar} size={48} />
            <View style={styles.reviewerDetails}>
              <Text style={styles.reviewerName}>{review.name}</Text>
              <View style={styles.ratingRow}>
                <View style={styles.starsContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons 
                      key={i} 
                      name={i < review.rating ? "star" : "star-outline"} 
                      size={16} 
                      color={COLORS.secondary} 
                    />
                  ))}
                </View>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.text.gray} />
          </TouchableOpacity>
        </View>
        <Text style={styles.reviewText}>{review.review}</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
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
  });
export default ReviewItem; 