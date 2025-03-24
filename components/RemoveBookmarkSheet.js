import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';

const RemoveBookmarkSheet = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.indicator} />
              <View style={styles.content}>
                <View style={styles.header}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="bookmark-outline" size={32} color={COLORS.white} />
                  </View>
                  <Text style={styles.title}>Remove from Bookmark</Text>
                  <Text style={styles.description}>
                    Are you sure you want to remove this course from your bookmark?
                  </Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[styles.button, styles.cancelButton]}
                    onPress={onClose}
                  >
                    <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.button, styles.removeButton]}
                    onPress={() => {
                      onConfirm();
                      onClose();
                    }}
                  >
                    <Text style={[styles.buttonText, styles.removeButtonText]}>Yes, Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: SPACING.md,
  },
  indicator: {
    width: 32,
    height: 4,
    backgroundColor: COLORS.text.lightGray,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  content: {
    padding: SPACING.xl,
    gap: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    gap: SPACING.lg,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.xl,
    color: COLORS.text.primary,
    letterSpacing: 0.2,
  },
  description: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: SIZES.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  button: {
    flex: 1,
    height: 58,
    borderRadius: BORDER_RADIUS.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.lg,
    letterSpacing: 0.2,
  },
  cancelButton: {
    backgroundColor: COLORS.background.gray,
  },
  cancelButtonText: {
    color: COLORS.text.primary,
  },
  removeButton: {
    backgroundColor: COLORS.primary,
  },
  removeButtonText: {
    color: COLORS.white,
  },
});

export default RemoveBookmarkSheet; 