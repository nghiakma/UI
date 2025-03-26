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
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';

const RECENT_SEARCHES = [
  'UI/UX Design',
  'Flutter Development',
  '3D Animation',
  'Digital Marketing',
];

const POPULAR_SEARCHES = [
  'Business Analysis',
  'Graphic Design',
  'Python Programming',
  'Web Development',
  'Digital Marketing',
  'Data Science',
];

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (searchText.trim()) {
      // Add search text to recent searches if not already present
      if (!RECENT_SEARCHES.includes(searchText.trim())) {
        RECENT_SEARCHES.unshift(searchText.trim());
        if (RECENT_SEARCHES.length > 4) {
          RECENT_SEARCHES.pop();
        }
      }
      navigation.navigate('SearchResults', { 
        query: searchText.trim(),
        filters: {} 
      });
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
    Keyboard.dismiss();
  };

  const handleRemoveRecentSearch = (searchToRemove) => {
    const index = RECENT_SEARCHES.indexOf(searchToRemove);
    if (index > -1) {
      RECENT_SEARCHES.splice(index, 1);
      // Force re-render
      setSearchText(searchText);
    }
  };

  const handleClearAllRecent = () => {
    RECENT_SEARCHES.length = 0;
    // Force re-render
    setSearchText(searchText);
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
          <Text style={styles.title}>Search</Text>
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
              placeholder="Search course"
              placeholderTextColor={COLORS.text.gray}
              value={searchText}
              onChangeText={setSearchText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoFocus={true}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
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
            onPress={() => navigation.navigate('AdvancedSearch')}
          >
            <Ionicons
              name="options-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Recent Searches */}
          {RECENT_SEARCHES.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={handleClearAllRecent}>
                  <Text style={styles.clearAll}>Clear All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tagsContainer}>
                {RECENT_SEARCHES.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tag}
                    onPress={() => {
                      setSearchText(search);
                      handleSearch();
                    }}
                  >
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={COLORS.text.gray}
                    />
                    <Text style={styles.tagText}>{search}</Text>
                    <TouchableOpacity onPress={() => handleRemoveRecentSearch(search)}>
                      <Ionicons
                        name="close"
                        size={20}
                        color={COLORS.text.gray}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Popular Searches */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
            <View style={styles.tagsContainer}>
              {POPULAR_SEARCHES.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.tag, styles.popularTag]}
                  onPress={() => {
                    setSearchText(search);
                    handleSearch();
                  }}
                >
                  <Ionicons
                    name="trending-up"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={[styles.tagText, styles.popularTagText]}>
                    {search}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
    marginTop: 30
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
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 20,
    lineHeight: 24,
    color: COLORS.text.primary,
    paddingBottom: 10
  },
  clearAll: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 14,
    lineHeight: 19.6,
    letterSpacing: 0.2,
    color: COLORS.primary,
    paddingBottom: 10
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background.gray,
    borderRadius: 8,
  },
  popularTag: {
    backgroundColor: 'rgba(51, 94, 247, 0.08)',
  },
  tagText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 14,
    lineHeight: 19.6,
    letterSpacing: 0.2,
    color: COLORS.text.gray,
  },
  popularTagText: {
    color: COLORS.primary,
  },
});

export default SearchScreen; 