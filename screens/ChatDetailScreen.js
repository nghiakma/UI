import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const MessageBubble = ({ message, isUser }) => {
  return (
    <View style={[
      styles.messageBubble,
      isUser ? styles.userBubble : styles.otherBubble
    ]}>
      <Text style={[
        styles.messageText,
        isUser ? styles.userMessageText : styles.otherMessageText
      ]}>
        {message.text}
      </Text>
      <Text style={[
        styles.messageTime,
        isUser ? styles.userMessageTime : styles.otherMessageTime
      ]}>
        {message.time}
      </Text>
    </View>
  );
};

const ChatDetailScreen = ({ route, navigation }) => {
  const [messageText, setMessageText] = useState('');
  // Get contact info from route params
  const { contact } = route.params || {};
  
  // Set default message history based on contact ID
  // In a real app, this would come from an API or local database
  const getMessagesForContact = (contactId) => {
    // Default message history for all contacts
    const defaultMessages = [
      {
        id: '1',
        text: 'Hi, how are you?',
        time: '09:15',
        isUser: false,
      },
      {
        id: '2',
        text: 'I\'m good, thanks for asking! How about you?',
        time: '09:17',
        isUser: true,
      }
    ];
    
    // Special message history for Jenny Wilona (ID: 1)
    if (contactId === '1') {
      return [
        ...defaultMessages,
        {
          id: '3',
          text: 'I\'m doing well. Just wanted to check if you\'ve completed the assignment?',
          time: '09:20',
          isUser: false,
        },
        {
          id: '4',
          text: 'Yes, I submitted it yesterday. Did you get a chance to review it?',
          time: '09:22',
          isUser: true,
        },
        {
          id: '5',
          text: 'Not yet, but I\'ll look at it today. Good morning by the way!',
          time: '09:30',
          isUser: false,
        },
        {
          id: '6',
          text: contact?.message || 'Hi, good morning too!',
          time: '09:32',
          isUser: true,
        },
      ];
    }
    
    // Return default messages for other contacts
    return defaultMessages;
  };
  
  // Get messages for this contact
  const messages = getMessagesForContact(contact?.id);

  const sendMessage = () => {
    if (messageText.trim().length === 0) return;
    console.log('Sending message:', messageText);
    // In a real app, you would add the message to the messages array
    // and possibly send it to a backend
    setMessageText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <View style={styles.contactInfo}>
          <Image source={contact?.avatar} style={styles.avatar} />
          <View>
            <Text style={styles.contactName}>{contact?.name}</Text>
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusDot, 
                { backgroundColor: contact?.online ? '#4CAF50' : COLORS.text.lightGray }
              ]} />
              <Text style={styles.statusText}>
                {contact?.online ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="call-outline" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="videocam-outline" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.dateHeader}>Today</Text>
          {messages.map(message => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              isUser={message.isUser} 
            />
          ))}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Write a message..."
              placeholderTextColor={COLORS.text.lightGray}
              value={messageText}
              onChangeText={setMessageText}
              multiline
            />
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.gray,
    marginTop: 50
  },
  backButton: {
    padding: SPACING.xs,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  contactName: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.lg,
    color: COLORS.text.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.sm,
    color: COLORS.text.lightGray,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  messagesContent: {
    paddingVertical: SPACING.xl,
    gap: SPACING.lg,
  },
  dateHeader: {
    alignSelf: 'center',
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.sm,
    color: COLORS.text.lightGray,
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.background.gray,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.md,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 0,
  },
  otherBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.background.gray,
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md,
    marginBottom: SPACING.xs,
  },
  userMessageText: {
    color: COLORS.white,
  },
  otherMessageText: {
    color: COLORS.text.primary,
  },
  messageTime: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: SIZES.xs,
    alignSelf: 'flex-end',
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherMessageTime: {
    color: COLORS.text.lightGray,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.gray,
    backgroundColor: COLORS.white,
  },
  attachButton: {
    padding: SPACING.xs,
  },
  textInputContainer: {
    flex: 1,
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.background.gray,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? SPACING.md : 0,
  },
  textInput: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: SIZES.md,
    color: COLORS.text.primary,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
});

export default ChatDetailScreen; 