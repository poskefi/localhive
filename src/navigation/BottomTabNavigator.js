import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import NewsScreen from '../screens/NewsScreen';
import AlertsScreen from '../screens/AlertsScreen';
import WeatherScreen from '../screens/WeatherScreen';
import EventsScreen from '../screens/EventsScreen';
import ReportScreen from '../screens/ReportScreen';
import SettingsButton from '../components/SettingsButton';
import HomeButton from '../components/HomeButton';

const Tab = createBottomTabNavigator();
function CustomPlusButton() {
  const navigation = useNavigation(); // Use navigation hook

  return (
    <TouchableOpacity
      style={styles.plusButton}
      onPress={() => navigation.navigate('Report')} // Navigate to Report screen
    >
      <Icon name="plus" size={30} color="#fff" />
    </TouchableOpacity>
  );
}


export default function BottomTabNavigator({ navigation }) {
  return (
    <Tab.Navigator
      initialRouteName="News"
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          headerTitle: 'News',
          headerRight: () => <SettingsButton />,
          headerLeft: () => <HomeButton />,
          tabBarIcon: ({ color, size }) => <Icon name="newspaper" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          headerTitle: 'Alerts',
          headerRight: () => <SettingsButton />,
          headerLeft: () => <HomeButton />,
          tabBarIcon: ({ color, size }) => <Icon name="alert" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          headerRight: () => <SettingsButton />,
          headerLeft: () => <HomeButton />,
          tabBarButton: (props) => <CustomPlusButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Weather"
        component={WeatherScreen}
        options={{
          headerTitle: 'Weather',
          headerRight: () => <SettingsButton />,
          headerLeft: () => <HomeButton />,
          tabBarIcon: ({ color, size }) => <Icon name="weather-cloudy" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          headerTitle: 'Events',
          headerRight: () => <SettingsButton />,
          headerLeft: () => <HomeButton />,
          tabBarIcon: ({ color, size }) => <Icon name="calendar" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  plusButton: {
    width: 60,
    height: 60,
    backgroundColor: '#FFA500', 
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'absolute',
    bottom: 15,
    left: '50%',
    marginLeft: -30,
    elevation: 5,
  },
});