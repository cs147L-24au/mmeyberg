import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NotesList from './src/screens/NotesList';
import NoteEditor from './src/screens/NoteEditor';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="NotesList" component={NotesList} options={{ title: 'Notes' }} />
        <Stack.Screen name="NoteEditor" component={NoteEditor} options={{ title: 'Edit Note' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
