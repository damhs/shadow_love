import React, { useState, useEffect } from 'react';
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
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import config from '../config';
import Icon from 'react-native-vector-icons/Ionicons'; // Ionicons 사용

const baseUrl = config.backendUrl;

const SettingsScreen = ({ navigation }) => {
  const { setBackground } = useBackground();
  const [selectedBackground, setSelectedBackground] = useState('background.png');
  const [isGalleryPublic, setIsGalleryPublic] = useState(false);

  useEffect(() => {
    const fetchIsGalleryPublic = async () => {
      try {
        const deviceID = await DeviceInfo.getUniqueId();
        const response = await axios.get(`${baseUrl}/setting/getIsShowed`, {
          params: { ID: deviceID },
        });
        setIsGalleryPublic(response.data[0].isShowed !== 0);
      } catch (error) {
        console.error('Failed to fetch gallery visibility:', error);
      }
    };

    fetchIsGalleryPublic();
  }, []);

  const updateIsGalleryPublic = async (newValue) => {
    try {
      const deviceID = await DeviceInfo.getUniqueId();
      const isShowedValue = newValue ? 1 : 0;
      await axios.patch(`${baseUrl}/setting/updateIsShowed`, {
        ID: deviceID,
        isShowed: isShowedValue,
      });
      setIsGalleryPublic(newValue);
    } catch (error) {
      console.error('Failed to update gallery visibility:', error);
    }
  };

  const handleBackgroundChange = (selectedValue) => {
    setSelectedBackground(selectedValue);
    setBackground(backgroundMapping[selectedValue]);
    Alert.alert('배경이 변경되었습니다!');
  };

  const handleBreakCouple = () => {
    Alert.alert(
      '커플 파기',
      '정말 커플을 해제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: deleteUserData },
      ],
    );
  };

  const deleteUserData = async () => {
    try {
      const deviceID = await DeviceInfo.getUniqueId();
      await axios.delete(`${baseUrl}/setting/deleteUserData`, {
        params: { ID: deviceID },
      });
      Alert.alert('커플 관계가 해제되었습니다.');
    } catch (error) {
      console.error('Failed to delete user data:', error);
    }
  };

  const handlePasswordSetting = () => {
    navigation.navigate('Password');
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back-outline" size={30} color="#333" /> {/* 올바른 아이콘 렌더링 */}
      </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>내 미술관 공개</Text>
          <Switch
            value={isGalleryPublic}
            onValueChange={(value) => updateIsGalleryPublic(value)}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>배경 변경</Text>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedBackground}
            onValueChange={(itemValue) => handleBackgroundChange(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="배경 1" value="background.png" />
            <Picker.Item label="배경 2" value="background2.webp" />
            <Picker.Item label="배경 3" value="background3.webp" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.settingItem} onPress={handlePasswordSetting}>
          <Text style={styles.settingText}>비밀번호 설정</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, styles.destructive]}
          onPress={handleBreakCouple}
        >
          <Text style={styles.settingText}>커플 파기</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, // 제목 중앙 정렬
    color: '#333',
  },
  scrollContainer: {
    padding: 20,
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
});

export default SettingsScreen;
