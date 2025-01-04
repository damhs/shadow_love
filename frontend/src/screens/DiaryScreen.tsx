import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// Reusable InputField Component
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder = '내용을 입력하세요',
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  </View>
);

// Main DiaryScreen Component
const DiaryScreen = () => {
  const [isDiaryWritten, setIsDiaryWritten] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState({ 1: '', 2: '', 3: '' });

  // Function to handle completion
  const handleComplete = () => {
    const isAnyEntryFilled = Object.values(diaryEntries).some((entry) => entry.trim() !== '');
    if (isAnyEntryFilled) {
      setIsDiaryWritten(true);
      console.log('Diary saved:', diaryEntries);
    } else {
      alert('일기를 작성해주세요!');
    }
  };

  // Render "Thank You" Screen if diary is written
  if (isDiaryWritten) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.completeMessage}>일기를 작성해주셔서 감사합니다!</Text>
      </SafeAreaView>
    );
  }

  // Render Diary Input Screen
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <InputField
          label="1. 머시기?"
          value={diaryEntries[1]}
          onChangeText={(text) => setDiaryEntries({ ...diaryEntries, 1: text })}
        />
        <InputField
          label="2. 저시기?"
          value={diaryEntries[2]}
          onChangeText={(text) => setDiaryEntries({ ...diaryEntries, 2: text })}
        />
        <InputField
          label="3. ~~~~"
          value={diaryEntries[3]}
          onChangeText={(text) => setDiaryEntries({ ...diaryEntries, 3: text })}
        />
        <TouchableOpacity style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>완료</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFC0CB', // 핑크 배경색
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  button: {
    backgroundColor: '#00FFCC', // 초록 버튼 색상
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeMessage: {
    fontSize: 18,
    color: '#333333',
  },
});

export default DiaryScreen;
