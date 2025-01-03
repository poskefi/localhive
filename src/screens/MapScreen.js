import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from '@expo/vector-icons/Feather';
import CONFIG from './config';

export default function MapScreen({ navigation }) {
  const [markersData, setMarkersData] = useState([]);
  const [allMarkers, setAllMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const { BASE_URL, GOOGLE_API_KEY } = CONFIG;
  const mapRef = useRef(null);

  const geocodeCity = async (city) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          city
        )}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      } else {
        console.warn(`Geocoding failed for ${city}: ${data.status}`);
        return null;
      }
    } catch (error) {
      console.error(`Error geocoding ${city}:`, error.message || error);
      return null;
    }
  };

  const fetchMarkers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/weather`);
      if (!response.ok) throw new Error('Failed to fetch weather data.');
      const data = await response.json();

      const markersWithCoordinates = await Promise.all(
        data.map(async (weather) => {
          const coordinates = await geocodeCity(weather.city);
          if (coordinates) {
            return {
              id: weather.id,
              ...coordinates,
              title: weather.title || 'Weather Location',
              description: weather.description || 'No description available.',
            };
          }
          return null;
        })
      );

      const validMarkers = markersWithCoordinates.filter((marker) => marker);
      setMarkersData(validMarkers);
      setAllMarkers(validMarkers);

      // Zoom out to show all markers
      if (mapRef.current && validMarkers.length > 0) {
        const latitudes = validMarkers.map((m) => m.latitude);
        const longitudes = validMarkers.map((m) => m.longitude);

        mapRef.current.fitToCoordinates(
          validMarkers.map((m) => ({ latitude: m.latitude, longitude: m.longitude })),
          {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          }
        );
      }
    } catch (error) {
      console.error('Error fetching markers:', error.message || error);
      Alert.alert('Error', 'Failed to fetch locations. Please try again.');
    }
  };

  const handleZipCodeSearch = () => {
    if (zipCode.trim()) {
      const filteredMarkers = allMarkers.filter(
        (marker) => marker.description && marker.description.includes(zipCode)
      );
      setMarkersData(filteredMarkers);

      // Zoom to the first matching pin
      if (filteredMarkers.length > 0 && mapRef.current) {
        const marker = filteredMarkers[0];
        mapRef.current.animateToRegion(
          {
            latitude: marker.latitude,
            longitude: marker.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1000
        );
      } else {
        Alert.alert('No Results', 'No locations match the provided ZIP code.');
      }
    } else {
      setMarkersData(allMarkers); // Reset to all markers if zip code is cleared
    }
  };

  useEffect(() => {
    fetchMarkers();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 37.0902,
          longitude: -95.7129,
          latitudeDelta: 50,
          longitudeDelta: 50,
        }}
      >
        {markersData.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => setSelectedMarker(marker)}
          />
        ))}
      </MapView>

      <View style={styles.locationFilter}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FeatherIcon color="#000" name="arrow-left" size={24} />
        </TouchableOpacity>
        <TextInput
          style={styles.cityInput}
          placeholder="Enter ZIP Code"
          placeholderTextColor="#aaa"
          value={zipCode}
          onChangeText={setZipCode}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={handleZipCodeSearch}>
          <Icon name="magnify" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {selectedMarker && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedMarker}
          onRequestClose={() => setSelectedMarker(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                source={{ uri: selectedMarker.image || 'https://via.placeholder.com/150' }}
                style={styles.image}
              />
              <Text style={styles.userText}>{selectedMarker.title}</Text>
              <Text style={styles.descriptionText}>{selectedMarker.description}</Text>
              <TouchableOpacity onPress={() => setSelectedMarker(null)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  locationFilter: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  cityInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  userText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
