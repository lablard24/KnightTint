import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DeviceTask = () => {
  const [deviceId, setDeviceId] = useState('');
  const [taskType, setTaskType] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://192.168.56.1:3001/deviceTasks/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId,
          taskType,
          taskDetails,
          scheduledTime,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response:', errorData);
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      Alert.alert('Success', data.message);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.label}>Device ID:</Text>
      <TextInput
        style={styles.input}
        value={deviceId}
        onChangeText={setDeviceId}
        placeholder="Enter Device ID"
      />
      <Text style={styles.label}>Task Type:</Text>
      <TextInput
        style={styles.input}
        value={taskType}
        onChangeText={setTaskType}
        placeholder="Enter Task Type"
      />
      <Text style={styles.label}>Task Details:</Text>
      <TextInput
        style={styles.input}
        value={taskDetails}
        onChangeText={setTaskDetails}
        placeholder="Enter Task Details"
      />
      <Text style={styles.label}>Scheduled Time:</Text>
      <TextInput
        style={styles.input}
        value={scheduledTime}
        onChangeText={setScheduledTime}
        placeholder="Enter Scheduled Time"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      
<StatusBar backgroundColor="#161622" style="dark"/>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'blue',
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DeviceTask;
