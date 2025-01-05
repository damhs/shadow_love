import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import questionsData from '../../datas/questions.json';

const DiaryScreen = ({ navigation }) => {
  const [selectedQuestions, setSelectedQuestions] = useState([]); // 선택된 질문 상태
  const [answers, setAnswers] = useState(['', '', '']); // 질문에 대한 답변 상태

  useEffect(() => {
    // 질문 그룹에서 3개를 랜덤으로 선택하고, 각 그룹에서 1개의 질문을 뽑음
    const selectRandomQuestions = () => {
      const randomGroups = [];
      while (randomGroups.length < 3) {
        const randomIndex = Math.floor(Math.random() * questionsData.length);
        if (!randomGroups.includes(randomIndex)) {
          randomGroups.push(randomIndex);
        }
      }

      // 각 그룹에서 질문 1개씩 뽑기
      const selected = randomGroups.map((groupIndex) => {
        const group = questionsData[groupIndex];
        const randomQuestionIndex = Math.floor(
          Math.random() * group.length
        );
        return group[randomQuestionIndex].title; // 질문 제목(title) 반환
      });

      setSelectedQuestions(selected);
    };

    selectRandomQuestions();
  }, []);

  // 답변 입력 업데이트
  const handleAnswerChange = (index, text) => {
    if (text.length <= 200) { // 200자 제한
      const updatedAnswers = [...answers];
      updatedAnswers[index] = text;
      setAnswers(updatedAnswers);
    } else {
      Alert.alert('Limit Exceeded', 'You can only enter up to 200 characters.');
    }
  };

  const handleSave = () => {
    Alert.alert('Diary Saved', 'Your answers have been saved!');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Today's Diary Questions</Text>

      {selectedQuestions.map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.question}>
            {index + 1}. {question}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Write your answer here..."
            value={answers[index]}
            onChangeText={(text) => handleAnswerChange(index, text)}
            multiline={true}
            maxLength={200} // 200자 제한 (UI에서 제한)
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
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    marginTop: 5,
    fontSize: 14,
    color: '#555',
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
    width: '45%',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DiaryScreen;
