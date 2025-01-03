import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window'); 
export default function HomeScreen({ navigation, user }) {
  const isSignedIn = user && user.username;
  const username = isSignedIn ? user.username : "KSI";
  const profileImage = isSignedIn && user.profileImage 
    ? user.profileImage 
    : "https://images.hellomagazine.com/horizon/43/c9f41b848ca0-ksi-wellchild.jpg";
    
    const handlePress = () => {
      navigation.navigate('Settings')
    };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {username}</Text>
        <TouchableOpacity onPress={handlePress}>
        <Image source={{ uri: profileImage }} style={styles.profileImage}
        />
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => navigation.navigate('Main', { screen: 'News' })}
        >
          <Text style={styles.gridText}>News</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => navigation.navigate('Main', { screen: 'Alerts' })}
        >
          <Text style={styles.gridText}>Alerts</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => navigation.navigate('Main', { screen: 'Report' })}
      >
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      <View style={styles.gridContainer}>
        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => navigation.navigate('Main', { screen: 'Weather' })}
        >
          <Text style={styles.gridText}>Weather</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => navigation.navigate('Main', { screen: 'Events' })}
        >
          <Text style={styles.gridText}>Events</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    marginTop: height * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  profileImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  gridItem: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -20,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  gridText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
  },
  plusButton: {
    position: 'absolute',
    bottom: height * 0.05,
    alignSelf: 'center',
    width: width * 0.65,
    height: width * 0.20,
    backgroundColor: '#FF6347',
    borderRadius: (width * 0.15) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
