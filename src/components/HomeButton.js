// src/components/HomeButton.js
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function HomeButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ marginLeft: 10 }}>
      <Icon name="home" size={24} color="#333" />
    </TouchableOpacity>
  );
}
