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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

// Sample transaction data
const TRANSACTIONS = [
  {
    id: '1',
    title: 'Mastering Figma A to Z',
    image: require('../assets/images/course_image_1.jpg'),
    status: 'Paid',
    transactionId: 'SK7263727399',
    category: 'UI/UX Design',
    userName: 'Andrew Ainsley',
    phone: '+1 111 467 378 399',
    email: 'andrew_ainsley@domain.com',
    country: 'United States',
    price: '$40.00',
    paymentMethod: 'Credit Card',
    date: 'Dec 14, 2024 | 14:27:45 PM',
  },
  {
    id: '2',
    title: 'Mastering Blender 3D',
    image: require('../assets/images/course_image_1.jpg'),
    status: 'Paid',
    transactionId: 'SK7263727400',
    category: '3D Design',
    userName: 'Andrew Ainsley',
    phone: '+1 111 467 378 399',
    email: 'andrew_ainsley@domain.com',
    country: 'United States',
    price: '$45.00',
    paymentMethod: 'PayPal',
    date: 'Dec 10, 2024 | 09:15:32 AM',
  },
  {
    id: '3',
    title: 'Build Personal Branding',
    image: require('../assets/images/course_image_1.jpg'),
    status: 'Paid',
    transactionId: 'SK7263727401',
    category: 'Marketing',
    userName: 'Andrew Ainsley',
    phone: '+1 111 467 378 399',
    email: 'andrew_ainsley@domain.com',
    country: 'United States',
    price: '$35.00',
    paymentMethod: 'Credit Card',
    date: 'Dec 5, 2024 | 16:42:18 PM',
  },
  {
    id: '4',
    title: 'Complete UI Designer',
    image: require('../assets/images/course_image_1.jpg'),
    status: 'Paid',
    transactionId: 'SK7263727402',
    category: 'UI/UX Design',
    userName: 'Andrew Ainsley',
    phone: '+1 111 467 378 399',
    email: 'andrew_ainsley@domain.com',
    country: 'United States',
    price: '$50.00',
    paymentMethod: 'Apple Pay',
    date: 'Nov 28, 2024 | 11:05:59 AM',
  },
  {
    id: '5',
    title: 'Full-Stack Web Developer',
    image: require('../assets/images/course_image_1.jpg'),
    status: 'Paid',
    transactionId: 'SK7263727403',
    category: 'Web Development',
    userName: 'Andrew Ainsley',
    phone: '+1 111 467 378 399',
    email: 'andrew_ainsley@domain.com',
    country: 'United States',
    price: '$55.00',
    paymentMethod: 'Google Pay',
    date: 'Nov 20, 2024 | 13:27:41 PM',
  },
];

const TransactionItem = ({ transaction, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => onPress(transaction)}
    >
      <View style={styles.imageContainer}>
        <Image source={transaction.image} style={styles.courseImage} />
      </View>
      <View style={styles.transactionInfo}>
        <View>
          <Text style={styles.courseTitle}>{transaction.title}</Text>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>{transaction.status}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.receiptButton}
          onPress={() => onPress(transaction)}>
          <Text style={styles.receiptButtonText}>E-Receipt</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const TransactionsScreen = ({ navigation }) => {
  
  const handleTransactionPress = (transaction) => {
    navigation.navigate('ReceiptScreen', { transaction });
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
          <Text style={styles.headerTitle}>Transactions</Text>
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
      
      {/* Transaction List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.transactionList}>
          {TRANSACTIONS.map(transaction => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction} 
              onPress={handleTransactionPress}
            />
          ))}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  transactionList: {
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md,
    gap: SPACING.xl,
  },
  transactionItem: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl,
    flexDirection: 'row',
    padding: SPACING.xl,
    gap: SPACING.xl,
    ...SHADOWS.xl,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    marginRight: SPACING.lg,
  },
  courseImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  transactionInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  courseTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 18,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    flexWrap: 'wrap'
  },
  tagContainer: {
    backgroundColor: 'rgba(51, 94, 247, 0.08)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
    alignSelf: 'flex-start',
    marginTop: 5
  },
  tagText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 10,
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
  receiptButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-end',
  },
  receiptButtonText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 14,
    color: COLORS.white,
    letterSpacing: 0.2,
  },
});

export default TransactionsScreen; 