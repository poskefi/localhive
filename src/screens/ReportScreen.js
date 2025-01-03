import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import CONFIG from './config';

export default function ReportScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('News');
  const [temperature, setTemperature] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const { BASE_URL, ENDPOINTS } = CONFIG;

  const getEndpointByCategory = () => ENDPOINTS[category] || '/posts';

  const placeholderText = {
    News: 'Enter news details',
    Events: 'Enter event details',
    Weather: 'Enter weather details',
    'Safety Alerts': 'Enter alert details',
  };

  const handleMediaUpload = () => {
    Alert.alert('Media Upload', 'This button will allow media selection.');
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Validation Error', 'Title and Description are required.');
      return;
    }

    if (image.length > 500) {
      Alert.alert('Validation Error', 'Image URL is too long. Please use a shorter URL.');
      return;
    }

    if (category === 'Weather' && (!temperature || !zipCode)) {
      Alert.alert('Validation Error', 'Temperature and ZIP Code are required for Weather.');
      return;
    }

    if (category === 'Events' && (!date || !location)) {
      Alert.alert('Validation Error', 'Date and Location are required for Events.');
      return;
    }

    const payload = {
      title,
      description,
      ...(category === 'Weather' && { temperature, city: zipCode }),
      ...(category === 'Events' && { date: date.toISOString(), location }),
      category,
      image,
    };

    const endpoint = getEndpointByCategory();

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      Alert.alert('Report Submitted', `Your ${category.toLowerCase()} report has been successfully submitted.`);
      setTitle('');
      setDescription('');
      setCategory('News');
      setTemperature('');
      setZipCode('');
      setDate(new Date());
      setLocation('');
      setImage('');
    } catch (error) {
      console.error('Error submitting report:', error.message || error);
      Alert.alert('Submission Failed', error.message || 'Unable to submit the report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  >
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
    <View style={styles.container}>
      <View style={styles.container2}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#555"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.description]}
        placeholder={placeholderText[category] || 'Enter details'}
        placeholderTextColor="#555"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
      style={styles.input}
      placeholder="Image Link"
      placeholderTextColor="#555"
      value={image}
      onChangeText={setImage}
    />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          style={styles.picker}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="News" value="News" />
          <Picker.Item label="Events" value="Events" />
          <Picker.Item label="Weather" value="Weather" />
          <Picker.Item label="Safety Alerts" value="Safety Alerts" />
        </Picker>
      </View>

      {category === 'Weather' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Temperature (°F)"
            placeholderTextColor="#555"
            keyboardType="numeric"
            value={temperature}
            onChangeText={setTemperature}
          />
          <TextInput
            style={styles.input}
            placeholder="ZIP Code"
            placeholderTextColor="#555"
            keyboardType="numeric"
            value={zipCode}
            onChangeText={setZipCode}
          />
        </>
      )}

      {category === 'Events' && (
        <>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerText}>Pick Event Date: {date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Location"
            placeholderTextColor="#555"
            value={location}
            onChangeText={setLocation}
          />
        </>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitButtonText}>{loading ? 'Submitting...' : 'SUBMIT'}</Text>
      </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f6dc',
  },
  container2: {
    backgroundColor: '#f7f6dc',
    top: '20%',
  },
  scrollContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddc17a', 
  },
  description: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddc17a',
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  datePickerButton: {
    backgroundColor: '#f77f00',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  datePickerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mediaButton: {
    backgroundColor: '#f77f00',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  mediaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#32cd32',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
