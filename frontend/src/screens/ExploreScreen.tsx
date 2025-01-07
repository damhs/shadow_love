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

  const fetchCoupleIDs = async () => {
    try {
      console.log('fetchCoupleIDs');
      const response = await axios.get(`${baseUrl}/gallery/getShowedCouples`);
      console.log('response: ', response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchTodayArtworks = async (coupleIDs) => {
    try {
      const results = await Promise.all(
        coupleIDs.map((coupleID) =>
          axios
            .get(`${baseUrl}/gallery/getTodayArtworks`, {
              params: { coupleID },
            })
            .catch((error) => {
              console.error(`Error for coupleID ${coupleID}:`, error);
              return null;
            })
        )
      );
      // Filter null results and extract data
      return results.filter((res) => res !== null).map((res) => res.data);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const coupleIDsResponse = await fetchCoupleIDs();
        const coupleIDs = coupleIDsResponse.map((couple) => couple.coupleID);
        const todayArtworks = await fetchTodayArtworks(coupleIDs);

        // Flatten nested arrays if necessary
        const flattenedArtworks = todayArtworks.flat();
        setArtworks(flattenedArtworks);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
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
        keyExtractor={(item, index) => item.coupleID || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.artworkContainer}>
            <Image
              source={{ uri: item.artwork || 'https://via.placeholder.com/150' }}
              style={styles.artworkImage}
            />
            <Text style={styles.artworkTitle}>{item.title || 'Untitled'}</Text>
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>No artworks available.</Text>
          </View>
        )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ExploreScreen;
