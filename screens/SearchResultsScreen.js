import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../constants/theme';
import CourseCard from '../components/CourseCard';
import { useBookmark } from '../context/BookmarkContext';
import RemoveBookmarkSheet from '../components/RemoveBookmarkSheet';
import { CATEGORIES, PRICES, RATINGS } from './AdvancedSearchScreen';

const SEARCH_RESULTS = [
  {
    id: '1',
    title: '3D Design Illustration',
    category: '3D Design',
    image: { uri: 'https://picsum.photos/400/300?random=6' },
    price: '48',
    originalPrice: '80',
    rating: '4.8',
    students: '8,289',
    isBookmarked: true,
  },
  {
    id: '2',
    title: 'Digital Entrepreneurship',
    category: 'Entrepreneurship',
    image: { uri: 'https://picsum.photos/400/300?random=7' },
    price: '39',
    rating: '4.9',
    students: '6,182',
    isBookmarked: false,
  },
  {
    id: '3',
    title: 'Learn UX User Persona',
    category: 'UI/UX Design',
    image: { uri: 'https://picsum.photos/400/300?random=8' },
    price: '42',
    originalPrice: '75',
    rating: '4.7',
    students: '7,938',
    isBookmarked: true,
  },
];

const MENTORS = [
  { 
    id: '1', 
    name: 'Jacob Jones',
    role: '3D Design Expert',
    rating: '4.8',
    students: '8,289',
    courses: '15',
    image: { uri: 'https://picsum.photos/200?random=1' }
  },
  { 
    id: '2', 
    name: 'Claire Robertson',
    role: 'Business Coach',
    rating: '4.9',
    students: '6,182',
    courses: '12',
    image: { uri: 'https://picsum.photos/200?random=2' }
  },
  { 
    id: '3', 
    name: 'Priscilla Smith',
    role: 'UI/UX Designer',
    rating: '4.7',
    students: '7,938',
    courses: '8',
    image: { uri: 'https://picsum.photos/200?random=3' }
  },
];

const SearchType = {
  COURSES: 'courses',
  MENTORS: 'mentors',
};

const MentorCard = ({ mentor, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.mentorCard}
      onPress={onPress}
    >
      <Image source={mentor.image} style={styles.mentorImage} />
      <View style={styles.mentorInfo}>
        <Text style={styles.mentorName}>{mentor.name}</Text>
        <Text style={styles.mentorRole}>{mentor.role}</Text>
        <View style={styles.mentorStats}>
          <View style={styles.mentorStat}>
            <Ionicons name="star" size={16} color={COLORS.secondary} />
            <Text style={styles.mentorStatText}>{mentor.rating}</Text>
          </View>
          <View style={styles.mentorStat}>
            <Ionicons name="people-outline" size={16} color={COLORS.text.gray} />
            <Text style={styles.mentorStatText}>{mentor.students} Students</Text>
          </View>
          <View style={styles.mentorStat}>
            <Ionicons name="book-outline" size={16} color={COLORS.text.gray} />
            <Text style={styles.mentorStatText}>{mentor.courses} Courses</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SearchResultsScreen = ({ navigation, route }) => {
  const { query, filters } = route.params || { query: '', filters: {} };
  const [searchText, setSearchText] = useState(query || '');
  const [isFocused, setIsFocused] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmark();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [searchType, setSearchType] = useState(SearchType.COURSES);

  const handleBookmarkPress = (courseId) => {
    if (isBookmarked(courseId)) {
      setSelectedCourseId(courseId);
      setIsBottomSheetVisible(true);
    } else {
      toggleBookmark(courseId);
    }
  };

  const handleConfirmRemove = () => {
    if (selectedCourseId) {
      toggleBookmark(selectedCourseId);
      setSelectedCourseId(null);
    }
    setIsBottomSheetVisible(false);
  };

  const handleSearch = () => {
    setSearchText(searchText.trim());
  };

  const handleFilter = () => {
    if (searchType === SearchType.COURSES) {
      navigation.navigate('AdvancedSearch', {
        query: searchText,
        filters: filters,
        onApply: (newFilters) => {
          navigation.navigate('SearchResults', {
            query: searchText,
            filters: newFilters
          });
        }
      });
    }
  };

  // Filter results based on search text and filters
  const filteredCourses = SEARCH_RESULTS.filter(course => {
    let matches = true;
    
    if (searchText?.trim()) {
      const searchLower = searchText.toLowerCase().trim();
      matches = matches && (
        course.title.toLowerCase().includes(searchLower) ||
        course.category.toLowerCase().includes(searchLower)
      );
    }

    try {
      if (filters?.category && filters.category !== '1') {
        const category = CATEGORIES?.find(cat => cat.id === filters.category);
        if (category) {
          const categoryName = category.label.split(' ').slice(1).join(' ');
          matches = matches && course.category === categoryName;
        }
      }

      if (filters?.price) {
        const priceRange = PRICES?.find(p => p.id === filters.price);
        if (priceRange) {
          const coursePrice = parseFloat(course.price);
          matches = matches && coursePrice >= priceRange.min && coursePrice <= priceRange.max;
        }
      }

      if (filters?.rating) {
        const ratingOption = RATINGS?.find(r => r.id === filters.rating);
        if (ratingOption) {
          const courseRating = parseFloat(course.rating);
          matches = matches && courseRating >= ratingOption.value;
        }
      }
    } catch (error) {
      console.warn('Error applying filters:', error);
    }

    return matches;
  });

  // Filter mentors based on search text
  const filteredMentors = MENTORS.filter(mentor => {
    if (!searchText?.trim()) return true;
    
    const searchLower = searchText.toLowerCase().trim();
    return (
      mentor.name.toLowerCase().includes(searchLower) ||
      mentor.role.toLowerCase().includes(searchLower)
    );
  });

  const results = searchType === SearchType.COURSES ? filteredCourses : filteredMentors;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Search Results</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[
            styles.searchInputContainer,
            isFocused && styles.searchInputContainerFocused
          ]}>
            <Ionicons
              name="search-outline"
              size={24}
              color={COLORS.text.gray}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${searchType}`}
              placeholderTextColor={COLORS.text.gray}
              value={searchText}
              onChangeText={setSearchText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={COLORS.text.gray}
                />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={handleFilter}
          >
            <Ionicons
              name="options-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Search Type Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              searchType === SearchType.COURSES && styles.activeTab,
            ]}
            onPress={() => setSearchType(SearchType.COURSES)}
          >
            <Text
              style={[
                styles.tabText,
                searchType === SearchType.COURSES && styles.activeTabText,
              ]}
            >
              Courses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              searchType === SearchType.MENTORS && styles.activeTab,
            ]}
            onPress={() => setSearchType(SearchType.MENTORS)}
          >
            <Text
              style={[
                styles.tabText,
                searchType === SearchType.MENTORS && styles.activeTabText,
              ]}
            >
              Mentors
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results Count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            Found {results.length} Results
          </Text>
          {searchType === SearchType.COURSES && (
            <TouchableOpacity style={styles.sortButton}>
              <Ionicons
                name="funnel-outline"
                size={20}
                color={COLORS.text.primary}
              />
              <Text style={styles.sortButtonText}>Sort by</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Results List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsContainer}
        >
          {searchType === SearchType.COURSES ? (
            // Courses List
            filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                category={course.category}
                image={course.image}
                price={course.price}
                originalPrice={course.originalPrice}
                rating={course.rating}
                students={course.students}
                isBookmarked={isBookmarked(course.id)}
                onPress={() => navigation.navigate('CourseDetail', { course })}
                onBookmarkPress={() => handleBookmarkPress(course.id)}
              />
            ))
          ) : (
            // Mentors List
            filteredMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onPress={() => navigation.navigate('MentorDetail', { mentor })}
              />
            ))
          )}
          {results.length === 0 && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                No {searchType} found matching your search
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <RemoveBookmarkSheet
        visible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        onConfirm={handleConfirmRemove}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.default,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 24,
    lineHeight: 28.8,
    color: COLORS.text.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
  },
  searchInputContainer: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
    backgroundColor: COLORS.background.gray,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchInputContainerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.urbanist.medium,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: COLORS.text.primary,
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.background.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  resultsCount: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 20,
    lineHeight: 24,
    color: COLORS.text.primary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortButtonText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 14,
    lineHeight: 19.6,
    letterSpacing: 0.2,
    color: COLORS.text.primary,
  },
  resultsContainer: {
    padding: 24,
    gap: 16,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  noResultsText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 16,
    lineHeight: 22.4,
    color: COLORS.text.gray,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.background.gray,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 14,
    color: COLORS.text.primary,
  },
  activeTabText: {
    color: COLORS.white,
  },
  mentorCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(4, 6, 15, 0.05)',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 60,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  mentorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  mentorInfo: {
    flex: 1,
    gap: 4,
  },
  mentorName: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 18,
    color: COLORS.text.primary,
  },
  mentorRole: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 14,
    color: COLORS.text.gray,
    marginBottom: 4,
  },
  mentorStats: {
    flexDirection: 'row',
    gap: 12,
  },
  mentorStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mentorStatText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 12,
    color: COLORS.text.gray,
  },
});

export default SearchResultsScreen; 