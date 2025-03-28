import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

// List of notification settings
const NOTIFICATION_SETTINGS = [
  { id: '1', name: 'General Notification', enabled: true },
  { id: '2', name: 'Sound', enabled: true },
  { id: '3', name: 'Vibrate', enabled: false },
  { id: '4', name: 'Special Offers', enabled: true },
  { id: '5', name: 'Promo & Discount', enabled: false },
  { id: '6', name: 'Payments', enabled: true },
  { id: '7', name: 'Cashback', enabled: false },
  { id: '8', name: 'App Updates', enabled: true },
  { id: '9', name: 'New Service Available', enabled: false },
  { id: '10', name: 'New Tips Available', enabled: false },
];

const NotificationSettingsScreen = ({ navigation }) => {
  // State to manage notification settings
  const [settings, setSettings] = useState(NOTIFICATION_SETTINGS);

  // Toggle switch handler
  const toggleSwitch = (id) => {
    const updatedSettings = settings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    );
    setSettings(updatedSettings);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
      </View>
      
      {/* Settings List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.settingsContainer}>
          {settings.map((setting) => (
            <View key={setting.id} style={styles.settingItem}>
              <Text style={styles.settingName}>{setting.name}</Text>
              <Switch
                trackColor={{ false: '#EEEEEE', true: COLORS.primary }}
                thumbColor={COLORS.white}
                ios_backgroundColor="#EEEEEE"
                onValueChange={() => toggleSwitch(setting.id)}
                value={setting.enabled}
                style={{transform: [{scale: 1.2}]}} 
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md,
    paddingTop: SPACING.xxxl,
    marginTop: 40,
  },
  backButton: {
    marginRight: SPACING.lg,
  },
  headerTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 24,
    color: COLORS.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: SPACING.xxxl,
    paddingBottom: SPACING.xxxl,
  },
  settingsContainer: {
    marginTop: SPACING.xl,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    
  },
  settingName: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 18,
    color: '#424242',
    letterSpacing: 0.2,
  },
});

export default NotificationSettingsScreen; 