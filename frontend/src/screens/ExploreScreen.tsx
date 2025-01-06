import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import config from '../config';

const baseUrl = config.backendUrl;

const ExploreScreen = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // API 호출: isShowed가 true인 CoupleID 가져오기
  const fetchCoupleIDs = async () => {
    try {
      const response = await axios.get(`${baseUrl}/gallery/getShowedArtworks`); // isShowed가 true인 CoupleID API
      console.log('response:', response);
      return response.data; // CoupleID 목록 반환
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // API 호출: CoupleID로 Artwork 가져오기
  const fetchArtworks = async (coupleIDs) => {
    try {
      const promises = coupleIDs.map((id) =>
        axios.get(`https://your-api.com/artworks/${id}`) // CoupleID로 Artwork를 가져오는 API
      );
      const responses = await Promise.all(promises);
      return responses.map((res) => res.data); // Artwork 데이터 목록 반환
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const coupleIDs = await fetchCoupleIDs();
      const artworks = await fetchArtworks(coupleIDs);
      setArtworks(artworks);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mutual Art Galleries</Text>
      <FlatList
        data={artworks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.artworkContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.artworkImage} />
            <Text style={styles.artworkTitle}>{item.title}</Text>
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  artworkContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  artworkImage: {
    width: Dimensions.get('window').width / 2 - 24,
    height: 150,
    borderRadius: 8,
  },
  artworkTitle: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ExploreScreen;
