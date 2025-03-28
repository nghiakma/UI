import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InboxScreen from '../screens/InboxScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';

const Stack = createNativeStackNavigator();

const InboxStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="InboxScreen" component={InboxScreen} />
      <Stack.Screen name="ChatDetailScreen" component={ChatDetailScreen} />
    </Stack.Navigator>
  );
};

export default InboxStack; 