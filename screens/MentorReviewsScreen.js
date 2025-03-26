import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import Avatar from '../components/Avatar';

// Demo data for reviews

const ReviewItem = ({ review, onLike, onReply }) => {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <Avatar source={review.avatar} size={48} />
          <View style={styles.reviewerDetails}>
            <Text style={styles.reviewerName}>{review.name}</Text>
            <View style={styles.ratingRow}>
              <View style={styles.starsContainer}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons 
                    key={i} 
                    name={i < review.rating ? "star" : "star-outline"} 
                    size={16} 
                    color={COLORS.secondary} 
                  />
                ))}
              </View>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.text.gray} />
        </TouchableOpacity>
      </View>
      <Text style={styles.reviewText}>{review.review}</Text>
      {/* <View style={styles.reviewActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onLike(review.id)}
        >
          <Ionicons 
            name={review.isLiked ? "heart" : "heart-outline"} 
            size={20} 
            color={review.isLiked ? COLORS.primary : COLORS.text.gray} 
          />
          <Text 
            style={[
              styles.actionText, 
              review.isLiked && { color: COLORS.primary }
            ]}
          >
            {review.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onReply(review.id)}
        >
          <Ionicons name="chatbubble-outline" size={20} color={COLORS.text.gray} />
          <Text style={styles.actionText}>{review.replies}</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const MentorReviewsScreen = ({ navigation, route }) => {
  // Get reviews from navigation params or use default data
  const passedReviews = route.params?.reviews || REVIEWS;
  const [reviews, setReviews] = useState(passedReviews);
  const [sortBy, setSortBy] = useState('Recent');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Sort reviews based on selected filter
  const getSortedReviews = () => {
    // Filter by search text first
    const filteredReviews = reviews.filter(review => 
      review.name.toLowerCase().includes(searchText.toLowerCase()) ||
      review.review.toLowerCase().includes(searchText.toLowerCase())
    );
    
    // Then sort based on selected sort option
    switch(sortBy) {
      case 'Highest':
        return [...filteredReviews].sort((a, b) => b.rating - a.rating);
      case 'Lowest':
        return [...filteredReviews].sort((a, b) => a.rating - b.rating);
      case 'Recent':
      default:
        // Assume reviews are already in reverse chronological order (recent first)
        return filteredReviews;
    }
  };

  // const handleLike = (reviewId) => {
  //   setReviews(reviews.map(review => {
  //     if (review.id === reviewId) {
  //       const isLiked = !review.isLiked;
  //       return {
  //         ...review,
  //         isLiked,
  //         likes: isLiked ? review.likes + 1 : review.likes - 1,
  //       };
  //     }
  //     return review;
  //   }));
  // };

  // const handleReply = (reviewId) => {
  //   // Handle reply functionality
  //   console.log(`Reply to review ${reviewId}`);
  // };

  // Get sorted and filtered reviews
  const sortedReviews = getSortedReviews();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Reviews</Text>
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setIsFilterVisible(!isFilterVisible)}
          >
            <Ionicons name="options-outline" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={24} color={COLORS.text.lightGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reviews"
            placeholderTextColor={COLORS.text.lightGray}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Filter Options */}
        {isFilterVisible && (
          <View style={styles.filterOptions}>
            <Text style={styles.filterTitle}>Sort by</Text>
            <View style={styles.filterButtons}>
              {['Recent', 'Highest', 'Lowest'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.sortButton,
                    sortBy === option && styles.activeSortButton,
                  ]}
                  onPress={() => setSortBy(option)}
                >
                  {option === 'Highest' && (
                    <Ionicons 
                      name="arrow-up" 
                      size={16} 
                      color={sortBy === option ? COLORS.white : COLORS.primary} 
                      style={styles.sortIcon}
                    />
                  )}
                  {option === 'Lowest' && (
                    <Ionicons 
                      name="arrow-down" 
                      size={16} 
                      color={sortBy === option ? COLORS.white : COLORS.primary} 
                      style={styles.sortIcon}
                    />
                  )}
                  {option === 'Recent' && (
                    <Ionicons 
                      name="time-outline" 
                      size={16} 
                      color={sortBy === option ? COLORS.white : COLORS.primary} 
                      style={styles.sortIcon}
                    />
                  )}
                  <Text
                    style={[
                      styles.sortButtonText,
                      sortBy === option && styles.activeSortButtonText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Sort status message */}
        {(sortBy !== 'Recent' || searchText.length > 0) && (
          <View style={styles.sortStatusContainer}>
            <Text style={styles.sortStatusText}>
              {sortBy === 'Recent' && searchText.length > 0 && 'Showing filtered reviews'}
              {sortBy === 'Highest' && 'Showing highest rated reviews first'}
              {sortBy === 'Lowest' && 'Showing lowest rated reviews first'}
            </Text>
            {searchText.length > 0 && (
              <Text style={styles.searchResultText}>
                Search: "{searchText}"
              </Text>
            )}
          </View>
        )}

        {/* Reviews List */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Reviews stats */}
          <View style={styles.reviewStats}>
            <View style={styles.reviewRatingContainer}>
              <Text style={styles.averageRating}>
                {(sortedReviews.reduce((acc, review) => acc + review.rating, 0) / sortedReviews.length).toFixed(1)}
              </Text>
              <View style={styles.starsContainer}>
                {[...Array(5)].map((_, i) => {
                  const rating = sortedReviews.reduce((acc, review) => acc + review.rating, 0) / sortedReviews.length;
                  return (
                    <Ionicons 
                      key={i} 
                      name={i < Math.round(rating) ? "star" : "star-outline"} 
                      size={16} 
                      color={COLORS.secondary} 
                    />
                  );
                })}
              </View>
              <Text style={styles.totalReviews}>
                Based on {sortedReviews.length} reviews
              </Text>
            </View>
          </View>

          {/* Reviews list */}
          {sortedReviews.map(review => (
            <ReviewItem
              key={review.id}
              review={review}
              // onLike={handleLike}
              // onReply={handleReply}
            />
          ))}
          
          {sortedReviews.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reviews found</Text>
            </View>
          )}
        </ScrollView>
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
    paddingTop: 60, // Status bar height
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  backButton: {
    padding: SPACING.xs,
  },
  title: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.h1,
    color: COLORS.text.primary,
  },
  filterButton: {
    padding: SPACING.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.gray,
    marginHorizontal: SPACING.xxxl,
    marginVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.medium,
    height: 56,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md,
    color: COLORS.text.primary,
    paddingHorizontal: SPACING.md,
  },
  filterOptions: {
    paddingHorizontal: SPACING.xxxl,
    paddingBottom: SPACING.xl,
  },
  filterTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.lg,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  activeSortButton: {
    backgroundColor: COLORS.primary,
  },
  sortButtonText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.md,
    color: COLORS.primary,
  },
  activeSortButtonText: {
    color: COLORS.white,
  },
  sortIcon: {
    marginRight: SPACING.xs,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.xl,
    gap: SPACING.xl,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xl,
    gap: SPACING.lg,
    ...SHADOWS.small,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reviewerInfo: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'center',
  },
  reviewerDetails: {
    gap: SPACING.xs,
  },
  reviewerName: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.lg,
    lineHeight: SIZES.lg * 1.2,
    color: COLORS.text.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.sm,
    color: COLORS.text.lightGray,
  },
  moreButton: {
    padding: SPACING.xs,
  },
  reviewText: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: SIZES.md,
    lineHeight: SIZES.md * 1.6,
    color: COLORS.text.secondary,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: SPACING.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.sm,
    color: COLORS.text.gray,
  },
  sortStatusContainer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background.lightBlue,
    borderRadius: BORDER_RADIUS.medium,
    marginHorizontal: SPACING.xxxl,
    marginBottom: SPACING.md,
  },
  sortStatusText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.primary,
  },
  searchResultText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.sm,
    color: COLORS.text.gray,
    marginTop: SPACING.xs,
  },
  reviewStats: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  reviewRatingContainer: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  averageRating: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.h1,
    color: COLORS.text.primary,
  },
  totalReviews: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.sm,
    color: COLORS.text.gray,
    marginTop: SPACING.xs,
  },
  emptyContainer: {
    paddingVertical: SPACING.section,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md,
    color: COLORS.text.lightGray,
  },
});

export default MentorReviewsScreen; 