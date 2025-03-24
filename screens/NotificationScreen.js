import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Payment Successful!',
    description: 'You have made a course payment',
    icon: 'wallet',
    date: 'Today',
    gradient: [COLORS.primary, COLORS.primaryLight],
  },
  {
    id: '2',
    title: "Today's Special Offers",
    description: 'You get a special promo today!',
    icon: 'ticket',
    date: 'Today',
    gradient: ['#FACC15', '#FFE580'],
  },
  {
    id: '3',
    title: 'New Category Courses!',
    description: 'Now the 3D design course is available',
    icon: 'grid',
    date: 'Yesterday',
    gradient: ['#FF4D67', '#FF8A9B'],
  },
  {
    id: '4',
    title: 'Account Setup Successful!',
    description: 'Your account has been created!',
    icon: 'person',
    date: 'December 22, 2024',
    gradient: ['#4ADE80', '#86EFAC'],
  },
];

const NotificationScreen = ({ navigation }) => {
  const groupedNotifications = NOTIFICATIONS.reduce((groups, notification) => {
    if (!groups[notification.date]) {
      groups[notification.date] = [];
    }
    groups[notification.date].push(notification);
    return groups;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notification</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupedNotifications).map(([date, notifications]) => (
          <View key={date} style={styles.section}>
            <Text style={styles.dateHeader}>{date}</Text>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={styles.notificationCard}
              >
                <View style={[styles.iconContainer, { backgroundColor: notification.gradient[0] }]}>
                  <Ionicons name={notification.icon} size={24} color="white" />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationDescription}>
                    {notification.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    marginTop: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  backButton: {
    padding: SPACING.xs,
  },
  moreButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.h2,
    color: COLORS.text.primary,
  },
  content: {
    padding: SPACING.xl,
    gap: SPACING.xxl,
  },
  section: {
    gap: SPACING.xl,
  },
  dateHeader: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.lg,
    color: COLORS.text.primary,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    gap: SPACING.xl,
    ...SHADOWS.medium,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    gap: SPACING.xs,
  },
  notificationTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.lg,
    color: COLORS.text.primary,
  },
  notificationDescription: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md,
    color: COLORS.text.secondary,
    letterSpacing: 0.2,
  },
});

export default NotificationScreen; 