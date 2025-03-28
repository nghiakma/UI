import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Share,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Line, Circle, Path } from 'react-native-svg';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const { width, height } = Dimensions.get('window');

// Component for creating the diagonal pattern background
const DiagonalPattern = ({ rotation = 0, opacity = 0.12 }) => {
  const lines = [];
  const spacing = 15;
  const count = 30;
  
  for (let i = -count; i < count; i++) {
    const offset = i * spacing;
    lines.push(
      <Line
        key={`line-${i}`}
        x1={offset}
        y1="0"
        x2={offset + 300}
        y2="300"
        stroke="#335EF7"
        strokeWidth="0.75"
        opacity={0.54}
      />
    );
  }
  
  return (
    <View style={[styles.patternContainer, { opacity, transform: [{ rotate: `${rotation}deg` }] }]}>
      <Svg height="100%" width="100%" viewBox="0 0 300 300">
        {lines}
      </Svg>
    </View>
  );
};

// Certificate border decoration
const BorderDecoration = () => {
  return (
    <View style={styles.borderDecoration}>
      <View style={[styles.cornerDecoration, styles.topLeft]}>
        <MaterialCommunityIcons name="certificate" size={20} color={COLORS.primary} />
      </View>
      <View style={[styles.cornerDecoration, styles.topRight]}>
        <MaterialCommunityIcons name="certificate" size={20} color={COLORS.primary} />
      </View>
      <View style={[styles.cornerDecoration, styles.bottomLeft]}>
        <MaterialCommunityIcons name="certificate" size={20} color={COLORS.primary} />
      </View>
      <View style={[styles.cornerDecoration, styles.bottomRight]}>
        <MaterialCommunityIcons name="certificate" size={20} color={COLORS.primary} />
      </View>
    </View>
  );
};

const CertificateScreen = ({ navigation, route }) => {
  const viewShotRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  const { course, userName = 'Andrew Ainsley' } = route.params || { 
    course: { title: '3D Design Illustration Course' },
    userName: 'Andrew Ainsley'
  };

  // Generate certificate ID
  const certificateId = `SK${Math.floor(100000000 + Math.random() * 900000000)}`;
  
  // Format current date
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric' 
  });

  const handleShare = async () => {
    try {
      if (viewShotRef.current) {
        setIsDownloading(true);
        // Capture the certificate as an image
        const uri = await viewShotRef.current.capture();
        setIsDownloading(false);
        
        // Share the image
        await Share.share({
          message: `I've completed ${course.title} and received my certificate! Certificate ID: ${certificateId}`,
          title: 'My Course Certificate',
          url: uri
        });
      }
    } catch (error) {
      setIsDownloading(false);
      console.error('Error sharing certificate:', error);
      Alert.alert('Error', 'Failed to share certificate. Please try again.');
    }
  };

  const requestPermissions = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermissionGranted(status === 'granted');
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Request permissions if not already granted
      const hasPermission = permissionGranted || await requestPermissions();
      
      if (!hasPermission) {
        setIsDownloading(false);
        Alert.alert(
          'Permission Required',
          'Storage permission is required to save the certificate to your device.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      if (viewShotRef.current) {
        // Capture the certificate as an image
        const uri = await viewShotRef.current.capture();
        
        // Create a unique filename
        const filename = `certificate_${certificateId.replace(/\D/g, '')}_${Date.now()}.png`;
        const fileUri = `${FileSystem.documentDirectory}${filename}`;
        
        // Copy the temporary image to a permanent location
        await FileSystem.copyAsync({
          from: uri,
          to: fileUri
        });
        
        // Save to media library
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync('Certificates', asset, false);
        
        setIsDownloading(false);
        
        Alert.alert(
          'Certificate Downloaded',
          'Your certificate has been saved to your device gallery in the "Certificates" album.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      setIsDownloading(false);
      console.error('Error downloading certificate:', error);
      Alert.alert(
        'Download Error',
        'Failed to download the certificate. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Certificate</Text>
        <TouchableOpacity 
          style={styles.shareButton} 
          onPress={handleShare}
          disabled={isDownloading}
        >
          <Ionicons name="share-outline" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Certificate Content */}
      <View style={styles.certificateWrapper}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'png', quality: 1 }}
            style={styles.viewShot}
          >
            <View style={styles.certificateContainer}>
              {/* Pattern Background */}
              <View style={styles.patternBackground}>
                <DiagonalPattern rotation={0} opacity={0.05} />
                <DiagonalPattern rotation={90} opacity={0.05} />
                <DiagonalPattern rotation={180} opacity={0.05} />
                <DiagonalPattern rotation={270} opacity={0.05} />
              </View>
              
              {/* Decorative border */}
              <BorderDecoration />
              
              <View style={styles.certificateContent}>
                {/* Certificate Logo */}
                <View style={styles.certificateHeader}>
                  <LinearGradient
                    colors={['#335EF7', '#5F82FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.certificateLogo}
                  >
                    <Image 
                      source={require('../assets/images/logo.png')} 
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                  </LinearGradient>
                  <Text style={styles.certificateTitle}>Certificate of Completion</Text>
                  <Text style={styles.certificateSubtitle}>Presented to</Text>
                </View>
                
                {/* User Name */}
                <Text style={styles.userName}>{userName}</Text>
                
                {/* Course Info */}
                <View style={styles.courseInfoContainer}>
                  <Text style={styles.courseCompletion}>For the successful completion of</Text>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.certDetails}>Issued on {issueDate}</Text>
                  <Text style={styles.certDetails}>ID: {certificateId}</Text>
                </View>
                
                {/* Signature */}
                <View style={styles.signatureSection}>
                  <View style={styles.signatureContainer}>
                    <View style={styles.signatureWrapper}>
                      <LinearGradient
                        colors={['#335EF7', '#5F82FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.signature}
                      />
                    </View>
                    <View style={styles.signatureInfo}>
                      <Text style={styles.signatureName}>James Anderson Lawren</Text>
                      <View style={styles.divider} />
                      <Text style={styles.signatureRole}>Elera Courses Manager</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ViewShot>
        </ScrollView>
      </View>
      
      {/* Download Button */}
      <View style={styles.bottomSheet}>
        <TouchableOpacity 
          style={[
            styles.downloadButton,
            isDownloading && styles.downloadButtonDisabled
          ]}
          onPress={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <View style={styles.downloadingContainer}>
              <ActivityIndicator size="small" color={COLORS.white} />
              <Text style={styles.downloadButtonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.downloadButtonText}>Download Certificate</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.gray,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.lg,
    color: COLORS.text.primary,
  },
  shareButton: {
    padding: SPACING.xs,
  },
  certificateWrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.xl,
    paddingBottom: 90,
  },
  certificateContainer: {
    width: '100%',
    minHeight: height - 250, // Ensure it takes up most of the screen height
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(51, 94, 247, 0.1)',
    ...SHADOWS.medium,
  },
  patternBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  borderDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cornerDecoration: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLeft: {
    top: 10,
    left: 10,
  },
  topRight: {
    top: 10,
    right: 10,
  },
  bottomLeft: {
    bottom: 10,
    left: 10,
  },
  bottomRight: {
    bottom: 10,
    right: 10,
  },
  certificateContent: {
    padding: 44,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: height - 254, // Account for border
  },
  certificateHeader: {
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 16,
    marginBottom: 32,
  },
  certificateLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  logoImage: {
    width: 36,
    height: 36,
    tintColor: COLORS.white,
  },
  certificateTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 20,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  certificateSubtitle: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 12,
    color: COLORS.text.gray,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  userName: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 24, // Increased font size
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 32,
  },
  courseInfoContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 16,
    marginBottom: 32,
  },
  courseCompletion: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 12,
    color: COLORS.text.gray,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  courseTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 18,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  certDetails: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 12,
    color: COLORS.text.gray,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  signatureSection: {
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 15,
    marginTop: 'auto', // Push to bottom when space available
    paddingTop: 32,
  },
  signatureContainer: {
    alignItems: 'center',
    width: '100%',
    gap: 15,
  },
  signatureWrapper: {
    width: 80,
    height: 40,
    justifyContent: 'center',
  },
  signature: {
    width: '100%',
    height: 4,
    borderRadius: 2,
  },
  signatureInfo: {
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 8,
  },
  signatureName: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 14,
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  divider: {
    width: 120,
    height: 1,
    backgroundColor: COLORS.background.gray,
  },
  signatureRole: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: 10,
    color: COLORS.text.gray,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 24,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    ...SHADOWS.medium,
  },
  downloadButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    paddingVertical: 18,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  downloadButtonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  viewShot: {
    backgroundColor: 'transparent',
  },
  downloadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  downloadButtonDisabled: {
    opacity: 0.7,
  },
});

export default CertificateScreen; 