import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

// Sample data for chats
const CHATS = [
  {
    id: '1',
    name: 'Jenny Wilona',
    message: 'Hi, good morning too!',
    time: '13.29',
    unread: 2,
    avatar: require('../assets/images/avatars/avatar1.png'),
    online: true,
  },
  {
    id: '2',
    name: 'Sanjuanita Ordonez',
    message: 'I just finished it 😂😂',
    time: '10:48',
    unread: 3,
    avatar: require('../assets/images/avatars/avatar2.png'),
    online: true,
  },
  {
    id: '3',
    name: 'Geoffrey Mott',
    message: 'omg, this is amazing 🔥🔥🔥',
    time: '09.25',
    unread: 0,
    avatar: require('../assets/images/avatars/avatar3.png'),
    online: false,
  },
  {
    id: '4',
    name: 'Marci Senter',
    message: 'Wow, this is really epic 😎',
    time: 'Yesterday',
    unread: 2,
    avatar: require('../assets/images/avatars/avatar4.png'),
    online: true,
  },
  {
    id: '5',
    name: 'Tynisha Obey',
    message: 'just ideas for next time 😆',
    time: 'Dec 20, 2024',
    unread: 0,
    avatar: require('../assets/images/avatars/avatar5.png'),
    online: false,
  },
  {
    id: '6',
    name: 'Merrill Kervin',
    message: 'How are you? 😄😄',
    time: 'Dec 20, 2024',
    unread: 0,
    avatar: require('../assets/images/avatars/avatar6.png'),
    online: false,
  },
  {
    id: '7',
    name: 'Elanor Pera',
    message: 'perfect! 💯💯💯',
    time: 'Dec 18, 2024',
    unread: 0,
    avatar: require('../assets/images/avatars/avatar7.png'),
    online: false,
  },
];

const ChatItem = ({ chat, onPress }) => {
  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress}>
      <View style={styles.chatItemLeft}>
        <View style={styles.avatar}>
          <Image source={chat.avatar} style={styles.avatarImage} />
        </View>
        <View style={styles.chatInfo}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <Text style={styles.chatMessage}>{chat.message}</Text>
        </View>
      </View>
      <View style={styles.chatItemRight}>
        {chat.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{chat.unread}</Text>
          </View>
        )}
        <Text style={styles.timeText}>{chat.time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const InboxScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Chats');

  const handleChatPress = (chat) => {
    // Navigate to chat detail screen
    navigation.navigate('ChatDetailScreen', { contact: chat });
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
          <Text style={styles.headerTitle}>Inbox</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Chats' && styles.activeTab]}
          onPress={() => setActiveTab('Chats')}
        >
          <Text style={[styles.tabText, activeTab === 'Chats' && styles.activeTabText]}>Chats</Text>
          {activeTab === 'Chats' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Calls' && styles.activeTab]}
          onPress={() => setActiveTab('Calls')}
        >
          <Text style={[styles.tabText, activeTab === 'Calls' && styles.activeTabText]}>Calls</Text>
          {activeTab === 'Calls' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>
      
      {/* Chat List */}
      <ScrollView 
        style={styles.chatListContainer}
        showsVerticalScrollIndicator={false}
      >
        {CHATS.map(chat => (
          <ChatItem 
            key={chat.id} 
            chat={chat} 
            onPress={() => handleChatPress(chat)} 
          />
        ))}
      </ScrollView>
      
      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => console.log('New message')}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
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
    marginTop: 40
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xxxl,
    marginTop: SPACING.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    paddingVertical: SPACING.md,
  },
  activeTab: {},
  tabText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 18,
    letterSpacing: 0.2,
    color: COLORS.text.lightGray,
  },
  activeTabText: {
    color: COLORS.primary,
    fontFamily: FONTS.urbanist.bold,
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 24,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  chatListContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xxxl,
    paddingTop: SPACING.xl,
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  chatItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  chatInfo: {
    gap: SPACING.xs,
  },
  chatName: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 18,
    color: COLORS.text.primary,
  },
  chatMessage: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 14,
    color: COLORS.text.gray,
    letterSpacing: 0.2,
  },
  chatItemRight: {
    alignItems: 'flex-end',
    gap: SPACING.md,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: 10,
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  timeText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 14,
    color: COLORS.text.gray,
    letterSpacing: 0.2,
  },
  fabContainer: {
    position: 'absolute',
    right: SPACING.xxxl,
    bottom: SPACING.xxxl , // Bottom tabs height + padding
    zIndex: 10,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
});

export default InboxScreen; 