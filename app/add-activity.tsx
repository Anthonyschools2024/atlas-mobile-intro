import { StyleSheet, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useDatabase } from '@/hooks/useDatabase';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function AddActivityScreen() {
  const router = useRouter();
  const { addActivity } = useDatabase();
  const [steps, setSteps] = useState('');
  
  const textColor = useThemeColor({}, 'text');

  const handleSave = async () => {
    const stepsInt = parseInt(steps, 10);
    if (isNaN(stepsInt) || stepsInt <= 0) {
      alert('Please enter a valid number of steps.');
      return;
    }
    
    await addActivity(stepsInt, Date.now());
    Keyboard.dismiss();
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Add New Activity</ThemedText>
      
      <TextInput
        style={[styles.input, { color: textColor, borderColor: '#ccc' }]}
        placeholder="Enter number of steps"
        placeholderTextColor="#999"
        keyboardType="number-pad"
        value={steps}
        onChangeText={setSteps}
        autoFocus
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <ThemedText style={styles.buttonText}>Save Activity</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    gap: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});