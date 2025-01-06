import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';

const SettingsScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isGalleryPublic, setIsGalleryPublic] = useState(false);

  const handleClearCache = () => {
    Alert.alert(
      '캐시 삭제',
      '캐시를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: () => Alert.alert('캐시가 삭제되었습니다.') },
      ]
    );
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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>설정</Text>

        {/* 테마 변경 */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>다크 모드</Text>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
        </View>

        {/* 알림 설정 */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>알림 활성화</Text>
          <Switch value={isNotificationsEnabled} onValueChange={setIsNotificationsEnabled} />
        </View>

        {/* 내 미술관 공개 */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>내 미술관 공개</Text>
          <Switch value={isGalleryPublic} onValueChange={setIsGalleryPublic} />
        </View>

        {/* 캐시 삭제 */}
        <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
          <Text style={styles.settingText}>캐시 삭제</Text>
        </TouchableOpacity>

        {/* 커플 파기 */}
        <TouchableOpacity style={[styles.settingItem, styles.destructive]} onPress={handleBreakCouple}>
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
  settingText: {
    fontSize: 18,
  },
  destructive: {
    borderBottomWidth: 0, // 마지막 항목이라 경계선 제거
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
