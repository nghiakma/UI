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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../constants/theme';

export const CATEGORIES = [
    { id: '1', label: '🔥 All' },
    { id: '2', label: '💡 3D Design' },
    { id: '3', label: '💰 Business' },
    { id: '4', label: '🎨 UI/UX Design' },
    { id: '5', label: '🎨 Entrepreneurship' }
];

export const PRICES = [
  { id: '1', label: '$0 - $20', min: 0, max: 20 },
  { id: '2', label: '$21 - $50', min: 21, max: 50 },
  { id: '3', label: '$51 - $100', min: 51, max: 100 },
  { id: '4', label: '$100+', min: 100, max: Infinity }
];

export const RATINGS = [
  { id: '1', label: '4.5 & up', value: 4.5 },
  { id: '2', label: '4.0 & up', value: 4.0 },
  { id: '3', label: '3.5 & up', value: 3.5 },
  { id: '4', label: '3.0 & up', value: 3.0 },
];

const AdvancedSearchScreen = ({ navigation, route }) => {
  const initialFilters = route.params?.filters || {};
  const [searchText, setSearchText] = useState(route.params?.query || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || '1');
  const [selectedPrice, setSelectedPrice] = useState(initialFilters.price || '');
  const [selectedRating, setSelectedRating] = useState(initialFilters.rating || '');

  const handleSearch = () => {
    const filters = {
      category: selectedCategory,
      price: selectedPrice,
      rating: selectedRating,
    };

    if (route.params?.onApply) {
      route.params.onApply(filters);
    } else {
      navigation.navigate('SearchResults', {
        query: searchText,
        filters: filters,
      });
    }
  };

  const handleReset = () => {
    setSearchText('');
    setSelectedCategory('1');
    setSelectedPrice('');
    setSelectedRating('');
  };

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
          <Text style={styles.title}>Advanced Search</Text>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons
                name="search-outline"
                size={24}
                color={COLORS.text.gray}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search course"
                placeholderTextColor={COLORS.text.gray}
                value={searchText}
                onChangeText={setSearchText}
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
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.optionsGrid}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.optionButton,
                    selectedCategory === category.id && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedCategory === category.id && styles.optionTextSelected,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price</Text>
            <View style={styles.optionsGrid}>
              {PRICES.map((price) => (
                <TouchableOpacity
                  key={price.id}
                  style={[
                    styles.optionButton,
                    selectedPrice === price.id && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSelectedPrice(price.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedPrice === price.id && styles.optionTextSelected,
                    ]}
                  >
                    {price.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rating</Text>
            <View style={styles.optionsGrid}>
              {RATINGS.map((rating) => (
                <TouchableOpacity
                  key={rating.id}
                  style={[
                    styles.optionButton,
                    selectedRating === rating.id && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSelectedRating(rating.id)}
                >
                  <View style={styles.ratingOption}>
                    <Text
                      style={[
                        styles.optionText,
                        selectedRating === rating.id && styles.optionTextSelected,
                      ]}
                    >
                      {rating.label}
                    </Text>
                    <Ionicons
                      name="star"
                      size={16}
                      color={selectedRating === rating.id ? COLORS.white : COLORS.secondary}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleSearch}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  scrollContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    padding: 24,
  },
  searchInputContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
    backgroundColor: COLORS.background.gray,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.urbanist.medium,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: COLORS.text.primary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 20,
    lineHeight: 24,
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.default,
    backgroundColor: COLORS.white,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 14,
    lineHeight: 19.6,
    letterSpacing: 0.2,
    color: COLORS.text.primary,
  },
  optionTextSelected: {
    color: COLORS.white,
  },
  ratingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.default,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(4, 6, 15, 0.05)',
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 1,
        shadowRadius: 60,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  resetButton: {
    flex: 1,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  resetButtonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: COLORS.primary,
  },
  applyButton: {
    flex: 1,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  applyButtonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: COLORS.white,
  },
});

export default AdvancedSearchScreen; 