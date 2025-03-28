import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';

const { width } = Dimensions.get('window');

const ReviewModal = ({ visible, onClose, onSubmit, onCancel, course }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Decorative dots */}
          <View style={styles.decorativeDotsContainer}>
            <View style={styles.dotsGrid}>
              <View style={styles.decorativeDot} />
              <View style={styles.decorativeDot} />
              <View style={styles.decorativeDot} />
              <View style={styles.decorativeDot} />
              <View style={[styles.decorativeDot, styles.decorativeDotHighlight]} />
              <View style={styles.decorativeDot} />
              <View style={styles.decorativeDot} />
              <View style={styles.decorativeDot} />
              <View style={styles.decorativeDot} />
              <View style={styles.decorativeDot} />
              <View style={styles.decorativeDot} />
            </View>
            <View style={styles.editIconContainer}>
              <MaterialCommunityIcons name="pencil" size={24} color={COLORS.white} />
            </View>
          </View>

          {/* Content */}
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Course Completed!</Text>
            <Text style={styles.modalSubtitle}>
              Please leave a review{'\n'}for your course.
            </Text>

            {/* Rating Stars */}
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={star <= 4 ? 'star' : 'star-outline'}
                    size={32}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Review Input */}
            <View style={styles.reviewInputContainer}>
              <TextInput
                style={styles.reviewInput}
                placeholder="The courses & mentors are great! 🔥"
                placeholderTextColor={COLORS.text.primary}
                multiline
                numberOfLines={3}
                editable={false}
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                activeOpacity={0.7}
                onPress={onSubmit}
              >
                <Text style={styles.submitButtonText}>Write Review</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.7}
                onPress={onCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 16, 29, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 340,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  decorativeDotsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 32,
    width: 120,
    height: 40,
  },
  dotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  decorativeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#859EFA20', // Light blue with opacity
  },
  decorativeDotHighlight: {
    backgroundColor: '#335EF7',
  },
  editIconContainer: {
    position: 'absolute',
    width: 48,
    height: 48,
    backgroundColor: '#335EF7',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    alignItems: 'center',
    width: '100%',
  },
  modalTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 24,
    color: '#335EF7',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: 16,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  reviewInputContainer: {
    width: '100%',
    backgroundColor: 'rgba(51, 94, 247, 0.08)', // Very light blue with opacity
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#335EF7',
    padding: 20,
    marginBottom: 32,
    height: 106,
  },
  reviewInput: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 14,
    color: COLORS.text.primary,
    letterSpacing: 0.2,
    lineHeight: 20,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#335EF7',
    borderRadius: 100,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  cancelButton: {
    backgroundColor: '#EBEFFE',
    borderRadius: 100,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 16,
    color: '#335EF7',
    letterSpacing: 0.2,
  },
});

export default ReviewModal; 