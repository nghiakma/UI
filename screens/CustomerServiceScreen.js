import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

// Sample chat messages
const INITIAL_MESSAGES = [
  {
    id: '1',
    text: 'Hello, good morning.',
    time: '09:41',
    isUser: false,
  },
  {
    id: '2',
    text: 'I am a Customer Service, is there anything I can help you with? 😊',
    time: '09:41',
    isUser: false,
  },
  {
    id: '3',
    text: "Hi, I'm having problems with my course payment.",
    time: '09:41',
    isUser: true,
  },
  {
    id: '4',
    text: 'Can you help me?',
    time: '09:41',
    isUser: true,
  },
  {
    id: '5',
    text: 'Of course...',
    time: '09:41',
    isUser: false,
  },
  {
    id: '6',
    text: 'Can you tell me the problem you are having? so I can help solve it 😊',
    time: '10:00',
    isUser: false,
  },
];

const CustomerServiceScreen = ({ navigation }) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    // Get current time in HH:MM format
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    // Add user message
    const userMessage = {
      id: (messages.length + 1).toString(),
      text: newMessage,
      time: timeStr,
      isUser: true,
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simulate customer service response after a short delay
    setTimeout(() => {
      const serviceResponse = {
        id: (messages.length + 2).toString(),
        text: 'Thank you for providing those details. Let me check this issue for you.',
        time: timeStr,
        isUser: false,
      };
      setMessages(prev => [...prev, serviceResponse]);
    }, 1000);
  };

  const renderMessage = (message) => {
    return (
      <View 
        key={message.id} 
        style={[
          styles.messageBubble,
          message.isUser ? styles.userMessage : styles.serviceMessage
        ]}
      >
        <Text style={[
          styles.messageText,
          message.isUser && styles.userMessageText
        ]}>
          {message.text}
        </Text>
        <Text style={[
          styles.messageTime,
          message.isUser && styles.userMessageTime
        ]}>
          {message.time}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, {paddingTop: Platform.OS === 'ios' ? 0 : 40}]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Service</Text>
        <View style={styles.headerRightButtons}>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call-outline" size={24} color="#212121" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal-circle" size={24} color="#212121" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Chat container */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.chatContainer}>
          {/* Date indicator */}
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Today</Text>
          </View>
          
          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(message => renderMessage(message))}
          </ScrollView>
          
          {/* Message input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="image-outline" size={24} color="#9E9E9E" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Message..."
              placeholderTextColor="#9E9E9E"
              multiline
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={newMessage.trim() === ''}
            >
              <Ionicons 
                name="mic" 
                size={24} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 24,
    color: '#212121',
    letterSpacing: 0.2,
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButton: {
    marginRight: 16,
  },
  moreButton: {
    width: 24,
    height: 24,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 14,
    color: '#757575',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  serviceMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#246BFD',
  },
  messageText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 16,
    lineHeight: 24,
    color: '#212121',
    marginBottom: 4,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 12,
    color: '#757575',
    alignSelf: 'flex-end',
  },
  userMessageTime: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  attachButton: {
    paddingVertical: 12,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.urbanist.regular,
    fontSize: 16,
    color: '#212121',
    maxHeight: 120,
    paddingVertical: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#246BFD',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default CustomerServiceScreen; 