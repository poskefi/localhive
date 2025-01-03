// src/screens/WeatherScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CONFIG from './config';

const { BASE_URL } = CONFIG;

export default function WeatherScreen({navigation}) {
  const [weatherData, setWeatherData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/weather`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWeatherData(data);
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error.message || error);
      Alert.alert('Error', 'Unable to fetch weather information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleCityFilter = (text) => {
    setCityFilter(text);
    const filtered = weatherData.filter((item) =>
      item.city.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handlePress = () => {
    navigation.navigate('Maps')
  };

  return (
    <View style={styles.container}>
      <View style={styles.cityFilterContainer}>
        <TextInput
          style={styles.cityInput}
          placeholder="Enter Zip Code"
          placeholderTextColor="#aaa"
          value={cityFilter}
          onChangeText={handleCityFilter}
        />
        <TouchableOpacity onPress={handlePress}>
          <Icon name="map-marker" size={24} color="#333" style={styles.locationIcon} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.weatherCard}>
              <Text style={styles.weatherText}>City: {item.city}</Text>
              <Text style={styles.weatherText}>Temperature: {item.temperature}°F</Text>
              <Text style={styles.weatherText}>Description: {item.description}</Text>
            </View>
          )}
          contentContainerStyle={styles.weatherList}
          ListEmptyComponent={
            !loading && <Text style={styles.emptyText}>No weather updates found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  weatherList: {
    width: '100%',
  },
  weatherCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
  },
  weatherText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
  cityFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  cityInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  locationIcon: {
    marginLeft: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});
