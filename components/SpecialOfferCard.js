import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SIZES, SPACING } from '../constants/theme';

const OFFERS = [
  {
    discount: 40,
    title: "Today's Special",
    description: "Get a discount for every course order!\nOnly valid for today!",
    colors: [COLORS.primary, COLORS.primaryLight],
  },
  {
    discount: 25,
    title: "New User Bonus",
    description: "Special discount for new members!\nJoin us today!",
    colors: [COLORS.secondary, COLORS.secondaryLight],
  },
  {
    discount: 30,
    title: "Weekend Sale",
    description: "Extra savings on all premium courses!\nWeekend exclusive!",
    colors: ['#FF6B6B', '#FF8787'],
  },
  {
    discount: 50,
    title: "Flash Deal",
    description: "Biggest discount of the month!\nLimited time offer!",
    colors: ['#20C997', '#38D9A9'],
  },
  {
    discount: 35,
    title: "Bundle Offer",
    description: "Buy multiple courses & save more!\nPerfect for groups!",
    colors: ['#845EF7', '#9775FA'],
  },
];

const SpecialOfferCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setActiveIndex((prevIndex) => (prevIndex + 1) % OFFERS.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const currentOffer = OFFERS[activeIndex];

  return (
    <LinearGradient
      colors={currentOffer.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.label}>{currentOffer.discount}% OFF</Text>
            <Text style={styles.title}>{currentOffer.title}</Text>
          </View>
          <View style={styles.discountContainer}>
            <Text style={styles.discountText}>{currentOffer.discount}%</Text>
          </View>
        </View>
        <Text style={styles.description}>{currentOffer.description}</Text>
      </Animated.View>
      <View style={styles.pagination}>
        {OFFERS.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xxl,
    ...SHADOWS.medium,
  },
  content: {
    padding: SPACING.section,
    gap: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.md,
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  title: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.h1,
    color: COLORS.white,
    marginTop: SPACING.md,
  },
  discountContainer: {
    alignItems: 'flex-end',
  },
  discountText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.h2,
    color: COLORS.white,
  },
  description: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.lg,
    color: COLORS.white,
    letterSpacing: 0.2,
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.white,
    opacity: 0.5,
  },
  activeDot: {
    opacity: 1,
  },
});

export default SpecialOfferCard; 