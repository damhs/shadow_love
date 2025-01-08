import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import config from '../config';
import Icon from 'react-native-vector-icons/Ionicons';

const baseUrl = config.backendUrl;

const DiaryScreen = ({navigation}) => {
  const [selectedQuestionIDs, setSelectedQuestionIDs] = useState([]);
  const [selectedQuestionTexts, setSelectedQuestionTexts] = useState([]);
  const [answers, setAnswers] = useState(['', '', '']);
  const [isComplete, setIsComplete] = useState(false); // Completion status
  const [isLoading, setIsLoading] = useState(false);
  const fetchRandomQuestions = async () => {
    try {
      const questions = await Promise.all([
        axios.get(`${baseUrl}/main/getRandomQuestion`),
        axios.get(`${baseUrl}/main/getRandomQuestion`),
        axios.get(`${baseUrl}/main/getRandomQuestion`),
      ]);

      const questionIDs = questions.map(res => res.data.questionID);
      console.log('questionIDs:', questionIDs);
      setSelectedQuestionIDs(questionIDs);
      const questionTexts = questions.map(res => res.data.questionText);
      console.log('questionTexts:', questionTexts);
      setSelectedQuestionTexts(questionTexts);
    } catch (error) {
      console.error('Error fetching random questions:', error);
      Alert.alert('Error', 'Failed to fetch questions. Please try again.');
    }
  };

  const handleComplete = async () => {
    const allFilled = answers.every(answer => answer.trim().length > 0);

    if (!allFilled) {
      Alert.alert(
        'Incomplete Answers',
        'Please fill out all answers before completing the diary.',
      );
      return;
    }

    try {
      setIsLoading(true);
      const deviceID = await DeviceInfo.getUniqueId();
      console.log('DeviceID:', deviceID);
      const coupleResponse = await axios.get(`${baseUrl}/auth/getCouple`, {
        params: {ID: deviceID},
      });
      console.log('coupleResponse:', coupleResponse.data);
      // Step 1: Save Diary
      const diaryResponse = await axios.post(`${baseUrl}/main/createDiary`, {
        ID: deviceID,
        questionID1: selectedQuestionIDs[0],
        answerText1: answers[0],
        questionID2: selectedQuestionIDs[1],
        answerText2: answers[1],
        questionID3: selectedQuestionIDs[2],
        answerText3: answers[2],
      });
      console.log('diaryResponse:', diaryResponse.data);

      // Step 2: Create Emotion
      const emotionResponse = await axios.post(
        `${baseUrl}/main/createEmotion`,
        {
          ID: deviceID,
        },
      );

      console.log('emotionResponse:', emotionResponse.data);

      // Step 3: Check Couple's Emotion
      console.log('coupleResponse:', coupleResponse.data);
      const coupleID = coupleResponse.data;
      console.log('coupleID:', coupleID[0].coupleID);

      const coupleEmotionResponse = await axios.get(
        `${baseUrl}/main/getEmotion`,
        {
          params: {ID: coupleID[0].coupleID}, // Replace with dynamic partner ID
        },
      );

      console.log('coupleEmotionResponse:', coupleEmotionResponse.data);

      await axios.post(`${baseUrl}/main/sendPushNotification`, {
        ID: deviceID,
      });
      console.log('Push notification sent!');

      if (coupleEmotionResponse.data.length === 0) {
        setIsLoading(false);
        Alert.alert(
          'Waiting for Partner',
          'Your partner has not completed their diary yet. Please wait for them.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home'), // Navigate to home screen
            },
          ],
        );
        return;
      }

      // Step 4: Generate Artwork
      const artworkResponse = await axios.post(
        `${baseUrl}/main/createArtwork`,
        {
          ID1: deviceID, // Replace with dynamic user ID
          ID2: coupleID[0].coupleID, // Replace with dynamic partner ID
        },
      );

      console.log('artworkResponse:', artworkResponse.data);

      const artworkID = artworkResponse.data;

      Alert.alert(
        'Diary Completed',
        'Your diary, emotion, and artwork have been saved!',
      );
      setIsComplete(true);
      navigation.navigate('Loading');
      navigation.goBack();

      // Optionally navigate to a screen to view the artwork
      // navigation.navigate('ArtworkScreen', {artworkID});
    } catch (error) {
      console.error('Error completing diary:', error);
      Alert.alert('Error', 'Failed to complete the diary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomQuestions();
  }, []);

  const handleAnswerChange = (index, text) => {
    if (!isComplete) {
      if (text.length <= 200) {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = text;
        setAnswers(updatedAnswers);
      } else {
        Alert.alert(
          'Limit Exceeded',
          'You can only enter up to 200 characters.',
        );
      }
    }
  };

  return (
    <ImageBackground
      source={require('../assets/img/diary_background_3.png')}
      style={styles.background}>
      {/* 상단에 뒤로가기 아이콘만 추가 */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Icon name="arrow-back-outline" size={30} color="#FFF" />
        {/* 아이콘만 표시 */}
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text
          style={
            (styles.title,
            styles.customFont,
            {marginTop: 40, fontSize: 24, textAlign: 'center', color: '#FFF'})
          }>
          Today's Diary Questions
        </Text>
        {selectedQuestionTexts.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.customFont}>
              {index + 1}. {question}
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.customFont,
                isComplete && {backgroundColor: '#e9ecef', color: '#6c757d'},
              ]}
              placeholder="Write your answer here..."
              value={answers[index]}
              onChangeText={text => handleAnswerChange(index, text)}
              multiline={true}
              maxLength={200}
              editable={!isComplete}
            />
            <Text style={styles.charCount}>{answers[index].length}/200</Text>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
            disabled={isComplete || isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Loading...' : isComplete ? 'Completed' : 'Complete'}
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Creating artwork...</Text>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 20, // 화면 상단으로 위치 조정
    left: 20, // 왼쪽 여백
    zIndex: 10, // 아이콘을 다른 요소 위에 표시
    marginTop: 40,
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  questionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F9F9F9', // 연한 배경
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0', // 경계선 색상
  },
  customFont: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 120,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
    color: '#4A4A4A',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    placeholderTextColor: '#AAAAAA', // 플레이스홀더 색상
  },
  charCount: {
    textAlign: 'right',
    color: '#888',
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  completeButton: {
    backgroundColor: 'rgb(69, 223, 82)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10, // 둥근 모서리
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  customFont: {
    fontSize: 20,
    fontFamily: 'Nanum GaRamYeonGgoc',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
    zIndex: 10, // 다른 요소 위에 표시
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DiaryScreen;
