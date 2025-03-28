import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TransactionsScreen from '../screens/TransactionsScreen';
import ReceiptScreen from '../screens/ReceiptScreen';

const Stack = createNativeStackNavigator();

const TransactionStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TransactionsScreen" component={TransactionsScreen} />
      <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} />
    </Stack.Navigator>
  );
};

export default TransactionStack; 