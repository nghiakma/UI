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
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const DetailRow = ({ label, value }) => {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
};

const DetailSection = ({ children }) => {
  return (
    <View style={styles.detailSection}>
      {children}
    </View>
  );
};

const ReceiptScreen = ({ route, navigation }) => {
  const { transaction } = route.params || {};
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `E-Receipt for ${transaction.title}\nTransaction ID: ${transaction.transactionId}\nAmount: ${transaction.price}\nDate: ${transaction.date}`,
        title: 'My Transaction Receipt',
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>E-Receipt</Text>
        </View>
        <TouchableOpacity style={styles.moreButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Receipt Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* QR Code */}
        <View style={styles.qrContainer}>
          <Image
            source={require('../assets/images/qr_code.png')}
            style={styles.qrCode}
            resizeMode="contain"
          />
        </View>
        
        {/* Course Details */}
        <DetailSection>
          <DetailRow 
            label="Course"
            value={transaction.title}
          />
          <DetailRow 
            label="Category"
            value={transaction.category}
          />
        </DetailSection>
        
        {/* Customer Details */}
        <DetailSection>
          <DetailRow 
            label="Name"
            value={transaction.userName}
          />
          <DetailRow 
            label="Phone"
            value={transaction.phone}
          />
          <DetailRow 
            label="Email"
            value={transaction.email}
          />
          <DetailRow 
            label="Country"
            value={transaction.country}
          />
        </DetailSection>
        
        {/* Payment Details */}
        <DetailSection>
          <DetailRow 
            label="Price"
            value={transaction.price}
          />
          <DetailRow 
            label="Payment Methods"
            value={transaction.paymentMethod}
          />
          <DetailRow 
            label="Date"
            value={transaction.date}
          />
          <View style={styles.idRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <View style={styles.idContainer}>
              <Text style={styles.detailValue}>{transaction.transactionId}</Text>
              <TouchableOpacity style={styles.copyButton}>
                <Ionicons name="copy-outline" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <View style={styles.statusTag}>
              <Text style={styles.statusText}>{transaction.status}</Text>
            </View>
          </View>
        </DetailSection>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md,
    marginTop: 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 24,
    color: COLORS.text.primary,
  },
  moreButton: {
    padding: SPACING.xs,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.xxxl,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xxl,
  },
  qrCode: {
    width: 400,
    height: 200,
  },
  detailSection: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    marginBottom: SPACING.xl,
    ...SHADOWS.small,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  detailLabel: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 14,
    color: COLORS.text.gray,
    letterSpacing: 0.2,
  },
  detailValue: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 16,
    color: COLORS.text.secondary,
    letterSpacing: 0.2,
    textAlign: 'right',
  },
  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  copyButton: {
    padding: SPACING.xs,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  statusTag: {
    backgroundColor: 'rgba(51, 94, 247, 0.08)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
  },
  statusText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: 10,
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
});

export default ReceiptScreen; 