// src/components/SettingsButton.js
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function SettingsButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 10 }}>
      <Icon name="cog" size={24} color="#333" />
    </TouchableOpacity>
  );
}
