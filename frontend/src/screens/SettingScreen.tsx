import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useBackground } from './BackgroundContext';
import { Picker } from '@react-native-picker/picker';

// 이미지 매핑 객체
const backgroundMapping = {
  'background.png': require('../assets/img/background.png'),
  'background2.webp': require('../assets/img/background2.webp'),
  'background3.webp': require('../assets/img/background3.webp'),
};

const SettingsScreen = ({ navigation }) => {
  const { setBackground } = useBackground();
  const [selectedBackground, setSelectedBackground] = useState('background.png');
  const [isGalleryPublic, setIsGalleryPublic] = useState(false);

  const handleBackgroundChange = (selectedValue) => {
    setSelectedBackground(selectedValue);
    setBackground(backgroundMapping[selectedValue]); // 매핑된 이미지 사용
    Alert.alert('배경이 변경되었습니다!');
  };

  const handleBreakCouple = () => {
    Alert.alert(
      '커플 파기',
      '정말 커플을 해제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: () => Alert.alert('커플 관계가 해제되었습니다.') },
      ]
    );
  };

  const handlePasswordSetting = () => {
    navigation.navigate('Password'); // SetPasswordScreen으로 이동
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>설정</Text>

        {/* 내 미술관 공개 */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>내 미술관 공개</Text>
          <Switch value={isGalleryPublic} onValueChange={setIsGalleryPublic} />
        </View>

        {/* 배경 변경 */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>배경 변경</Text>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedBackground}
            onValueChange={(itemValue) => handleBackgroundChange(itemValue)}
            style={styles.picker}>
            <Picker.Item label="배경 1" value="background.png" />
            <Picker.Item label="배경 2" value="background2.webp" />
            <Picker.Item label="배경 3" value="background3.webp" />
          </Picker>
        </View>

        {/* 비밀번호 설정 버튼 */}
        <TouchableOpacity style={styles.settingItem} onPress={handlePasswordSetting}>
          <Text style={styles.settingText}>비밀번호 설정</Text>
        </TouchableOpacity>

        {/* 커플 파기 */}
        <TouchableOpacity
          style={[styles.settingItem, styles.destructive]}
          onPress={handleBreakCouple}>
          <Text style={styles.settingText}>커플 파기</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 돌아가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  pickerContainer: {
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  settingText: {
    fontSize: 18,
  },
  destructive: {
    borderBottomWidth: 0,
    marginTop: 30,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 10,
    borderRadius: 10,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
