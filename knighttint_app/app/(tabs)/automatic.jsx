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
  const [conditionsLoaded, setConditionsLoaded] = useState(false);
  const [previousTintLevel, setPreviousTintLevel] = useState(0);

  
  const windowNumber = 1;

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_IP);

   ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type === 'data') {
        const { Temp, Lux, Wind } = message;
        if (Wind === 1 || Wind === 2) {
          setTemperature(Temp);
          setLux(Lux);
        }
      }
    };

    ws.current.onerror = (e) => {
      console.error('WebSocket error:', e.message);
    };

    /*ws.current.onclose = () => {
      console.log('WebSocket closed');
    };*/

    return () => {
      /*if (ws.current) {
        ws.current.close();
      }*/
        console.log('WebSocket open', e.message);
    };
  }, []);

  /*useEffect(() => {
    const fetchConditions = async () => {
      try {
        const response1 = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/conditions/1`);
        const data1 = await response1.json();
        const response2 = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/conditions/2`);
        const data2 = await response2.json();
        const combinedData = [...data1, ...data2];
        setConditions(combinedData);
        setConditionsLoaded(true);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchConditions();
  }, []);*/

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const response = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/conditions/1`);
        const data = await response.json();
        setConditions(data);
        setConditionsLoaded(true);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchConditions();
  }, []);


  useEffect(() => {
    if (conditionsLoaded && temperature !== null && lux !== null) {
      updateTintLevel(temperature, lux, conditions);
    }
  }, [temperature, lux, conditionsLoaded, conditions]);


  const updateTintLevel = (temperature, lux, conditions) => {

    setPreviousTintLevel(tintLevel);
    if (conditions.length === 0) {
      console.log('No conditions available to update tint level.');
      return;
    }

    let newTintLevel = 0;
    console.log('Initial newTintLevel:', newTintLevel);

    conditions.forEach((condition) => {
      console.log('Evaluating condition:', condition);
      if (condition.type === 'temperature' && temperature >= condition.temperatureValue) {
        console.log(`Sensor temp ${temperature}  is greater than equal to User input ${condition.temperatureValue}`)
        setPreviousTintLevel(tintLevel); 
        newTintLevel = Math.max(newTintLevel, condition.tintLevel);
        console.log(`Updated newTintLevel (temperature condition): ${newTintLevel}`);
        setTintLevel(newTintLevel);
        sendTintLevelToWebSocket(newTintLevel);

      }  else if (condition.type === 'temperature' && temperature < condition.temperatureValue) {
        console.log(`Sensor temp ${temperature}  is less than  User input ${condition.temperatureValue}`)
        console.log('Window is set to its previous value:', previousTintLevel);
        setTintLevel(previousTintLevel); 
        sendTintLevelToWebSocket(previousTintLevel);
      
      }   if (condition.type === 'lux' && lux >= condition.luxValue) {
        console.log(`Sensor lux ${lux}  is greater than equal to User input ${condition.luxValue}`)
        setPreviousTintLevel(tintLevel); 
        newTintLevel = Math.max(newTintLevel, condition.tintLevel);
        console.log(`Updated newTintLevel (lux condition): ${newTintLevel}`);
        setTintLevel(newTintLevel);
        sendTintLevelToWebSocket(newTintLevel);

      }  else if (condition.type === 'lux' && lux < condition.luxValue) {
        console.log(`Sensor lux ${lux}  is less than  User input ${condition.luxValue}`)
        console.log('Window is set to its previous value:', previousTintLevel);
        setTintLevel(previousTintLevel); 
        sendTintLevelToWebSocket(previousTintLevel);
      } 
      
    });

  };

  const openEditModal = (index) => {
    const condition = conditions[index];
    setTintLevel(condition.tintLevel);
    if (condition.type === 'temperature') {
      setConditionType('temperature');
      setTemperatureCondition(condition.temperatureValue);
      setLuxCondition(null);
    } else if (condition.type === 'lux') {
      setConditionType('lux');
      setLuxCondition(condition.luxValue);
      setTemperatureCondition(null);
    }
    setEditingConditionIndex(index);
    setModalVisible(true);
  };

  const openAddModal = () => {
    setTintLevel(0);
    setConditionType('temperature');
    setTemperatureCondition(null);
    setLuxCondition(null);
    setEditingConditionIndex(null);
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
      await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/conditions/${conditions[index]._id}`, {
        method: 'DELETE',
      });
      setConditions(conditions.filter((_, i) => i !== index));
    } catch (error) {
      console.error(error);
    }
  };

  const sendTintLevelToWebSocket = (tintValue) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ window: 1, action: 'set', value: tintValue }));
      ws.current.send(JSON.stringify({ window: 2, action: 'set', value: tintValue }));
    }
  };

  const taskManager = (label) => {
    setFocusedItem(label);
    switch (label) {
      case 'Privacy':
        router.replace(`/privacy`);
        break;
      case 'Schedule':
        router.replace(`/schedule`);
        break;
      case 'Automatic':
        router.replace(`/automatic`);
        break;
      default:
        router.replace(`/sync`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#161622" style="dark" />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBarButton} onPress={() => router.replace(`/sync`)}>
          <Icon name="chevron-back-sharp" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.navBarText}>Synchronization for Automatic Mode</Text>
        <TouchableOpacity style={styles.plusButton} onPress={openAddModal}>
          <Icon name="add-circle-sharp" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <FlatList
          data={conditions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.scheduleItem}>
              <Text style={styles.buttonText}>Condition</Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>{item.type === 'temperature' ? 'Temperature: ' : '             Lux: '}</Text>
                {item.type === 'temperature' ? `${item.temperatureValue} °F` : `${item.luxValue} lx`}{' '}
                <Text style={{ fontWeight: 'bold' }}>                   Tint Level: </Text>{item.tintLevel}%
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => openEditModal(index)}>
                  <Icon name="create" size={20} color="#007BFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => deleteCondition(index)}>
                  <Icon name="trash" size={20} color="#FF0000" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

<Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Condition</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type:</Text>
              <View style={styles.conditionTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.conditionTypeButton,
                    conditionType === 'temperature' && styles.conditionTypeButtonSelected,
                  ]}
                  onPress={() => setConditionType('temperature')}
                >
                  <Text
                    style={[
                      styles.conditionTypeButtonText,
                      conditionType === 'temperature' && styles.conditionTypeButtonTextSelected,
                    ]}
                  >
                    Temperature
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.conditionTypeButton,
                    conditionType === 'lux' && styles.conditionTypeButtonSelected,
                  ]}
                  onPress={() => setConditionType('lux')}
                >
                  <Text
                    style={[
                      styles.conditionTypeButtonText,
                      conditionType === 'lux' && styles.conditionTypeButtonTextSelected,
                    ]}
                  >
                    Lux
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {conditionType === 'temperature'? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Temperature Value:</Text>
                <TextInput
                  style={styles.input}
                  value={temperatureCondition !== null ? temperatureCondition.toString() : ''}
                  onChangeText={(text) => setTemperatureCondition(text)}
                  keyboardType="numeric"
                />
              </View>
            ) : null}
            {conditionType === 'lux' ? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Lux Value:</Text>
                <TextInput
                  style={styles.input}
                  value={luxCondition !== null ? luxCondition.toString() : ''}
                  onChangeText={(text) => setLuxCondition(text)}
                  keyboardType="numeric"
                />
              </View>
            ) : null}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tint Level:</Text>
              <Slider
                style={styles.slider}
                value={tintLevel}
                onValueChange={setTintLevel}
                minimumValue={0}
                maximumValue={100}
                step={10}
              />
              <Text style={styles.sliderValue}>{tintLevel}%</Text>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={saveCondition}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </Modal>
        <View style={styles.taskbar}>
        <TaskBarItem
          icon="logo-windows"
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
          icon="aperture-sharp"
          label="Automatic"
          isFocused={focusedItem === 'Automatic'}
          onPress={taskManager}
        />
      </View>
    </SafeAreaView>
  );
};


const TaskBarItem = ({ icon, label, isFocused, onPress }) => (
  <TouchableOpacity
    style={[styles.taskbarItem, isFocused && styles.taskbarItemFocused]}
    onPress={() => onPress(label)}
  >
    <Icon name={icon} size={24} color={isFocused ? 'gold' : '#fff'} />
    <Text style={[styles.taskbarLabel, isFocused && styles.taskbarLabelFocused]}>
      {label}
    </Text>
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
    paddingVertical: 10,
    justifyContent: 'space-between',
    backgroundColor: 'gold',
  },
  navBarText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  plusButton: {
    backgroundColor: 'gold',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  navBarButton: {
    padding: 10,
    color: 'black',
  },
  scheduleItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    marginLeft: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 90,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  conditionTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  conditionTypeButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  conditionTypeButtonSelected: {
    backgroundColor: 'gold',
    borderColor: 'black',
  },
  conditionTypeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  conditionTypeButtonTextSelected: {
    color: 'black',
  },
  slider: {
    width: '100%',
    color: 'black',
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'gold',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
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

export default Automatic;
