import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

// FAQ Categories
const CATEGORIES = [
  { id: '1', name: 'General' },
  { id: '2', name: 'Account' },
  { id: '3', name: 'Course' },
  { id: '4', name: 'Payment' },
];

// FAQ Questions and Answers
const FAQ_ITEMS = [
  {
    id: '1',
    category: '1', // General
    question: 'What is Elera?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: '2',
    category: '1', // General
    question: 'How to use Elera?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: '3',
    category: '1', // General
    question: 'Can I create my own course?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: '4',
    category: '1', // General
    question: 'Is Elera free to use?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: '5',
    category: '1', // General
    question: 'How to make offer on Elera?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: '6',
    category: '2', // Account
    question: 'How to change account password?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: '7',
    category: '3', // Course
    question: 'How to download course materials?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: '8',
    category: '4', // Payment
    question: 'Which payment methods are supported?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
];

// Contact options
const CONTACT_OPTIONS = [
  {
    id: '1',
    name: 'Customer Service',
    icon: 'headset', // Ionicons name
    iconColor: '#246BFD',
  },
  {
    id: '2',
    name: 'WhatsApp',
    icon: 'logo-whatsapp', // Ionicons name
    iconColor: '#246BFD',
  },
  {
    id: '3',
    name: 'Website',
    icon: 'globe-outline', // Ionicons name
    iconColor: '#246BFD',
  },
  {
    id: '4',
    name: 'Facebook',
    icon: 'logo-facebook', // Ionicons name
    iconColor: '#246BFD',
  },
  {
    id: '5',
    name: 'Twitter',
    icon: 'logo-twitter', // Ionicons name
    iconColor: '#246BFD',
  },
  {
    id: '6',
    name: 'Instagram',
    icon: 'logo-instagram', // Ionicons name
    iconColor: '#246BFD',
  },
];

const HelpCenterScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('contact'); // 'faq' or 'contact'
  const [activeCategory, setActiveCategory] = useState('1');
  const [expandedItems, setExpandedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const handleCategoryPress = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const toggleFaqItem = (itemId) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter(id => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  // Filter FAQ items by active category
  const filteredFaqItems = FAQ_ITEMS.filter(item => item.category === activeCategory);

  // Render contact option
  const renderContactOption = (option) => (
    <TouchableOpacity 
      key={option.id} 
      style={styles.contactOption}
      onPress={() => {
        if (option.id === '1') { // Customer Service
          navigation.navigate('CustomerService');
        }
      }}
    >
      <View style={styles.contactIconContainer}>
        <Ionicons name={option.icon} size={24} color={option.iconColor} />
      </View>
      <Text style={styles.contactName}>{option.name}</Text>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Help Center</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal-circle" size={24} color="#212121" />
        </TouchableOpacity>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'faq' && styles.activeTab]}
          onPress={() => handleTabPress('faq')}
        >
          <Text style={[styles.tabText, activeTab === 'faq' && styles.activeTabText]}>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'contact' && styles.activeTab]}
          onPress={() => handleTabPress('contact')}
        >
          <Text style={[styles.tabText, activeTab === 'contact' && styles.activeTabText]}>Contact us</Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'faq' ? (
        <>
          {/* Categories */}
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  activeCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => handleCategoryPress(category.id)}
              >
                <Text 
                  style={[
                    styles.categoryText,
                    activeCategory === category.id && styles.categoryTextActive
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#9E9E9E" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#9E9E9E"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color="#246BFD" />
            </TouchableOpacity>
          </View>
          
          {/* FAQ Items */}
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {filteredFaqItems.map((item) => (
              <View key={item.id} style={styles.faqItemContainer}>
                <TouchableOpacity
                  style={styles.faqItem}
                  onPress={() => toggleFaqItem(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Ionicons 
                    name={expandedItems.includes(item.id) ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color="#246BFD" 
                  />
                </TouchableOpacity>
                
                {expandedItems.includes(item.id) && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{item.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contactListContainer}
        >
          {CONTACT_OPTIONS.map(option => renderContactOption(option))}
        </ScrollView>
      )}
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
  moreButton: {
    width: 24,
    height: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#246BFD',
  },
  tabText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 18,
    color: '#BDBDBD',
  },
  activeTabText: {
    color: '#246BFD',
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  categoryButtonActive: {
    backgroundColor: '#246BFD',
    borderColor: '#246BFD',
  },
  categoryText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 14,
    color: '#212121',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.urbanist.medium,
    fontSize: 16,
    color: '#212121',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  faqItemContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  faqQuestion: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 16,
    color: '#212121',
    flex: 1,
    letterSpacing: 0.2,
  },
  faqAnswerContainer: {
    paddingBottom: 16,
  },
  faqAnswer: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: 14,
    lineHeight: 20,
    color: '#424242',
    letterSpacing: 0.2,
  },
  // Contact us styles
  contactListContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactName: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 16,
    color: '#212121',
    letterSpacing: 0.2,
  },
});

export default HelpCenterScreen; 