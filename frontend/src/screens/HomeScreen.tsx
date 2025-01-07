import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
  Text,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useBackground } from './BackgroundContext';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import config from '../config';

const baseUrl = config.backendUrl;
const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { background } = useBackground();
  const [artworks, setArtworks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const deviceID = await DeviceInfo.getUniqueId();
        const response = await axios.get(`${baseUrl}/home/getArtworks`, {
          params: { ID: deviceID },
        });
        const artworks = response.data.map((artwork) => ({
          artwork: artwork.artwork,
          date: artwork.date,
          title: artwork.title,
          artworkID: artwork.artworkID, // 추가로 artworkID 포함
        }));
        setArtworks(artworks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artworks:', error);
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const handleTitleEdit = async () => {
    const currentPainting = artworks[currentIndex];
    try {
      await axios.put(`${baseUrl}/updateArtworkTitle`, {
        artworkID: currentPainting.artworkID,
        newTitle,
      });

      // 상태 업데이트
      const updatedArtworks = [...artworks];
      updatedArtworks[currentIndex].title = newTitle;
      setArtworks(updatedArtworks);

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleCalendarPress = () => navigation.navigate('Calendar');
  const handleSettingsPress = () => navigation.navigate('Setting');

  const handleLeftArrowPress = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else setCurrentIndex(artworks.length - 1);
  };

  const handleRightArrowPress = () => {
    if (currentIndex < artworks.length - 1) setCurrentIndex(currentIndex + 1);
    else setCurrentIndex(0);
  };

  const handlePencilPress = () => navigation.navigate('Diary');
  const handleGridPress = () => navigation.navigate('Explore');

  const currentPainting = artworks[currentIndex];

  return (
    <ImageBackground source={background} style={baseStyles.background}>
      <View style={baseStyles.container}>
        <View style={baseStyles.topBar}>
          <TouchableOpacity onPress={handleCalendarPress}>
            <Icon name="calendar-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettingsPress}>
            <Icon name="settings-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={baseStyles.loader} />
        ) : (
          <View style={baseStyles.imageContainer}>
            <Image
              source={{ uri: currentPainting?.artwork }}
              style={baseStyles.image}
            />
            {isEditing ? (
              <TextInput
                style={baseStyles.titleInput}
                value={newTitle}
                onChangeText={setNewTitle}
                onBlur={handleTitleEdit}
                autoFocus
                maxLength={20}
                placeholder="Enter title"
                placeholderTextColor="#bbb"
              />
            ) : (
              <TouchableOpacity onPress={() => {
                setIsEditing(true);
                setNewTitle(currentPainting?.title || '무제');
              }}>
                <Text style={baseStyles.title}>{currentPainting?.title || '무제'}</Text>
              </TouchableOpacity>
            )}
            <Text style={baseStyles.date}>{currentPainting?.date}</Text>
          </View>
        )}

        <View style={baseStyles.arrowsContainer}>
          <TouchableOpacity style={baseStyles.arrowButton} onPress={handleLeftArrowPress}>
            <Icon name="chevron-back-outline" size={40} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={baseStyles.arrowButton} onPress={handleRightArrowPress}>
            <Icon name="chevron-forward-outline" size={40} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[baseStyles.floatingButton, baseStyles.leftButton]}
          onPress={handlePencilPress}
        >
          <Icon name="brush-outline" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[baseStyles.floatingButton, baseStyles.rightButton]}
          onPress={handleGridPress}
        >
          <MaterialIcons name="museum" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const baseStyles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.5,
    height: height * 0.4,
    resizeMode: 'contain',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.05,
    marginTop: height * 0.02,
  },
  titleInput: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.05,
    marginTop: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    textAlign: 'center',
    width: '80%',
  },
  date: {
    color: '#aaa',
    fontSize: width * 0.04,
    marginTop: height * 0.01,
  },
  arrowsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '50%',
    left: width * 0.05,
    right: width * 0.05,
  },
  arrowButton: {
    padding: width * 0.03,
  },
  floatingButton: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    backgroundColor: 'rgba(44, 44, 44, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  leftButton: {
    bottom: height * 0.05,
    left: width * 0.05,
  },
  rightButton: {
    bottom: height * 0.05,
    right: width * 0.05,
  },
});

export default HomeScreen;
