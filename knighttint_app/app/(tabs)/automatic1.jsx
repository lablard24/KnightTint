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
  const [tintLevel2, setTintLevel2] = useState(0);
  const [conditionType, setConditionType] = useState('temperature');
  const [temperatureCondition, setTemperatureCondition] = useState(null);
  const [luxCondition, setLuxCondition] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [conditions2, setConditions2] = useState([]);
  const [temperature, setTemperature] = useState(null);
  const [lux, setLux] = useState(null);
  const [temperature2, setTemperature2] = useState(null);
  const [lux2, setLux2] = useState(null);
  const [editingConditionIndex, setEditingConditionIndex] = useState(null);
  const [conditionsLoaded, setConditionsLoaded] = useState(false);
  const [conditionsLoaded2, setConditionsLoaded2] = useState(false);
  const [previousTintLevel, setPreviousTintLevel] = useState(0);
  const [previousTintLevel2, setPreviousTintLevel2] = useState(0);

  const windowNumber = 1;
  const windowNumber2 = 2;

  const ws = useRef(null);
  const ws2 = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_IP);

    ws.current.onopen = () => {
      console.log('WebSocket connected for window 1');
    };

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type === 'data' && message.Wind === windowNumber) {
        const { Temp, Lux } = message;
        setTemperature(Temp);
        setLux(Lux);
      }
    };

    ws.current.onerror = (e) => {
      console.error('WebSocket error for window 1:', e.message);
    };

    ws.current.onclose = () => {
      console.log('WebSocket closed for window 1');
    };

    ws2.current = new WebSocket(WEBSOCKET_IP);

    ws2.current.onopen = () => {
      console.log('WebSocket connected for window 2');
    };

    ws2.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type === 'data' && message.Wind === windowNumber2) {
        const { Temp, Lux } = message;
        setTemperature2(Temp);
        setLux2(Lux);
      }
    };

    ws2.current.onerror = (e) => {
      console.error('WebSocket error for window 2:', e.message);
    };

    ws2.current.onclose = () => {
      console.log('WebSocket closed for window 2');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (ws2.current) {
        ws2.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const response = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/conditions/${windowNumber}`);
        const data = await response.json();
        setConditions(data);
        setConditionsLoaded(true);
      } catch (error) {
        console.error('Fetch error for window 1:', error);
      }
    };

    fetchConditions();
  }, [windowNumber]);

  useEffect(() => {
    const fetchConditions2 = async () => {
      try {
        const response = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/conditions/${windowNumber2}`);
        const data = await response.json();
        setConditions2(data);
        setConditionsLoaded2(true);
      } catch (error) {
        console.error('Fetch error for window 2:', error);
      }
    };

    fetchConditions2();
  }, [windowNumber2]);

  useEffect(() => {
    if (conditionsLoaded && temperature !== null && lux !== null) {
      updateTintLevel(temperature, lux, conditions, windowNumber);
    }
    if (conditionsLoaded2 && temperature2 !== null && lux2 !== null) {
      updateTintLevel(temperature2, lux2, conditions2, windowNumber2);
    }
  }, [temperature, lux, conditionsLoaded, conditions, temperature2, lux2, conditionsLoaded2, conditions2]);

  const updateTintLevel = (temperature, lux, conditions, window) => {
    if (window === windowNumber) {
      setPreviousTintLevel(tintLevel);
    } else {
      setPreviousTintLevel2(tintLevel2);
    }

    if (conditions.length === 0) {
      console.log('No conditions available to update tint level.');
      return;
    }

    let newTintLevel = 0;
    conditions.forEach((condition) => {
      if (condition.type === 'temperature' && temperature >= condition.temperatureValue) {
        newTintLevel = Math.max(newTintLevel, condition.tintLevel);
      } else if (condition.type === 'lux' && lux >= condition.luxValue) {
        newTintLevel = Math.max(newTintLevel, condition.tintLevel);
      }
    });

    if (window === windowNumber) {
      setTintLevel(newTintLevel);
      sendTintLevelToWebSocket(newTintLevel, windowNumber);
    } else {
      setTintLevel2(newTintLevel);
      sendTintLevelToWebSocket(newTintLevel, windowNumber2);
    }
  };

  const sendTintLevelToWebSocket = (tintValue, window) => {
    if (window === windowNumber) {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ window: windowNumber, action: 'set', value: tintValue }));
      }
    } else {
      if (ws2.current && ws2.current.readyState === WebSocket.OPEN) {
        ws2.current.send(JSON.stringify({ window: windowNumber2, action: 'set', value: tintValue }));
      }
    }
  };

  const openAddModal = () => {
    setEditingConditionIndex(null);
    setConditionType('temperature');
    setTemperatureCondition(null);
    setLuxCondition(null);
    setModalVisible(true);
  };

  const openEditModal = (index) => {
    const condition = conditions[index];
    setEditingConditionIndex(index);
    setConditionType(condition.type);
    if (condition.type === 'temperature') {
      setTemperatureCondition(condition.temperatureValue);
    } else {
      setLuxCondition(condition.luxValue);
    }
    setTintLevel(condition.tintLevel);
    setModalVisible(true);
  };

  // const saveCondition = async () => {
  //   const newCondition = {
  //     type: conditionType,
  //     temperatureValue: temperatureCondition,
  //     luxValue: luxCondition,
  //     tintLevel,
  //   };

  //   let updatedConditions = [...conditions];
  //   if (editingConditionIndex !== null) {
  //     updatedConditions[editingConditionIndex] = newCondition;
  //   } else {
  //     updatedConditions.push(newCondition);
  //   }

  //   try {
  //     const response = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/conditions/${windowNumber}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(updatedConditions),
  //     });

  //     if (response.ok) {
  //       setConditions(updatedConditions);
  //       setModalVisible(false);
  //     } else {
  //       console.error('Failed to save condition:', response.statusText);
  //     }
  //   } catch (error) {
  //     console.error('Error saving condition:', error);
  //   }
  // };

  // const deleteCondition = async (index) => {
  //   const updatedConditions = conditions.filter((_, i) => i !== index);

  //   try {
  //     const response = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/conditions/${windowNumber}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(updatedConditions),
  //     });

  //     if (response.ok) {
  //       setConditions(updatedConditions);
  //     } else {
  //       console.error('Failed to delete condition:', response.statusText);
  //     }
  //   } catch (error) {
  //     console.error('Error deleting condition:', error);
  //   }
  // };

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
  const taskManager = (label) => {
    setFocusedItem(label);
    switch (label) {
      case 'Privacy':
        router.replace(`/privacy${windowNumber}`);
        break;
      case 'Schedule':
        router.replace(`/schedule${windowNumber}`);
        break;
      case 'Automatic':
        router.replace(`/automatic${windowNumber}`);
        break;
      default:
        router.replace(`/window${windowNumber}`);
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
        <TouchableOpacity style={styles.plusButton} onPress={openAddModal}>
        <Icon name="add-circle-sharp" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <FlatList
          data={conditions}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.scheduleItem}>
              <Text>
              <Text style={styles.buttonText}>Condition</Text>
              </Text>
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
      {/* <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editingConditionIndex !== null ? 'Edit Condition' : 'Add Condition'}</Text>
            <Text style={styles.inputLabel}>Type:</Text>
            
            <View style={styles.inputGroup}>
             

              
              <TouchableOpacity style={styles.typeButton} onPress={() => setConditionType('temperature')}>
                <Text style={conditionType === 'temperature' ? styles.typeButtonTextSelected : styles.typeButtonText}>Temperature</Text>
              </TouchableOpacity>




              <TouchableOpacity style={styles.typeButton} onPress={() => setConditionType('lux')}>
                <Text style={conditionType === 'lux' ? styles.typeButtonTextSelected : styles.typeButtonText}>Lux</Text>
              </TouchableOpacity>
            </View>
            {conditionType === 'temperature' ? (
              <TextInput
                style={styles.input}
                placeholder="Enter temperature (°F)"
                value={temperatureCondition !== null ? temperatureCondition.toString() : ''}
                onChangeText={(text) => setTemperatureCondition(text !== '' ? parseInt(text) : null)}
                keyboardType="numeric"
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Enter lux value (lx)"
                value={luxCondition !== null ? luxCondition.toString() : ''}
                onChangeText={(text) => setLuxCondition(text !== '' ? parseInt(text) : null)}
                keyboardType="numeric"
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Enter tint level (%)"
              value={tintLevel !== null ? tintLevel.toString() : ''}
              onChangeText={(text) => setTintLevel(text !== '' ? parseInt(text) : 0)}
              keyboardType="numeric"
            />
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
      </Modal> */}

<Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{editingConditionIndex !== null ? 'Edit Condition' : 'Add Condition'}</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type:</Text>
              <View style={styles.conditionTypeContainer}>
                <TouchableOpacity
                style={[styles.conditionTypeButton,conditionType === 'temperature' && styles.conditionTypeButtonSelected,]}
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
    backgroundColor: '#161622',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
    backgroundColor: 'gold',
  },
  navBarText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  plusButton: {
    backgroundColor: 'gold',
    borderRadius: 10,
    paddingHorizontal: 10,
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
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    marginLeft: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  inputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  inputLabel: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  typeButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  typeButtonTextSelected: {
    backgroundColor: 'gold',
    borderColor: 'black',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
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
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
    backgroundColor: 'gold',
  },
  navBarText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  plusButton: {
    backgroundColor: 'gold',
    borderRadius: 10,
    paddingHorizontal: 10,
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
    paddingHorizontal: 60,
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


