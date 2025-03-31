import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  FlatList,
  SectionList,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import {
  COLORS,
  FONTS,
  SIZES,
  SPACING,
  BORDER_RADIUS,
  SHADOWS
} from '../constants/theme';
import { COURSES } from './HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const TABS = ['Content', 'Notes', 'Resources', 'Quiz', 'Q&A'];

// --- Note Modal Component ---
const NoteModal = ({ visible, onClose, onSave, note }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const isEditing = note?.id;

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your note.');
      return;
    }
    onSave({ ...(note || {}), title, content });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade" // Softer animation
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          {/* Added TouchableOpacity to close modal on overlay tap */}
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
          <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{isEditing ? 'Edit Note' : 'Create New Note'}</Text>
              <TextInput
                  style={styles.modalInput}
                  placeholder="Note Title"
                  placeholderTextColor={COLORS.text.lightGray}
                  value={title}
                  onChangeText={setTitle}
              />
              <TextInput
                  style={[styles.modalInput, styles.modalContentInput]}
                  placeholder="Note Content..."
                  placeholderTextColor={COLORS.text.lightGray}
                  value={content}
                  onChangeText={setContent}
                  multiline
                  textAlignVertical="top"
              />
              <View style={styles.modalButtonContainer}>
                  <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSave}>
                      <Text style={styles.saveButtonText}>Save Note</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
// --- End Note Modal ---

// --- Main Lesson Detail Screen --- 
const LessonDetailScreen = ({ navigation, route }) => {
  const { courseId, lessonId, courseTitle } = route.params;

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(-1);
  const [allLessons, setAllLessons] = useState([]);
  const [activeTab, setActiveTab] = useState('Content');
  
  const [notes, setNotes] = useState([]); 
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  
  const videoRef = useRef(null);
  const [videoStatus, setVideoStatus] = useState({});
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  // --- State for Lesson List Modal ---
  const [isLessonListVisible, setIsLessonListVisible] = useState(false);

  // --- State for Quiz --- 
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null); // Will store { score, total, results: [...] }
  
  // State for discussion (placeholders)
  const [discussionMessages, setDiscussionMessages] = useState([]); // Placeholder
  const [newMessage, setNewMessage] = useState('');

  // Add state variables for Q&A
  const [qaItems, setQaItems] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Add state for Q&A all questions modal
  const [isQAAllModalVisible, setIsQAAllModalVisible] = useState(false);
  const [qaFilter, setQaFilter] = useState('all'); // 'all', 'answered', 'unanswered'

  // Add state for keyboard visibility
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Add a new state for showing all answers for a specific question
  const [viewingAnswersFor, setViewingAnswersFor] = useState(null);

  // Find course and lessons data
  useEffect(() => {
    const foundCourse = COURSES.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      const lessons = foundCourse.lessons.sections.flatMap(section => section.lessons);
      setAllLessons(lessons);
      
      const lessonIndex = lessons.findIndex(l => l.id === lessonId);
      if (lessonIndex !== -1) {
        setCurrentLessonIndex(lessonIndex);
        setCurrentLesson(lessons[lessonIndex]);
        loadNotes(foundCourse.id, lessons[lessonIndex].id); // Load notes for this lesson
      } else {
        Alert.alert('Error', 'Lesson not found.');
        navigation.goBack();
      }
    } else {
      Alert.alert('Error', 'Course not found.');
      navigation.goBack();
    }
  }, [courseId, lessonId]);

  // Load notes from AsyncStorage
  const loadNotes = async (cId, lId) => {
    try {
      const savedNotesString = await AsyncStorage.getItem(`@lesson_notes_array_${cId}_${lId}`);
      if (savedNotesString !== null) {
        const savedNotesArray = JSON.parse(savedNotesString); // Parse the array
        setNotes(savedNotesArray);
      } else {
        setNotes([]); // Ensure it's an empty array if nothing is saved
      }
    } catch (e) {
      console.error('Failed to load notes.', e);
      setNotes([]); // Reset to empty array on error
      Alert.alert('Error', 'Could not load saved notes.');
    }
  };

  // Save notes to AsyncStorage
  const saveNotesToStorage = async (updatedNotes) => {
    try {
      if (course && currentLesson) {
        const key = `@lesson_notes_array_${course.id}_${currentLesson.id}`;
        await AsyncStorage.setItem(key, JSON.stringify(updatedNotes)); // Stringify the array
      }
    } catch (e) {
      console.error('Failed to save notes.', e);
      Alert.alert('Error', 'Could not save notes.');
    }
  };

  // Handle opening the modal for adding a new note
  const handleAddNote = () => {
    setEditingNote(null); // Clear editing state
    setIsNoteModalVisible(true);
  };

  // Handle opening the modal for editing an existing note
  const handleEditNote = (noteToEdit) => {
    setEditingNote(noteToEdit);
    setIsNoteModalVisible(true);
  };

  // Handle saving from the modal (Create or Update)
  const handleSaveNote = (noteToSave) => {
    let updatedNotes = [];
    if (noteToSave.id) { // Existing note - Update
      updatedNotes = notes.map(note => 
        note.id === noteToSave.id ? noteToSave : note
      );
    } else { // New note - Add
      const newNote = { 
        ...noteToSave, 
        id: Date.now().toString() // Simple unique ID
      };
      updatedNotes = [...notes, newNote];
    }
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
    setIsNoteModalVisible(false);
    setEditingNote(null);
  };

  // Handle deleting a note
  const handleDeleteNote = (noteIdToDelete) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            const updatedNotes = notes.filter(note => note.id !== noteIdToDelete);
            setNotes(updatedNotes);
            saveNotesToStorage(updatedNotes);
          }
        }
      ]
    );
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextLessonIndex = currentLessonIndex + 1;
      const nextLesson = allLessons[nextLessonIndex];
      navigation.replace('LessonDetail', { 
        courseId: courseId, 
        lessonId: nextLesson.id,
        courseTitle: courseTitle
      });
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLessonIndex = currentLessonIndex - 1;
      const prevLesson = allLessons[prevLessonIndex];
      navigation.replace('LessonDetail', { 
        courseId: courseId, 
        lessonId: prevLesson.id,
        courseTitle: courseTitle
      });
    }
  };

  const handleResourcePress = (resource) => {
    if (resource.url && resource.url !== '#') {
      Linking.openURL(resource.url).catch(err => {
        console.error("Failed to open URL:", err);
        Alert.alert("Error", "Could not open the resource link.");
      });
    } else {
      Alert.alert("No Link", "This resource does not have a valid link.");
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return 'document-text-outline';
      case 'doc':
      case 'docx': return 'document-outline';
      case 'video': return 'videocam-outline';
      case 'link': return 'link-outline';
      default: return 'document-attach-outline';
    }
  };

  // --- Lesson List Modal Handlers (using standard modal state) ---
  const openLessonList = () => setIsLessonListVisible(true);
  const closeLessonList = () => setIsLessonListVisible(false);
  const handleSelectLesson = (lesson) => {
    if (lesson.id !== currentLesson?.id && (course?.isEnrolled && !lesson.isLocked)) {
        closeLessonList(); 
        navigation.replace('LessonDetail', { 
           courseId: courseId, 
           lessonId: lesson.id,
           courseTitle: courseTitle
        });
    } else if (!course?.isEnrolled) {
        Alert.alert("Enrollment Required", "Please enroll to access this lesson.");
    } else if (lesson.isLocked) {
        Alert.alert("Lesson Locked", "Complete previous lessons first.");
    }
    // Close the list even if navigation doesn't happen for locked/unenrolled lessons
    else if (lesson.id !== currentLesson?.id) { 
        closeLessonList();
    }
  };

  // Prepare sections for SectionList in the modal
  const lessonSections = useMemo(() => {
    return course?.lessons?.sections?.map(section => ({
      title: section.title,
      data: section.lessons,
    })) || [];
  }, [course]);

  // Placeholder effect for loading discussion (replace with real API call)
  useEffect(() => {
    if (currentLesson?.discussionId) {
      console.log("Fetching discussion for:", currentLesson.discussionId);
      // Simulate fetching messages
      setDiscussionMessages([
        { id: 'm1', user: 'Alice', avatar: 'https://picsum.photos/seed/alice/50/50', text: 'Great intro!'},
        { id: 'm2', user: 'Bob', avatar: 'https://picsum.photos/seed/bob/50/50', text: 'Found the resource link helpful.' },
      ]);
    } else {
        setDiscussionMessages([]);
    }
    // Reset quiz state when lesson changes
    setIsQuizModalVisible(false);
    setQuizAnswers({});
    setQuizScore(null);

    // Load Q&A data for this lesson
    if (currentLesson?.id) {
      // This would be an API call in a real app
      // For now, let's simulate loading Q&A data
      setQaItems([
        {
          id: 'q1',
          userId: 'user123',
          userName: 'John Doe',
          avatar: 'https://picsum.photos/seed/user1/50/50',
          question: 'How does this technique apply to chronic conditions?',
          timestamp: '2 days ago',
          answers: [
            {
              id: 'a1',
              userId: 'instructor',
              userName: 'Dr. Smith',
              avatar: 'https://picsum.photos/seed/instructor/50/50',
              text: 'Great question! This technique has shown positive results for many chronic conditions. The key is consistency and proper form.',
              timestamp: '1 day ago',
              isInstructor: true
            }
          ]
        },
        {
          id: 'q2',
          userId: 'user456',
          userName: 'Jane Brown',
          avatar: 'https://picsum.photos/seed/user2/50/50',
          question: 'Is it necessary to complete all exercises in one session?',
          timestamp: '3 days ago',
          answers: []
        }
      ]);
    }
  }, [currentLesson]); 

  // Placeholder for handling quiz answer selection
  const handleSelectAnswer = (questionId, option) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  // Placeholder for submitting quiz
  const handleSubmitQuiz = () => {
    let score = 0;
    const results = [];
    currentLesson.quiz.forEach(q => {
       const userAnswer = quizAnswers[q.id]; // Get user's answer
       const isCorrect = userAnswer === q.correctAnswer;
       if (isCorrect) {
           score++;
       }
       results.push({
           id: q.id,
           question: q.question,
           options: q.options,
           userAnswer: userAnswer,
           correctAnswer: q.correctAnswer,
           isCorrect: isCorrect,
       });
    });
    const totalQuestions = currentLesson.quiz.length;
    setQuizScore({ score, total: totalQuestions, results }); // Store detailed results
  };

  // Add handlers for Q&A functionality
  const handlePostQuestion = () => {
    if (!newQuestion.trim()) return;
    
    const newQuestionItem = {
      id: `q${Date.now()}`,
      userId: 'currentUser', // In a real app, this would be the current user's ID
      userName: 'You',
      avatar: 'https://picsum.photos/seed/you/50/50',
      question: newQuestion,
      timestamp: 'Just now',
      answers: []
    };
    
    setQaItems(prev => [newQuestionItem, ...prev]);
    setNewQuestion('');
  };
  
  const replyInputRef = useRef(null);
  
  // Update handleStartReply to be more aggressive with focusing
  const handleStartReply = (questionId) => {
    setReplyingTo(questionId);
    setReplyText('');
    
    // More aggressive approach to ensure keyboard shows
    setTimeout(() => {
      if (replyInputRef.current) {
        replyInputRef.current.focus();
      }
    }, 200); // Longer delay to ensure component is fully rendered
  };
  
  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };
  
  const handlePostReply = () => {
    if (!replyText.trim() || !replyingTo) return;
    
    const newAnswer = {
      id: `a${Date.now()}`,
      userId: 'currentUser',
      userName: 'You',
      avatar: 'https://picsum.photos/seed/you/50/50',
      text: replyText,
      timestamp: 'Just now'
    };
    
    setQaItems(prev => prev.map(item => {
      if (item.id === replyingTo) {
        return {
          ...item,
          answers: [...item.answers, newAnswer]
        };
      }
      return item;
    }));
    
    setReplyingTo(null);
    setReplyText('');
  };

  // Add function to filter Q&A items
  const getFilteredQAItems = useCallback((filter) => {
    switch(filter) {
      case 'answered':
        return qaItems.filter(item => item.answers.length > 0);
      default:
        return qaItems;
    }
  }, [qaItems]);

  // Thêm Keyboard Listeners trong useEffect
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (!course || !currentLesson) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  // Render item for the notes FlatList (Card Style)
  const renderNoteItem = ({ item }) => (
    <View style={styles.noteItemContainer}>
      <View style={styles.noteContent}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        {item.content ? (
             <Text style={styles.noteSnippet} numberOfLines={3}>{item.content}</Text>
         ) : (
             <Text style={styles.noteSnippetItalic}>No content.</Text>
         )}
      </View>
      <View style={styles.noteActions}>
        <TouchableOpacity onPress={() => handleEditNote(item)} style={styles.noteActionButton}>
           <Ionicons name="pencil" size={20} color={COLORS.primary} />
        </TouchableOpacity>
         <TouchableOpacity onPress={() => handleDeleteNote(item.id)} style={styles.noteActionButton}>
           <Ionicons name="trash-bin-outline" size={20} color={COLORS.primary} />
         </TouchableOpacity>
      </View>
    </View>
  );

  // Render items for the Lesson List Modal SectionList
  const renderLessonListItem = ({ item }) => {
    const isCurrent = item.id === currentLesson.id;
    const isAccessible = course?.isEnrolled && !item.isLocked;
    return (
      <TouchableOpacity 
        style={[styles.modalLessonItem, isCurrent && styles.modalCurrentLessonItem]}
        onPress={() => handleSelectLesson(item)}
        // Disable tapping current, or locked/unenrolled lessons directly
        disabled={isCurrent || !isAccessible} 
      >
        <View style={[styles.modalLessonNumberContainer, isCurrent && styles.modalCurrentLessonNumberContainer]}>
          <Text style={[styles.modalLessonNumber, isCurrent && styles.modalCurrentLessonNumber]}>{item.number}</Text>
        </View>
        <View style={styles.modalLessonDetails}>
           <Text style={[styles.modalLessonTitle, !isAccessible && styles.modalLessonTitleLocked]} numberOfLines={1}>{item.title}</Text>
           <Text style={[styles.modalLessonDuration, !isAccessible && styles.modalLessonDurationLocked]}>{item.duration}</Text>
        </View>
        {/* Show icon based on state */}
        {isCurrent ? (
            <Ionicons name="play-circle" size={28} color={COLORS.primary} />
        ) : isAccessible ? (
             <Ionicons name="play-circle-outline" size={28} color={COLORS.primary + '99'} /> // Slightly faded play icon
        ) : (
             <Ionicons name="lock-closed" size={24} color={COLORS.text.lightGray} /> // Solid lock
        )}
      </TouchableOpacity>
    );
  };

  const renderLessonListSectionHeader = ({ section: { title } }) => (
    <View style={styles.modalSectionHeader}>
      <Text style={styles.modalSectionHeaderText}>{title}</Text>
    </View>
  );

  // Render Quiz Question Item (Adapts for Quiz Taking and Review)
  const renderQuizQuestion = ({ item: questionData, reviewMode = false }) => {
    const question = reviewMode ? questionData : questionData; // In review, item is the result object
    const userAnswer = reviewMode ? questionData.userAnswer : quizAnswers[question.id];
    const isCorrect = reviewMode ? questionData.isCorrect : null;
    const correctAnswer = reviewMode ? questionData.correctAnswer : null;

    return (
      <View style={[
        styles.quizQuestionContainer, 
        reviewMode && !isCorrect && styles.quizQuestionIncorrect
      ]}>
          <View style={styles.quizQuestionHeader}>
              <Text style={styles.quizQuestionText}>{question.question}</Text>
          </View>
          <View style={styles.quizOptionsContainer}>
              {question.options.map((option, index) => {
                  const isSelected = userAnswer === option;
                  const isCorrectOption = correctAnswer === option;

                  let optionStyle = [styles.quizOptionButton];
                  let iconName = 'radio-button-off';
                  let iconColor = COLORS.text.secondary;
                  let textStyle = [styles.quizOptionText];

                  if (reviewMode) {
                      if (isCorrectOption) {
                          optionStyle.push(styles.quizOptionCorrect);
                          iconName = 'checkmark-circle';
                          iconColor = COLORS.success;
                          textStyle.push(styles.quizOptionTextCorrect);
                      } else if (isSelected && !isCorrect) {
                          optionStyle.push(styles.quizOptionIncorrectSelected);
                          iconName = 'close-circle';
                          iconColor = COLORS.error;
                          textStyle.push(styles.quizOptionTextIncorrect);
                      }
                  } else { // Quiz taking mode
                      if (isSelected) {
                          optionStyle.push(styles.quizOptionSelected);
                          iconName = 'radio-button-on';
                          iconColor = COLORS.primary;
                          textStyle.push(styles.quizOptionTextSelected);
                      }
                  }

                  return (
                      <TouchableOpacity
                          key={index}
                          style={optionStyle}
                          onPress={() => !reviewMode && handleSelectAnswer(question.id, option)}
                          disabled={reviewMode}
                          activeOpacity={0.8}
                      >
                          <Ionicons
                              name={iconName}
                              size={22}
                              color={iconColor}
                              style={styles.quizOptionIcon}
                          />
                          <Text style={textStyle}>{option}</Text>
                      </TouchableOpacity>
                  );
              })}
          </View>
          {reviewMode && !isCorrect && userAnswer && (
              <View style={styles.correctAnswerContainer}>
                  <Text style={styles.correctAnswerText}>Correct answer: {correctAnswer}</Text>
              </View>
          )}
          {reviewMode && !userAnswer && (
              <View style={styles.correctAnswerContainer}>
                  <Text style={styles.correctAnswerText}>You didn't answer. Correct answer: {correctAnswer}</Text>
              </View>
          )}
      </View>
    );
  };

  // Update the renderQaItem function to ensure the TextInput gets proper focus
  const renderQaItem = ({ item }) => (
    <View style={styles.qaItemCard}>
      <View style={styles.qaItemHeader}>
        <Image source={{ uri: item.avatar }} style={styles.qaAvatar} />
        <View style={styles.qaUserInfo}>
          <Text style={styles.qaUserName}>{item.userName}</Text>
          <Text style={styles.qaTimestamp}>{item.timestamp}</Text>
        </View>
        <View style={[styles.qaStatusBadge, item.answers.length === 0 && styles.qaStatusPending]}>
          {item.answers.length > 0 ? (
            <>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.qaStatusText}>Answered</Text>
            </>
          ) : (
            <>
              <Ionicons name="time-outline" size={16} color={COLORS.primary} />
              <Text style={[styles.qaStatusText, styles.qaStatusTextPending]}>New</Text>
            </>
          )}
        </View>
      </View>
      
      <View style={styles.qaContentContainer}>
        <Text style={styles.qaQuestion}>{item.question}</Text>
      </View>
      
      {item.answers.length > 0 && (
        <View style={styles.qaAnswersContainer}>
          <View style={styles.qaAnswerHeader}>
            <Text style={styles.qaAnswersTitle}>
              {item.answers.length} {item.answers.length === 1 ? 'Answer' : 'Answers'}
            </Text>
          </View>
          
          {/* Show all answers directly */}
          {item.answers.map(answer => (
            <View key={answer.id} style={[styles.qaAnswerItem, answer.isInstructor && styles.qaInstructorAnswer]}>
              <View style={styles.qaAnswerHeader}>
                <Image source={{ uri: answer.avatar }} style={styles.qaAnswerAvatar} />
                <View style={styles.qaUserInfo}>
                  <View style={styles.qaNameRow}>
                    <Text style={styles.qaUserName}>{answer.userName}</Text>
                    {answer.isInstructor && (
                      <View style={styles.instructorBadge}>
                        <Text style={styles.instructorBadgeText}>Instructor</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.qaTimestamp}>{answer.timestamp}</Text>
                </View>
              </View>
              <Text style={styles.qaAnswerText}>{answer.text}</Text>
            </View>
          ))}
        </View>
      )}
      
      {replyingTo === item.id ? (
        <View style={styles.qaReplyContainer}>
          <View style={styles.qaReplyInputContainer}>
            <TextInput
              ref={replyInputRef}
              style={styles.qaReplyInput}
              placeholder="Write your answer..."
              placeholderTextColor={COLORS.text.light}
              multiline={true}
              value={replyText}
              onChangeText={setReplyText}
              autoFocus={true}
              blurOnSubmit={false}
              returnKeyType="default"
            />
          </View>
          <View style={styles.qaReplyActions}>
            <TouchableOpacity 
              style={styles.qaCancelButton} 
              onPress={handleCancelReply}
            >
              <Text style={styles.qaCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.qaPostButton, !replyText.trim() && styles.qaDisabledButton]} 
              onPress={handlePostReply}
              disabled={!replyText.trim()}
            >
              <Text style={styles.qaPostButtonText}>Post Answer</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.qaReplyButton} 
          onPress={() => {
            handleStartReply(item.id);
            // Trên Android, thêm một timeout để tránh vấn đề bàn phím
            if (Platform.OS === 'android') {
              setTimeout(() => {
                if (replyInputRef.current) {
                  replyInputRef.current.focus();
                }
              }, 200);
            }
          }}
          activeOpacity={0.6}
        >
          <Ionicons name="chatbubble-outline" size={18} color={COLORS.primary} />
          <Text style={styles.qaReplyButtonText}>Answer this question</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        enabled
      >
        
        {/* Header */} 
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBackButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.lessonTitleHeader} numberOfLines={1}>
              {`Lesson ${currentLesson.number}: ${currentLesson.title}`}
            </Text>
            <Text style={styles.courseTitleHeader} numberOfLines={1}>{courseTitle}</Text>
          </View>
          <TouchableOpacity style={styles.headerListButton} onPress={openLessonList}> 
            <Ionicons name="list-circle-outline" size={26} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Video Player */} 
        <View style={styles.videoContainer}>
          <View style={styles.videoWrapper}>
            {isVideoLoading && currentLesson.videoUrl && (
              <View style={styles.videoLoadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.videoLoadingText}>Loading video...</Text>
              </View>
            )}
            {currentLesson.videoUrl ? (
              <Video
                ref={videoRef}
                style={styles.video}
                source={{ uri: currentLesson.videoUrl }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                onLoadStart={() => setIsVideoLoading(true)}
                onLoad={() => setIsVideoLoading(false)}
                onError={(error) => {
                    console.error("Video Error:", error);
                    setVideoError(true);
                    Alert.alert("Video Error", "Could not load the lesson video.");
                    setIsVideoLoading(false);
                }}
                onPlaybackStatusUpdate={status => setVideoStatus(() => status)}
              />
            ) : (
               <View style={styles.noVideoContainer}>
                 <Ionicons name="videocam-off" size={70} color={COLORS.white + '80'} />
                 <Text style={styles.noVideoText}>Video Unavailable</Text>
               </View>
            )}
          </View>
        </View>

        {/* Tabs and Content Area - Wrap in a ScrollView to make it scrollable when keyboard appears */}
        <View style={[styles.contentArea, {flex: Platform.OS === 'android' ? 1 : null}]}>
          {/* Tabs - Without animation */} 
          <View style={styles.tabsContainer}>
            {TABS.map((tab, index) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                {activeTab === tab && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content Area */} 
          <View style={styles.tabDisplayArea}>
             {activeTab === 'Content' && (
                <ScrollView 
                  contentContainerStyle={styles.tabContentContainer}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.contentCard}>
                    <Text style={styles.contentText}>{currentLesson.content || 'No content available for this lesson.'}</Text>
                  </View>
                </ScrollView>
             )}

             {activeTab === 'Notes' && (
                <View style={styles.notesTabContainer}> 
                  <FlatList
                     data={notes}
                     renderItem={renderNoteItem}
                     keyExtractor={(item) => item.id}
                     ListEmptyComponent={
                       <View style={styles.emptyNotesContainer}>
                         <Ionicons name="document-text-outline" size={70} color={COLORS.text.secondary + '40'} />
                         <Text style={styles.noNotesText}>No notes yet. Tap '+' to add one.</Text>
                       </View>
                     }
                     contentContainerStyle={styles.notesListContainer}
                     showsVerticalScrollIndicator={false}
                  />
                  {/* Add Note FAB */}
                  <TouchableOpacity style={styles.addNoteFab} onPress={handleAddNote} activeOpacity={0.8}>
                     <Ionicons name="add" size={30} color={COLORS.white} />
                  </TouchableOpacity>
                 </View>
             )}
             
             {activeTab === 'Resources' && (
                <View style={styles.resourcesTabContainer}>
                  {currentLesson.resources && currentLesson.resources.length > 0 ? (
                    <FlatList
                      data={currentLesson.resources}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity 
                          style={styles.resourceItem} 
                          onPress={() => handleResourcePress(item)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.resourceIconContainer}>
                            <Ionicons name={getFileIcon(item.type)} size={24} color={COLORS.white} />
                          </View>
                          <View style={styles.resourceContent}>
                            <Text style={styles.resourceText} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.resourceTypeText}>{item.type.toUpperCase()}</Text>
                          </View>
                          <Ionicons name="download-outline" size={22} color={COLORS.primary} />
                        </TouchableOpacity>
                      )}
                      contentContainerStyle={styles.resourcesListContainer}
                      showsVerticalScrollIndicator={false}
                      ListEmptyComponent={
                        <View style={styles.emptyResourcesContainer}>
                          <Ionicons name="document-attach-outline" size={70} color={COLORS.text.secondary + '40'} />
                          <Text style={styles.noResourcesText}>No resources available.</Text>
                        </View>
                      }
                    />
                  ) : (
                    <View style={styles.emptyResourcesContainer}>
                      <Ionicons name="document-attach-outline" size={70} color={COLORS.text.secondary + '40'} />
                      <Text style={styles.noResourcesText}>No resources available.</Text>
                    </View>
                  )}
                </View>
             )}
             
             {activeTab === 'Quiz' && (
                <View style={styles.quizTabContainer}>
                    {!currentLesson?.quiz || currentLesson.quiz.length === 0 ? (
                        <View style={styles.noQuizContainer}>
                            <Ionicons name="help-circle-outline" size={70} color={COLORS.text.secondary + '50'} />
                            <Text style={styles.noQuizText}>No quiz available for this lesson.</Text>
                        </View>
                    ) : quizScore ? (
                        <View style={styles.quizResultContainer}>
                            <View style={styles.quizResultCard}>
                                <View style={styles.quizResultHeader}>
                                    <Text style={styles.quizResultTitle}>Quiz Complete!</Text>
                                    <Text style={styles.quizResultScore}>
                                        Your Score: <Text style={styles.quizScoreHighlight}>{quizScore.score} / {quizScore.total}</Text>
                                    </Text>
                                </View>
                                <FlatList
                                    data={quizScore.results}
                                    renderItem={({ item }) => renderQuizQuestion({ item, reviewMode: true })}
                                    keyExtractor={(item) => `review-${item.id}`}
                                    contentContainerStyle={styles.quizReviewListContainer}
                                    showsVerticalScrollIndicator={false}
                                />
                                <View style={styles.quizModalButtonContainer}>
                                    <TouchableOpacity 
                                        style={[styles.quizButton, styles.tryAgainButton]}
                                        onPress={() => { 
                                            setQuizScore(null);
                                            setQuizAnswers({});
                                        }}
                                    >
                                        <Text style={styles.quizButtonText}>Try Again</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.quizStartContainer}>
                            <View style={styles.quizStartCard}>
                                <Ionicons name="ribbon" size={70} color={COLORS.primary} style={styles.quizStartIcon} />
                                <Text style={styles.quizStartTitle}>Ready for the Quiz?</Text>
                                <Text style={styles.quizStartInfo}>
                                    Test your knowledge with {currentLesson.quiz.length} questions
                                </Text>
                                <TouchableOpacity 
                                    style={styles.quizStartButton} 
                                    onPress={() => setIsQuizModalVisible(true)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.quizButtonText}>Start Quiz</Text>
                                    <Ionicons name="arrow-forward" size={22} color={COLORS.white} style={{marginLeft: 8}} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
             )}
             
             {activeTab === 'Q&A' && (
                <View style={styles.qaTabContainer}>
                  <View style={styles.qaSeeAllContainer}>
                    <View style={styles.qaSeeAllCard}>
                      <Ionicons name="chatbubbles-outline" size={70} color={COLORS.primary} style={styles.qaSeeAllIcon} />
                      <Text style={styles.qaSeeAllTitle}>Questions & Answers</Text>
                      <Text style={styles.qaSeeAllInfo}>
                        View all questions and answers related to this lesson
                      </Text>
                      <TouchableOpacity 
                        style={styles.qaSeeAllButton} 
                        onPress={() => setIsQAAllModalVisible(true)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.qaSeeAllButtonText}>See All Questions</Text>
                        <Ionicons name="arrow-forward" size={22} color={COLORS.white} style={{marginLeft: 8}} />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.qaAskContainer}>
                      <Text style={styles.qaAskTitle}>Have a question about this lesson?</Text>
                      <TextInput
                        style={styles.qaQuestionInput}
                        placeholder="Ask your question here..."
                        value={newQuestion}
                        onChangeText={setNewQuestion}
                        multiline
                      />
                      <TouchableOpacity 
                        style={[
                          styles.qaPostQuestionButton,
                          !newQuestion.trim() && styles.qaDisabledButton
                        ]} 
                        onPress={handlePostQuestion}
                        disabled={!newQuestion.trim()}
                      >
                        <Text style={styles.qaPostButtonText}>Post Question</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
             )}
          </View>
        </View>

        {/* Lesson Navigation */} 
        {!keyboardVisible && (
          <View style={styles.lessonNavContainer}>
            <TouchableOpacity 
                style={[
                  styles.navButton, 
                  styles.prevNavButton,
                  currentLessonIndex === 0 && styles.disabledNavButton
                ]}
                onPress={handlePreviousLesson}
                disabled={currentLessonIndex === 0}
                activeOpacity={0.8}
            >
                <Ionicons 
                  name="chevron-back-outline" 
                  size={24} 
                  color={currentLessonIndex === 0 ? COLORS.text.lightGray : COLORS.white} 
                />
                <Text style={[
                  styles.navButtonText, 
                  currentLessonIndex === 0 && styles.disabledNavText
                ]}>Previous</Text>
            </TouchableOpacity>
            
            <View style={styles.lessonProgressContainer}>
                <View style={styles.lessonProgressBar}>
                    <View 
                        style={[
                          styles.lessonProgressFill, 
                          { width: `${((currentLessonIndex + 1) / allLessons.length) * 100}%` }
                        ]} 
                    />
                </View>
                <Text style={styles.lessonProgressText}>
                    {currentLessonIndex + 1}/{allLessons.length}
                </Text>
            </View>
            
            <TouchableOpacity 
                style={[
                  styles.navButton, 
                  styles.nextNavButton,
                  currentLessonIndex === allLessons.length - 1 && styles.disabledNavButton
                ]}
                onPress={handleNextLesson}
                disabled={currentLessonIndex === allLessons.length - 1}
                activeOpacity={0.8}
            >
                <Text style={[
                  styles.navButtonText, 
                  currentLessonIndex === allLessons.length - 1 && styles.disabledNavText
                ]}>Next</Text>
                <Ionicons 
                  name="chevron-forward-outline" 
                  size={24} 
                  color={currentLessonIndex === allLessons.length - 1 ? COLORS.text.lightGray : COLORS.white} 
                />
            </TouchableOpacity>
          </View>
        )}

        {/* Note Modal */} 
        <NoteModal 
            visible={isNoteModalVisible}
            onClose={() => {
                setIsNoteModalVisible(false);
                setEditingNote(null);
            }}
            onSave={handleSaveNote}
            note={editingNote}
        />

        {/* Lesson List Modal (Standard Modal Implementation) */} 
        <Modal
            visible={isLessonListVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeLessonList}
        >
            <TouchableWithoutFeedback onPress={closeLessonList}>
                <View style={styles.lessonListModalOverlay} />
            </TouchableWithoutFeedback>

            <View style={styles.lessonListModalContainer}> 
                <View style={styles.lessonListModalHeader}>
                     <Text style={styles.lessonListModalTitle}>Course Lessons</Text>
                     <TouchableOpacity onPress={closeLessonList} style={styles.closeModalButton}>
                         <Ionicons name="close-circle" size={32} color={COLORS.text.secondary} />
                     </TouchableOpacity>
                </View>
                <SectionList
                    sections={lessonSections}
                    keyExtractor={(item, index) => item.id + index}
                    renderItem={renderLessonListItem}
                    renderSectionHeader={renderLessonListSectionHeader}
                    stickySectionHeadersEnabled={false}
                    contentContainerStyle={styles.lessonListModalScrollView}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </Modal>

        {/* --- NEW: Quiz Modal --- */} 
        <Modal
            visible={isQuizModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
                Alert.alert("Exit Quiz?", "Your progress will not be saved.", [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Exit",
                        style: "destructive",
                        onPress: () => {
                            setIsQuizModalVisible(false);
                            setQuizAnswers({}); // Reset answers if exiting early
                        },
                    },
                ]);
            }}
        >
            <SafeAreaView style={styles.quizModalContainer}> 
                <View style={styles.quizModalHeader}>
                    {quizScore ? (
                        <Text style={styles.quizModalTitle}>Quiz Results</Text>
                    ) : (
                        <Text style={styles.quizModalTitle}>Lesson Quiz</Text>
                    )}
                    {quizScore && (
                        <TouchableOpacity 
                            onPress={() => setIsQuizModalVisible(false)} 
                            style={styles.quizModalCloseButton}
                        >
                            <Ionicons name="close-circle" size={30} color={COLORS.primary} />
                        </TouchableOpacity>
                    )}
                </View>
                
                {quizScore ? (
                    <View style={styles.quizResultContainerModal}>
                        <View style={styles.quizResultCard}>
                            <View style={styles.quizResultHeader}>
                                <Text style={styles.quizResultTitle}>Quiz Complete!</Text>
                                <Text style={styles.quizResultScore}>
                                    Your Score: <Text style={styles.quizScoreHighlight}>{quizScore.score} / {quizScore.total}</Text>
                                </Text>
                            </View>
                            <FlatList
                                data={quizScore.results}
                                renderItem={({ item }) => renderQuizQuestion({ item, reviewMode: true })}
                                keyExtractor={(item) => `review-${item.id}`}
                                contentContainerStyle={styles.quizReviewListContainerModal}
                                showsVerticalScrollIndicator={false}
                            />
                            <View style={styles.quizModalButtonContainer}>
                                <TouchableOpacity 
                                    style={[styles.quizButton, styles.tryAgainButton]}
                                    onPress={() => { 
                                        setQuizScore(null);
                                        setQuizAnswers({});
                                    }}
                                >
                                    <Text style={styles.quizButtonText}>Try Again</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ) : (
                    <>
                        <View style={styles.quizModalContent}>
                            <Text style={styles.quizModalSubtitle}>
                                Answer all {currentLesson?.quiz?.length || 0} questions to complete the quiz
                            </Text>
                            <FlatList
                                data={currentLesson?.quiz || []}
                                renderItem={({ item }) => renderQuizQuestion({ item, reviewMode: false })}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={styles.quizModalListContainer}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                        <View style={styles.quizModalFooter}>
                            <TouchableOpacity 
                                style={styles.quizSubmitButton} 
                                onPress={handleSubmitQuiz}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.quizButtonText}>Submit Answers</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </SafeAreaView>
        </Modal>

        {/* Q&A All Questions Modal */}
        <Modal
          visible={isQAAllModalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setIsQAAllModalVisible(false)}
        >
          <SafeAreaView style={styles.qaAllModalFullscreen}>
            <View style={styles.qaAllModalHeader}>
              <TouchableOpacity 
                style={styles.qaAllModalBackButton}
                onPress={() => setIsQAAllModalVisible(false)}
              >
                <Ionicons name="arrow-back" size={24} color={COLORS.white} />
              </TouchableOpacity>
              <Text style={styles.qaAllModalTitle}>All Questions</Text>
              <View style={{width: 40}} />
            </View>
            
            <View style={styles.qaFilterContainerModal}>
              <TouchableOpacity
                style={[styles.qaFilterTab, qaFilter === 'all' && styles.qaFilterTabActive]}
                onPress={() => setQaFilter('all')}
              >
                <Text style={[styles.qaFilterText, qaFilter === 'all' && styles.qaFilterTextActive]}>All Questions</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.qaFilterTab, qaFilter === 'answered' && styles.qaFilterTabActive]}
                onPress={() => setQaFilter('answered')}
              >
                <Text style={[styles.qaFilterText, qaFilter === 'answered' && styles.qaFilterTextActive]}>Answered</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.qaFilterSummary}>
              <Text style={styles.qaFilterSummaryText}>
                Showing {getFilteredQAItems(qaFilter).length} {qaFilter === 'all' ? 'questions' : 'answered questions'}
              </Text>
            </View>
            
            <FlatList
              data={getFilteredQAItems(qaFilter)}
              renderItem={renderQaItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.qaAllModalListContainer}
              ListEmptyComponent={
                <View style={styles.qaEmptyContainer}>
                  <Ionicons name="chatbubbles-outline" size={70} color={COLORS.text.secondary + '40'} />
                  <Text style={styles.qaEmptyText}>No questions found with this filter.</Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          </SafeAreaView>
        </Modal>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Styles (Completely revamped) --- 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.default,
  },
  
  // Enhanced Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? SPACING.xl : SPACING.xl + SPACING.md,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.primary,
    marginTop: 30,
    ...SHADOWS.lg,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '90',
  },
  headerListButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '90',
  },
  headerTitleContainer: {
    flex: 1, 
    alignItems: 'center',
    paddingHorizontal: SPACING.md, 
  },
  lessonTitleHeader: {
    fontFamily: FONTS.urbanist.bold, 
    fontSize: SIZES.lg,
    color: COLORS.white,
    textAlign: 'center',
  },
  courseTitleHeader: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: SIZES.sm + 1,
    color: COLORS.white + 'CC',
    textAlign: 'center',
    marginTop: 2,
  },
  
  // Enhanced Video Player
  videoContainer: {
    width: width,
    backgroundColor: COLORS.black,
    padding: SPACING.sm,
  },
  videoWrapper: {
    width: '100%',
    height: width * (9 / 16),
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.lg,
  },
  videoLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black + 'CC',
    zIndex: 10,
  },
  videoLoadingText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md,
    color: COLORS.white,
    marginTop: SPACING.md,
  },
  noVideoContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.dark,
  },
  noVideoText: {
    marginTop: SPACING.md,
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md + 1,
    color: COLORS.white,
  },
  
  // Enhanced Content Area & Tabs
  contentArea: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingTop: SPACING.md,
    ...SHADOWS.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeTab: {
    // Active state is indicated by the text color and indicator line
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: SPACING.lg,
    right: SPACING.lg,
    height: 3,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tabText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md,
    color: COLORS.text.secondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontFamily: FONTS.urbanist.bold,
  },
  tabDisplayArea: { 
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  
  // Enhanced Content Tab
  tabContentContainer: { 
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
  },
  contentCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.md,
  },
  contentText: { 
    fontFamily: FONTS.urbanist.regular,
    fontSize: SIZES.md + 1,
    lineHeight: SIZES.md * 1.8,
    color: COLORS.text.primary, 
  },
  
  // Enhanced Notes Tab
  notesTabContainer: {
    flex: 1, 
    backgroundColor: COLORS.background.light,
  },
  notesListContainer: {
    padding: SPACING.lg,
    paddingBottom: 120,
  },
  emptyNotesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
    marginTop: SPACING.xxl * 2,
  },
  noteItemContainer: { 
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    ...SHADOWS.md,
    borderLeftWidth: 8,
    borderLeftColor: COLORS.secondary,
  },
  noteContent: { 
    flex: 1, 
    marginRight: SPACING.md,
  },
  noteTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.md + 2,
    color: COLORS.secondary, 
    marginBottom: SPACING.sm,
  },
  noteSnippet: { 
    fontFamily: FONTS.urbanist.regular,
    fontSize: SIZES.md,
    color: COLORS.text.secondary,
    lineHeight: SIZES.md * 1.5, 
  },
  noteSnippetItalic: {
    fontFamily: FONTS.urbanist.regularItalic,
    fontSize: SIZES.md,
    color: COLORS.text.lightGray,
  },
  noteActions: { 
    flexDirection: 'row', 
    gap: SPACING.lg,
  }, 
  noteActionButton: { 
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background.light,
  },
  noNotesText: { 
    textAlign: 'center',
    marginTop: SPACING.lg,
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md + 1,
    color: COLORS.text.secondary,
  },
  addNoteFab: { 
    position: 'absolute',
    bottom: SPACING.xl + SPACING.md,
    right: SPACING.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary, 
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  
  // Enhanced Resources Tab
  resourcesTabContainer: {
    flex: 1,
    backgroundColor: COLORS.background.light,
    padding: SPACING.lg,
  },
  resourcesListContainer: {
    paddingBottom: SPACING.xxl,
  },
  emptyResourcesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
    marginTop: SPACING.xxl * 2,
  },
  resourceItem: { 
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  resourceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  resourceContent: {
    flex: 1,
    marginRight: SPACING.md,
  },
  resourceText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.md + 1,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  resourceTypeText: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: SIZES.xs,
    color: COLORS.text.secondary,
    letterSpacing: 1,
  },
  noResourcesText: {
    textAlign: 'center',
    marginTop: SPACING.lg,
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md + 1,
    color: COLORS.text.secondary,
  },

  // Enhanced lesson navigation
  lessonNavContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  navButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary + '90',
  },
  prevNavButton: {
    paddingRight: SPACING.lg,
  },
  nextNavButton: {
    paddingLeft: SPACING.lg,
  },
  disabledNavButton: { 
    opacity: 0.5,
    backgroundColor: COLORS.primary + '30',
  },
  navButtonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.md,
    color: COLORS.white,
  },
  disabledNavText: {
    color: COLORS.white + '80',
  },
  lessonProgressContainer: {
    alignItems: 'center',
  },
  lessonProgressBar: {
    width: 100,
    height: 4,
    backgroundColor: COLORS.white + '30',
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  lessonProgressFill: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 2,
  },
  lessonProgressText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.xs,
    color: COLORS.white,
  },

  // Enhanced Note Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl, 
    alignItems: 'stretch',
    ...SHADOWS.lg,
  },
  modalTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.xl,
    color: COLORS.primary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: COLORS.background.light, 
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.border.medium, 
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontFamily: FONTS.urbanist.regular,
    fontSize: SIZES.md,
    marginBottom: SPACING.lg,
    color: COLORS.text.primary,
  },
  modalContentInput: {
    minHeight: 150, 
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: SPACING.lg,
    gap: SPACING.lg,
  },
  modalButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.background.medium,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.md,
    color: COLORS.text.secondary,
  },
  saveButtonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.md,
    color: COLORS.white,
  },

  // Enhanced Lesson List Modal
  lessonListModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  lessonListModalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '85%', 
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    paddingTop: SPACING.lg, 
    ...SHADOWS.lg,
  },
  lessonListModalHeader: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.sm, 
  },
  lessonListModalTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.xl,
    color: COLORS.primary,
    textAlign: 'center',
    flex: 1,
    marginLeft: 40, 
  },
  closeModalButton: {
    position: 'absolute',
    right: SPACING.md,
    top: SPACING.sm,
    padding: SPACING.xs,
    zIndex: 1,
  },
  lessonListModalScrollView: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl, 
  },
  modalSectionHeader: { 
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xs,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  modalSectionHeaderText: { 
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.sm, 
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  modalLessonItem: { 
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border.light, 
    ...SHADOWS.sm,
    overflow: 'hidden',
  },
  modalCurrentLessonItem: { 
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    ...SHADOWS.md,
  },
  modalLessonNumberContainer: { 
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  modalCurrentLessonNumberContainer: { 
    backgroundColor: COLORS.primary,
  },
  modalLessonNumber: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.md,
    color: COLORS.text.secondary,
  },
  modalCurrentLessonNumber: { 
    color: COLORS.white,
  },
  modalLessonDetails: { 
    flex: 1, 
    marginRight: SPACING.sm,
  },
  modalLessonTitle: { 
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.md + 1,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  modalCurrentLessonTitle: { 
    fontFamily: FONTS.urbanist.bold,
    color: COLORS.primary,
  },
  modalLessonTitleLocked: { 
    color: COLORS.text.lightGray,
    fontFamily: FONTS.urbanist.regularItalic, 
  },
  modalLessonDuration: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: SIZES.sm,
    color: COLORS.text.secondary,
  },
  modalLessonDurationLocked: {
    color: COLORS.text.lightGray,
  },

  // Quiz Tab Styles (Restored)
  quizTabContainer: {
    flex: 1,
    backgroundColor: COLORS.background.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noQuizContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
  },
  noQuizText: { 
    textAlign: 'center',
    marginTop: SPACING.lg,
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md + 1,
    color: COLORS.text.secondary,
  },
  quizStartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    width: '100%',
  },
  quizStartCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    ...SHADOWS.lg,
  },
  quizStartIcon: {
    marginBottom: SPACING.lg,
  },
  quizStartTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.xl + 2,
    color: COLORS.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  quizStartInfo: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md + 1,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
    lineHeight: SIZES.lg * 1.5,
  },
  quizStartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl + SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  quizButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  quizButtonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.md + 1,
    color: COLORS.white,
    textAlign: 'center',
  },
  quizResultContainer: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.lg,
    width: '100%',
  },
  quizResultCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    width: '100%',
    maxWidth: 600,
    overflow: 'hidden',
    ...SHADOWS.lg,
    flex: 1,
  },
  quizResultHeader: {
    padding: SPACING.xl,
    backgroundColor: COLORS.primary + '10',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    alignItems: 'center',
  },
  quizResultTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.xl,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  quizResultScore: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.text.primary,
  },
  quizScoreHighlight: {
    color: COLORS.primary,
    fontFamily: FONTS.urbanist.bold,
  },
  quizReviewListContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
  },

  // Quiz Question and Options
  quizQuestionContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  quizQuestionIncorrect: {
    borderLeftColor: COLORS.error,
  },
  quizQuestionHeader: {
    marginBottom: SPACING.lg,
  },
  quizQuestionText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.lg,
    color: COLORS.text.primary,
    lineHeight: SIZES.lg * 1.5,
  },
  quizOptionsContainer: {
    marginTop: SPACING.sm,
  },
  quizOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border.light,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.background.light,
  },
  quizOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
    borderWidth: 2,
  },
  quizOptionCorrect: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.success + '10',
    borderWidth: 2,
  },
  quizOptionIncorrectSelected: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.error + '10',
    borderWidth: 2,
  },
  quizOptionIcon: {
    marginRight: SPACING.lg,
  },
  quizOptionText: {
    flex: 1,
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md + 1,
    color: COLORS.text.primary,
  },
  quizOptionTextSelected: {
    fontFamily: FONTS.urbanist.semiBold,
    color: COLORS.primary,
  },
  quizOptionTextCorrect: {
    fontFamily: FONTS.urbanist.semiBold,
    color: COLORS.success,
  },
  quizOptionTextIncorrect: {
    fontFamily: FONTS.urbanist.medium,
    color: COLORS.error,
  },
  correctAnswerContainer: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.success + '15',
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.md,
  },
  correctAnswerText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.sm + 1,
    color: COLORS.success,
  },

  // Quiz Modal Styles
  quizModalContainer: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  quizModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    position: 'relative',
    ...SHADOWS.sm,
  },
  quizModalTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.xl,
    color: COLORS.primary,
  },
  quizModalSubtitle: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  quizModalContent: {
    flex: 1,
  },
  quizModalCloseButton: {
    position: 'absolute',
    right: SPACING.lg,
    padding: SPACING.xs,
  },
  quizModalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  quizModalListContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl * 3,
  },
  quizReviewListContainerModal: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  quizResultContainerModal: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.background.default,
  },
  quizModalFooter: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    alignItems: 'center',
    ...SHADOWS.top,
  },
  quizSubmitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.md,
    minWidth: 200,
    alignItems: 'center',
  },
  tryAgainButton: {
    backgroundColor: COLORS.secondary,
  },

  // Q&A Tab Styles
  qaTabContainer: {
    flex: 1,
    backgroundColor: COLORS.background.light,
    padding: SPACING.lg,
  },
  qaSeeAllContainer: {
    flex: 1,
    paddingBottom: SPACING.xxl,
  },
  qaSeeAllCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
  },
  qaSeeAllIcon: {
    marginBottom: SPACING.lg,
  },
  qaSeeAllTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.xl + 2,
    color: COLORS.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  qaSeeAllInfo: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md + 1,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
    lineHeight: SIZES.lg * 1.5,
  },
  qaSeeAllButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl + SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  qaSeeAllButtonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.md + 1,
    color: COLORS.white,
    textAlign: 'center',
  },
  qaAskContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  qaAskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  qaAskTitle: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.md + 1,
    color: COLORS.text.primary,
    flex: 1,
  },
  qaQuestionInput: {
    backgroundColor: COLORS.background.light,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontFamily: FONTS.urbanist.regular,
    fontSize: SIZES.md,
    minHeight: 80,
    maxHeight: 120,
    textAlignVertical: 'top',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  qaPostQuestionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  qaDisabledButton: {
    backgroundColor: COLORS.primary + '80',
  },
  qaPostButtonText: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.md,
    color: COLORS.white,
  },
  qaContentHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  qaContentHeader: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.md,
    color: COLORS.text.primary,
  },
  qaFilterContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background.medium,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  qaFilterTab: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qaFilterTabActive: {
    backgroundColor: COLORS.primary,
  },
  qaFilterText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.xs,
    color: COLORS.text.secondary,
  },
  qaFilterTextActive: {
    color: COLORS.white,
    fontFamily: FONTS.urbanist.bold,
  },
  qaListContainer: {
    paddingBottom: SPACING.xxl,
  },
  qaEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
    marginTop: SPACING.xl,
  },
  qaEmptyText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md + 1,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  qaItemCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
  },
  qaItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  qaAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.md,
  },
  qaAnswerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: SPACING.md,
  },
  qaUserInfo: {
    flex: 1,
  },
  qaNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qaUserName: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.md,
    color: COLORS.text.primary,
  },
  qaStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '15',
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  qaStatusPending: {
    backgroundColor: COLORS.primary + '15',
  },
  qaStatusText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.xs,
    color: COLORS.success,
    marginLeft: 3,
  },
  qaStatusTextPending: {
    color: COLORS.primary,
  },
  instructorBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
    marginLeft: SPACING.sm,
  },
  instructorBadgeText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.xs,
    color: COLORS.primary,
  },
  qaTimestamp: {
    fontFamily: FONTS.urbanist.regular,
    fontSize: SIZES.xs,
    color: COLORS.text.lightGray,
    marginTop: 2,
  },
  qaContentContainer: {
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  qaQuestion: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.md + 1,
    color: COLORS.text.primary,
    lineHeight: SIZES.lg * 1.4,
  },
  qaAnswersContainer: {
    backgroundColor: COLORS.background.light,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  qaAnswerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  qaAnswersTitle: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.text.secondary,
  },
  qaAnswerItem: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  qaViewAllAnswers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    marginTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  qaViewAllAnswersText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.primary,
    marginRight: 4,
  },
  qaReplyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  qaReplyButtonText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  qaReplyContainer: {
    backgroundColor: COLORS.background.light,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  qaReplyInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.md,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  qaReplyInput: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontFamily: FONTS.urbanist.regular,
    fontSize: SIZES.md,
    minHeight: 80,
    maxHeight: 120,
    textAlignVertical: 'top',
    color: COLORS.text.primary,
  },
  qaReplyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
  },
  qaCancelButton: {
    borderWidth: 1,
    borderColor: COLORS.border.medium,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  qaCancelButtonText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.text.secondary,
  },
  qaPostButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.sm,
  },
  qaSeeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  qaSeeMoreText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.primary,
    marginRight: 4,
  },
  // All Questions Modal Styles
  qaAllModalFullscreen: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  qaAllModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.sm,
    marginTop: 30,
  },
  qaAllModalBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '90',
  },
  qaAllModalTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.xl,
    color: COLORS.white,
  },
  qaAllModalListContainer: {
    padding: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: 120,
  },
  qaAskContainerModal: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  qaFilterContainerModal: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.full,
    padding: SPACING.xs,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  qaFilterTab: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qaFilterTabActive: {
    backgroundColor: COLORS.primary,
  },
  qaFilterText: {
    fontFamily: FONTS.urbanist.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.text.secondary,
  },
  qaFilterTextActive: {
    color: COLORS.white,
  },
  qaFilterSummary: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  qaFilterSummaryText: {
    fontFamily: FONTS.urbanist.medium,
    fontSize: SIZES.sm,
    color: COLORS.text.secondary,
    textAlign: 'left',
  },
  allAnswersModalContainer: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  allAnswersModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    ...SHADOWS.sm,
  },
  allAnswersBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.light,
  },
  allAnswersModalTitle: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.lg,
    color: COLORS.primary,
  },
  allAnswersQuestionContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  allAnswersCountContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  allAnswersCount: {
    fontFamily: FONTS.urbanist.bold,
    fontSize: SIZES.md,
    color: COLORS.text.secondary,
  },
  allAnswersListContainer: {
    padding: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  allAnswersItem: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
});

export default LessonDetailScreen; 