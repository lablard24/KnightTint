import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { SERVER_DOMAIN, SERVER_PROTOCOL, WEBSOCKET_IP } from '../config';

const Automatic = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [focusedItem, setFocusedItem] = useState('Automatic');
  const [tintLevel, setTintLevel] = useState(0);
  const [conditionType, setConditionType] = useState('temperature');
  const [temperatureCondition, setTemperatureCondition] = useState(null);
  const [luxCondition, setLuxCondition] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [temperature, setTemperature] = useState(null);
  const [lux, setLux] = useState(null);
  const [editingConditionIndex, setEditingConditionIndex] = useState(null);

  const windowNumber = 1;

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_IP);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log('Received WebSocket message:', message);
      if (message.type === 'sensorData') {
        console.log('Received sensor data:', message);
        setTemperature(message.temperature);
        setLux(message.lux);
        updateTintLevel(message.temperature, message.lux);
      }
    };

    ws.current.onerror = (e) => {
      console.error('WebSocket error:', e.message);
    };

    ws.current.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const response = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/conditions/${windowNumber}`);
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.indexOf('application/json') !== -1) {
          const data = await response.json();
          console.log('Fetched conditions:', data);
          setConditions(data);
        } else {
          const errorText = await response.text();
          console.error('Unexpected response:', errorText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
  
    fetchConditions();
  }, [windowNumber]);

  const updateTintLevel = (temperature, lux) => {
    let newTintLevel = 0;

    conditions.forEach((condition) => {
      if (condition.type === 'temperature' && temperature >= condition.temperatureValue) {
        newTintLevel = Math.max(newTintLevel, condition.tintLevel);
      } else if (condition.type === 'lux' && lux >= condition.luxValue) {
        newTintLevel = Math.max(newTintLevel, condition.tintLevel);
      } else if (
        condition.type === 'both' &&
        temperature >= condition.temperatureValue &&
        lux >= condition.luxValue
      ) {
        newTintLevel = Math.max(newTintLevel, condition.tintLevel);
      }
    });

    console.log('Updated tint level to:', newTintLevel);
    setTintLevel(newTintLevel);
    sendTintLevelToWebSocket(newTintLevel);  
  };

  const openEditModal = (index) => {
    const condition = conditions[index];
    console.log('Editing condition:', condition);
    setTintLevel(condition.tintLevel);
    if (condition.type === 'temperature') {
      setConditionType('temperature');
      setTemperatureCondition(condition.temperatureValue);
      setLuxCondition(null);
    } else if (condition.type === 'lux') {
      setConditionType('lux');
      setLuxCondition(condition.luxValue);
      setTemperatureCondition(null);
    } else if (condition.type === 'both') {
      setConditionType('both');
      setTemperatureCondition(condition.temperatureValue);
      setLuxCondition(condition.luxValue);
    }
    setEditingConditionIndex(index);
    setModalVisible(true);
  };

  const saveCondition = async () => {
    let newCondition = {
      windowNumber,
      type: conditionType,
      temperatureValue: temperatureCondition,
      luxValue: luxCondition,
      tintLevel,
    };

    console.log('Saving condition:', newCondition);

    try {
      let response;
      if (editingConditionIndex !== null) {
        response = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/conditions/${conditions[editingConditionIndex]._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCondition),
        });
      } else {
        response = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/conditions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCondition),
        });
      }

      const updatedCondition = await response.json();
      console.log('Saved condition:', updatedCondition);
      if (editingConditionIndex !== null) {
        const updatedConditions = [...conditions];
        updatedConditions[editingConditionIndex] = updatedCondition;
        setConditions(updatedConditions);
        setEditingConditionIndex(null);
      } else {
        setConditions([...conditions, updatedCondition]);
      }

      setTemperatureCondition(null);
      setLuxCondition(null);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCondition = async (index) => {
    try {
      console.log('Deleting condition:', conditions[index]);
      await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/conditions/${conditions[index]._id}`, {
        method: 'DELETE',
      });
      setConditions(conditions.filter((_, i) => i !== index));
    } catch (error) {
      console.error(error);
    }
  };

  const sendTintLevelToWebSocket = (tintValue) => {
    if (ws.current) {
      console.log('Sending tint level to WebSocket:', tintValue);
      ws.current.send(JSON.stringify({ window: currentWindowNumber, action: 'set', value: tintValue }));
      setWindowData(prevData => ({
        ...prevData,
        [currentWindowNumber]: {
          ...prevData[currentWindowNumber],
          Tint: tintValue
        }
      }));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#161622" style="dark" />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBarButton} onPress={() => router.replace(`/window${windowNumber}`)}>
          <Icon name="chevron-back-sharp" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.navBarText}>Automatic for Window {windowNumber}</Text>
        <TouchableOpacity style={styles.plusButton} onPress={() => setModalVisible(true)}>
          <Icon name="add-circle-sharp" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <FlatList
          data={conditions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.scheduleItem}>
              <Text>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Condition</Text>
              </Text>
              <Text>
                {item.type === 'both' ? (
                  <>
                    <Text style={{ fontWeight: 'bold' }}>Temperature: </Text>{item.temperatureValue}°F <Text style={{ fontWeight: 'bold' }}>& Lux: </Text>{item.luxValue}lx
                  </>
                ) : (
                  <>
                    <Text style={{ fontWeight: 'bold' }}>{item.type === 'temperature' ? 'Temperature: ' : 'Lux: '}</Text>{item.type === 'temperature' ? `${item.temperatureValue} °F` : `${item.luxValue} lx`}
                  </>
                )}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Tint Level: </Text>{item.tintLevel}%
              </Text>

              <View style={styles.scheduleActions}>
                <TouchableOpacity onPress={() => openEditModal(index)}>
                  <Icon name="create-outline" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteCondition(index)}>
                  <Icon name="trash-outline" size={25} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Tint Level: {tintLevel}%</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={tintLevel}
              onValueChange={(value) => setTintLevel(value)}
            />
            <Text style={styles.label}>Condition Type</Text>
            <View style={styles.conditionTypeContainer}>
              <TouchableOpacity
                style={[styles.conditionTypeButton, conditionType === 'temperature' && styles.conditionTypeButtonSelected]}
                onPress={() => setConditionType('temperature')}
              >
                <Text style={styles.conditionTypeButtonText}>Temperature</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.conditionTypeButton, conditionType === 'lux' && styles.conditionTypeButtonSelected]}
                onPress={() => setConditionType('lux')}
              >
                <Text style={styles.conditionTypeButtonText}>Lux</Text>
              </TouchableOpacity>
            </View>
            {conditionType === 'temperature' && (
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter temperature °F"
                value={temperatureCondition ? temperatureCondition.toString() : ''}
                onChangeText={(value) => setTemperatureCondition(parseInt(value))}
              />
            )}
            {conditionType === 'lux' && (
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter Lux"
                value={luxCondition ? luxCondition.toString() : ''}
                onChangeText={(value) => setLuxCondition(parseInt(value))}
              />
            )}
            <TouchableOpacity style={styles.saveButton} onPress={saveCondition}>
              <Text style={styles.saveButtonText}>Save Condition</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.taskbar}>
        <TaskBarItem
          icon="logo-windows"
          label="Privacy"
          isFocused={focusedItem === 'Privacy'}
          onPress={() => router.replace(`/privacy${windowNumber}`)}
        />
        <TaskBarItem
          icon="calendar"
          label="Schedule"
          isFocused={focusedItem === 'Schedule'}
          onPress={() => router.replace(`/schedule${windowNumber}`)}
        />
        <TaskBarItem
          icon="aperture-sharp"
          label="Automatic"
          isFocused={focusedItem === 'Automatic'}
          onPress={() => router.replace(`/automatic${windowNumber}`)}
        />
      </View>
    </SafeAreaView>
  );
};

const TaskBarItem = ({ icon, label, isFocused, onPress }) => (
  <TouchableOpacity
    style={[styles.taskbarItem, isFocused && styles.taskbarItemFocused]}
    onPress={onPress}
  >
    <Icon name={icon} size={24} color={isFocused ? 'gold' : '#fff'} />
    <Text style={[styles.taskbarLabel, isFocused && styles.taskbarLabelFocused]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default Automatic;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomColor: '#000',
    backgroundColor: 'gold',
  },
  navBarButton: {
    padding: 10,
  },
  navBarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  plusButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  scheduleItem: {
    backgroundColor: 'gold',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  conditionTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  conditionTypeButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  conditionTypeButtonSelected: {
    backgroundColor: 'gold',
  },
  conditionTypeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: 'gold',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
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
  scheduleActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});
