import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Button, FlatList, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Automatic() {
  const [focusedItem, setFocusedItem] = useState('Automatic');
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [temperature, setTemperature] = useState('');
  const [lux, setLux] = useState('');
  const [tintLevel, setTintLevel] = useState('');
  const [rules, setRules] = useState([]);
  const ws = useRef(null);
  const route = useRoute();
  const navigation = useNavigation();
  const windowNumber = route.params?.windowNumber ?? 2; 

  useEffect(() => {
    ws.current = new WebSocket('ws://192.168.0.199:81/');

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.current.onmessage = (e) => {
      console.log('WebSocket message received:', e.data);
      // Handle automatic mode data here if needed
    };

    ws.current.onerror = (e) => {
      console.log('WebSocket error: ', e.message);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    fetchRules();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('http://192.168.0.145:5001/rules');
      const data = await response.json();
      setRules(data);
    } catch (error) {
      console.error('Failed to fetch rules:', error);
    }
  };

  const addRule = async () => {
    const newRule = { windowNumber, temperature, lux, tintLevel };
    try {
      const response = await fetch('http://192.168.0.145:5001/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule),
      });
      const data = await response.json();
      setRules([...rules, data]);
      setTemperature('');
      setLux('');
      setTintLevel('');
    } catch (error) {
      console.error('Failed to add rule:', error);
    }
  };

  const deleteRule = async (id) => {
    try {
      await fetch(`http://192.168.0.145:5001/rules/${id}`, { method: 'DELETE' });
      setRules(rules.filter(rule => rule.id !== id));
    } catch (error) {
      console.error('Failed to delete rule:', error);
    }
  };

  const toggleAutomatic = () => {
    setIsAutomatic(previousState => !previousState);
    // Send the toggle state to the WebSocket server
    if (ws.current) {
      ws.current.send(JSON.stringify({ windowNumber, isAutomatic: !isAutomatic }));
    }
  };

  const backHome = () => {
    navigation.replace('Home');
  };

  const taskManager = (label) => {
    setFocusedItem(label);
    switch (label) {
      case 'Privacy':
        navigation.navigate('Privacy', { windowNumber });
        break;
      case 'Schedule':
        navigation.navigate('Schedule', { windowNumber });
        break;
      case 'Automatic':
        navigation.navigate('Automatic', { windowNumber });
        break;
      default:
        navigation.replace('Home');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#161622" style="dark" />
      <View style={styles.navBar}>
        <View style={styles.navBarContent}>
          <Text style={styles.greeting}>Good Afternoon!</Text>
          <Text style={styles.windowNumber}>Window {windowNumber}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={backHome}>
          <Icon name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.text}>Automatic Mode</Text>
        <Switch
          trackColor={{ false: "#767577", true: "gold" }}
          thumbColor={isAutomatic ? "#fff" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleAutomatic}
          value={isAutomatic}
        />

        <Text style={styles.subHeading}>Set Automatic Rules</Text>
        <TextInput
          style={styles.input}
          placeholder="Temperature"
          value={temperature}
          onChangeText={setTemperature}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Lux"
          value={lux}
          onChangeText={setLux}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Tint Level"
          value={tintLevel}
          onChangeText={setTintLevel}
          keyboardType="numeric"
        />
        <Button title="Add Rule" onPress={addRule} />

        <FlatList
          data={rules}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.ruleItem}>
              <Text>Temperature: {item.temperature}</Text>
              <Text>Lux: {item.lux}</Text>
              <Text>Tint Level: {item.tintLevel}</Text>
              <Button title="Delete" onPress={() => deleteRule(item.id)} />
            </View>
          )}
        />
      </View>

      <View style={styles.taskbar}>
        <TaskBarItem
          icon="lock-closed"
          label="Privacy"
          isFocused={focusedItem === 'Privacy'}
          onPress={taskManager}
        />
        <TaskBarItem
          icon="calendar"
          label="Schedule"
          isFocused={focusedItem === 'Schedule'}
          onPress={taskManager}
        />
        <TaskBarItem
          icon="settings"
          label="Automatic"
          isFocused={focusedItem === 'Automatic'}
          onPress={taskManager}
        />
      </View>
    </SafeAreaView>
  );
}

const TaskBarItem = ({ icon, label, isFocused, onPress }) => (
  <TouchableOpacity
    style={[styles.taskbarItem, isFocused && styles.taskbarItemFocused]}
    onPress={() => onPress(label)}
  >
    <Icon name={icon} size={24} color={isFocused ? 'gold' : '#fff'} />
    <Text style={[styles.taskbarLabel, isFocused && styles.taskbarLabelFocused]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: 'gold',
  },
  navBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    paddingHorizontal: 30,
  },
  windowNumber: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'gold',
    borderRadius: 10,
    paddingHorizontal: 180,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: 18,
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  ruleItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 5,
    width: '80%',
  },
  taskbar: {
    flexDirection: 'row',
    backgroundColor: 'black',
    height: 84,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#232533',
  },
  taskbarItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  taskbarItemFocused: {
    backgroundColor: '#333',
  },
  taskbarLabel: {
    color: 'gold',
    marginTop: 5,
  },
  taskbarLabelFocused: {
    color: 'gold',
  },
});
