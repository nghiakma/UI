import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BORDER_RADIUS, COLORS, FONTS, SIZES, SPACING } from '../constants/theme';

const Tag = ({ label, inverted = false, style }) => {
  return (
    <View
      style={[
        styles.container,
        inverted && styles.invertedContainer,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          inverted && styles.invertedLabel,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.lightBlue,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
  },
  invertedContainer: {
    backgroundColor: COLORS.primary,
  },
  label: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.xs,
    lineHeight: SIZES.md,
    letterSpacing: 0.2,
    color: COLORS.primary,
  },
  invertedLabel: {
    color: COLORS.white,
  },
});

export default Tag; 