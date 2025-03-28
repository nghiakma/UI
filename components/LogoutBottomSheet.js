import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');

const LogoutBottomSheet = ({ isVisible, onCancel, onConfirm }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdropButton} onPress={onCancel} />
      <View style={styles.sheetContainer}>
        <View style={styles.handle} />
        
        <View style={styles.iconContainer}>
          <Ionicons name="log-out-outline" size={32} color="#FF4C41" />
        </View>
        
        <Text style={styles.title}>Logout</Text>
        <Text style={styles.description}>
          Are you sure you want to logout from your account?
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={onConfirm}
          >
            <Text style={styles.logoutButtonText}>Yes, Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdropButton: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 24,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFEFEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  title: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 20,
    color: '#212121',
    marginBottom: 8,
  },
  description: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 16,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  logoutButton: {
    backgroundColor: '#FF4C41',
  },
  cancelButtonText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 16,
    color: '#212121',
  },
  logoutButtonText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 16,
    color: COLORS.white,
  },
});

export default LogoutBottomSheet; 