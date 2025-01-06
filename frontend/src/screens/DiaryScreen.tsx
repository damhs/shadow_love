import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import config from '../config';

const baseUrl = config.backendUrl;

const DiaryScreen = ({ navigation }) => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [answers, setAnswers] = useState(['', '', '']);
  const [isComplete, setIsComplete] = useState(false); // Completion status

  const fetchRandomQuestions = async () => {
    try {
      const questions = await Promise.all([
        axios.get(`${baseUrl}/main/getRandomQuestion`),
        axios.get(`${baseUrl}/main/getRandomQuestion`),
        axios.get(`${baseUrl}/main/getRandomQuestion`),
      ]);
      console.log('questions:', questions);

      const questionTexts = questions.map((res) => res.data.questionText);
      setSelectedQuestions(questionTexts);
    } catch (error) {
      console.error('Error fetching random questions:', error);
      Alert.alert('Error', 'Failed to fetch questions. Please try again.');
    }
  };

  const handleComplete = async () => {
    const allFilled = answers.every((answer) => answer.trim().length > 0);

    if (!allFilled) {
      Alert.alert('Incomplete Answers', 'Please fill out all answers before completing the diary.');
      return;
    }

    try {
      // Step 1: Save Diary
      const diaryResponse = await axios.post('http://<YOUR_SERVER>/createDiary', {
        ID: '<USER_ID>', // Replace with dynamic user ID
        questionID1: selectedQuestions[0],
        answerText1: answers[0],
        questionID2: selectedQuestions[1],
        answerText2: answers[1],
        questionID3: selectedQuestions[2],
        answerText3: answers[2],
      });

      const diaryID = diaryResponse.data;

      // Step 2: Create Emotion
      const emotionResponse = await axios.post('http://<YOUR_SERVER>/createEmotion', {
        ID: '<USER_ID>', // Replace with dynamic user ID
      });

      const emotionID = emotionResponse.data;

      // Step 3: Check Couple's Emotion
      const coupleEmotionResponse = await axios.get('http://<YOUR_SERVER>/getEmotion', {
        params: { ID: '<PARTNER_ID>' }, // Replace with dynamic partner ID
      });

      // Step 3-1: Wait for Partner's Emotion
      if (!coupleEmotionResponse.data) {
        Alert.alert('Waiting for Partner', 'Please wait for your partner to complete their diary.');
        return;
      } else {}

      // Step 3-2: Generate Artwork
      const artworkResponse = await axios.post('http://<YOUR_SERVER>/createArtwork', {
        ID1: '<USER_ID>', // Replace with dynamic user ID
        ID2: '<PARTNER_ID>', // Replace with dynamic partner ID
      });

      const artworkID = artworkResponse.data;

      Alert.alert('Diary Completed', 'Your diary, emotion, and artwork have been saved!');
      setIsComplete(true);
    } catch (error) {
      console.error('Error completing diary:', error);
      Alert.alert('Error', 'Failed to complete the diary. Please try again.');
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
        Alert.alert('Limit Exceeded', 'You can only enter up to 200 characters.');
      }
    }
  };

  return (
    <ImageBackground
      source={require('../assets/img/diary_background.png')}
      style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Today's Diary Questions</Text>

        {selectedQuestions.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.question}>
              {index + 1}. {question}
            </Text>
            <TextInput
              style={[
                styles.input,
                isComplete && { backgroundColor: '#e9ecef', color: '#6c757d' },
              ]}
              placeholder="Write your answer here..."
              value={answers[index]}
              onChangeText={(text) => handleAnswerChange(index, text)}
              multiline={true}
              maxLength={200}
              editable={!isComplete}
            />
            <Text style={styles.charCount}>
              {answers[index].length}/200
            </Text>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
            disabled={isComplete}>
            <Text style={styles.buttonText}>
              {isComplete ? 'Completed' : 'Complete'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  questionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    height: 100, // 박스 높이를 키워서 텍스트 공간 추가
    borderRadius: 10, // 부드러운 곡선 모서리
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff', // 흰색 배경
    textAlignVertical: 'top',
    color: '#333', // 텍스트 색상
    borderWidth: 1, // 테두리 추가
    borderColor: '#ddd', // 테두리 색상
    shadowColor: '#000', // 그림자 효과
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // Android 그림자 효과
    backgroundImage: 'url("../assets/img/diary_background.png")', // 텍스처 이미지 적용
  },
  charCount: {
    textAlign: 'right',
    marginTop: 5,
    fontSize: 14,
    color: '#aaa',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '30%',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '30%',
  },
  completeButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '30%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DiaryScreen;
