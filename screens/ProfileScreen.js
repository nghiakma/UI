import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const MenuItem = ({ icon, title, rightComponent, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={24} color={COLORS.text.primary} />
        <Text style={styles.menuItemTitle}>{title}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {rightComponent || (
          <Ionicons name="chevron-forward" size={20} color={COLORS.text.primary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const Divider = () => <View style={styles.divider} />;

const ProfileScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(previousState => !previousState);
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Profile Info */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileContainer}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../assets/images/avatars/avatar1.png')} 
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="pencil" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          
          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Andrew Ainsley</Text>
            <Text style={styles.userEmail}>andrew_ainsley@yourdomain.com</Text>
          </View>
        </View>
        
        <Divider />
        
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <MenuItem 
            icon="person-outline" 
            title="Edit Profile" 
            onPress={() => navigation.navigate('EditProfile')}
          />
          
          <MenuItem 
            icon="notifications-outline" 
            title="Notification" 
            onPress={() => navigation.navigate('NotificationSettings')}
          />
          
          <MenuItem 
            icon="wallet-outline" 
            title="Payment" 
            onPress={() => navigation.navigate('Payment')}
          />
          
          <MenuItem 
            icon="shield-checkmark-outline" 
            title="Security" 
            onPress={() => navigation.navigate('Security')}
          />
          
          <MenuItem 
            icon="language-outline" 
            title="Language" 
            rightComponent={
              <Text style={styles.languageText}>English (US)</Text>
            }
            onPress={() => navigation.navigate('LanguageSettings')}
          />
          
          <MenuItem 
            icon="eye-outline" 
            title="Dark Mode" 
            rightComponent={
              <Switch
                trackColor={{ false: COLORS.lightGray, true: `${COLORS.primary}50` }}
                thumbColor={isDarkMode ? COLORS.primary : COLORS.white}
                ios_backgroundColor={COLORS.lightGray}
                onValueChange={toggleDarkMode}
                value={isDarkMode}
              />
            }
          />
          
          <MenuItem 
            icon="lock-closed-outline" 
            title="Privacy Policy" 
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
          
          <MenuItem 
            icon="help-circle-outline" 
            title="Help Center" 
            onPress={() => navigation.navigate('HelpCenter')}
          />
          
          <MenuItem 
            icon="people-outline" 
            title="Invite Friends" 
            onPress={() => navigation.navigate('InviteFriends')}
          />
          
          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md,
    paddingTop: SPACING.xxxl,
    marginTop: 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  logoContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
  headerTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 24,
    color: COLORS.text.primary,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 24,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 14,
    color: COLORS.text.primary,
    opacity: 0.7,
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: SPACING.xxl,
    marginVertical: SPACING.lg,
  },
  menuContainer: {
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  menuItemTitle: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 18,
    color: COLORS.text.primary,
    letterSpacing: 0.2,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  languageText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 18,
    color: COLORS.text.secondary,
    marginRight: SPACING.xs,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    paddingVertical: SPACING.lg,
    marginTop: SPACING.md,
  },
  logoutText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 18,
    color: COLORS.error,
    letterSpacing: 0.2,
  },
});

export default ProfileScreen; 