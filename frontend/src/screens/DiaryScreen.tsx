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
import RNFS from 'react-native-fs';
import questionsData from '../../datas/questions.json';

const DiaryScreen = ({ navigation }) => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [answers, setAnswers] = useState(['', '', '']);
  const [isComplete, setIsComplete] = useState(false); // 완료 여부
  const questionsFilePath = `${RNFS.DocumentDirectoryPath}/today_questions.json`;

  const loadOrCreateQuestions = async () => {
    try {
      console.log('Checking if file exists:', questionsFilePath);
      const fileExists = await RNFS.exists(questionsFilePath);

      if (fileExists) {
        console.log('File exists. Reading file...');
        const fileContent = await RNFS.readFile(questionsFilePath, 'utf8');
        const savedData = JSON.parse(fileContent);

        if (savedData.questions && savedData.questions.length === 3) {
          setSelectedQuestions(savedData.questions.map((q) => q.title));
          setAnswers(savedData.answers || ['', '', '']);
          setIsComplete(savedData.isComplete || false); // 완료 여부 로드
          console.log('Questions loaded from file:', savedData);
          return;
        } else {
          console.warn('File exists but does not contain valid questions. Creating new...');
        }
      } else {
        console.warn('File does not exist. Creating new...');
      }

      // 파일이 없거나 유효하지 않을 경우 새 질문 생성
      await createAndSaveQuestions();
    } catch (error) {
      console.error('Error loading or creating questions:', error);
    }
  };

  const createAndSaveQuestions = async () => {
    try {
      console.log('Generating new questions...');
      const randomGroups = [];
      while (randomGroups.length < 3) {
        const randomIndex = Math.floor(Math.random() * questionsData.length);
        if (!randomGroups.includes(randomIndex)) {
          randomGroups.push(randomIndex);
        }
      }

      const newQuestions = randomGroups.map((groupIndex) => {
        const group = questionsData[groupIndex];
        const randomQuestionIndex = Math.floor(Math.random() * group.length);
        return { title: group[randomQuestionIndex].title };
      });

      console.log('Saving questions to file:', newQuestions);

      const newData = {
        questions: newQuestions,
        answers: ['', '', ''], // 초기 답변
        isComplete: false, // 초기 완료 상태
      };

      await RNFS.writeFile(questionsFilePath, JSON.stringify(newData), 'utf8');
      console.log('Questions saved successfully!');

      setSelectedQuestions(newQuestions.map((q) => q.title));
      setAnswers(['', '', '']);
      setIsComplete(false);
    } catch (error) {
      console.error('Error saving new questions:', error);
    }
  };

  const saveAnswers = async () => {
    try {
      const savedData = {
        questions: selectedQuestions.map((title) => ({ title })),
        answers,
        isComplete,
      };

      console.log('Saving answers to file:', savedData);
      await RNFS.writeFile(questionsFilePath, JSON.stringify(savedData), 'utf8');
      console.log('Answers saved successfully!');
      Alert.alert('Diary Saved', 'Your answers have been saved!');
    } catch (error) {
      console.error('Error saving answers:', error);
      Alert.alert('Error', 'Failed to save your answers. Please try again.');
    }
  };

  const handleComplete = async () => {
    // 모든 답변이 작성되었는지 확인
    const allFilled = answers.every((answer) => answer.trim().length > 0);

    if (!allFilled) {
      Alert.alert('Incomplete Answers', 'Please fill out all answers before completing the diary.');
      return;
    }

    try {
      setIsComplete(true); // 완료 상태 설정

      const savedData = {
        questions: selectedQuestions.map((title) => ({ title })),
        answers,
        isComplete: true,
      };

      console.log('Marking diary as complete:', savedData);
      await RNFS.writeFile(questionsFilePath, JSON.stringify(savedData), 'utf8');
      console.log('Diary marked as complete!');
      Alert.alert('Diary Completed', 'You have completed today\'s diary!');
    } catch (error) {
      console.error('Error marking diary as complete:', error);
      Alert.alert('Error', 'Failed to complete the diary. Please try again.');
    }
  };

  useEffect(() => {
    loadOrCreateQuestions();
  }, []);

  const handleAnswerChange = (index, text) => {
    if (!isComplete) {
      // 완료된 상태에서는 수정 불가
      if (text.length <= 200) {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = text;
        setAnswers(updatedAnswers);
      } else {
        Alert.alert('Limit Exceeded', 'You can only enter up to 200 characters.');
      }
    }
  };

  const handleBack = () => {
    navigation.goBack();
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
                isComplete && { backgroundColor: '#e9ecef', color: '#6c757d' }, // 완료 상태에서는 비활성화 스타일
              ]}
              placeholder="Write your answer here..."
              value={answers[index]}
              onChangeText={(text) => handleAnswerChange(index, text)}
              multiline={true}
              maxLength={200}
              editable={!isComplete} // 완료 상태에서는 수정 불가
            />
            <Text style={styles.charCount}>
              {answers[index].length}/200
            </Text>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          {/* Back 버튼 */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          {/* Save 버튼 */}
          {!isComplete && (
            <TouchableOpacity style={styles.saveButton} onPress={saveAnswers}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          )}

          {/* 완료 버튼 */}
          {!isComplete && (
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.buttonText}>Complete</Text>
            </TouchableOpacity>
          )}
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
