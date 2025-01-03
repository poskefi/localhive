// src/screens/ProfileScreen.js
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import styles from '../style';

const postsData = [
  { id: '1', image: 'https://via.placeholder.com/150', text: 'Post 1 description' },
  { id: '2', image: 'https://via.placeholder.com/150', text: 'Post 2 description' },
];

export default function ProfileScreen() {
  const [notificationSetting, setNotificationSetting] = useState("Silent");

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon}>
            <Icon name="pencil" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.nameText}>Name: User123</Text>
        
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>Notifications:</Text>
          <Picker
            selectedValue={notificationSetting}
            style={styles.picker}
            onValueChange={(itemValue) => setNotificationSetting(itemValue)}
          >
            <Picker.Item label="Silent" value="Silent" />
            <Picker.Item label="Sound" value="Sound" />
          </Picker>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <TouchableOpacity style={styles.myPostsButton}>
          <Text style={styles.myPostsText}>My Posts</Text>
        </TouchableOpacity>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}># of Posts: 2</Text>
          <Text style={styles.statsText}># of Likes: 240</Text>
        </View>
      </View>

      {/* List of User's Posts */}
      <FlatList
        data={postsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Image source={{ uri: item.image }} style={styles.postImage} />
            <Text style={styles.postText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.postList}
      />
    </View>
  );
}
