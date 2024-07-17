import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { SERVER_DOMAIN, SERVER_PROTOCOL, WEBSOCKET_IP } from '../config';

const Schedule = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [focusedItem, setFocusedItem] = useState('Schedule');
  const [tintLevel, setTintLevel] = useState(0);
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [days, setDays] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [editingConditionIndex, setEditingConditionIndex] = useState(null);
  const [conditionsWindow1, setConditionsWindow1] = useState([]);



  const windowNumber1 = 1;
  const windowNumber2 = 2;
  const ws1 = useRef(null);
  const ws2 = useRef(null);

  useEffect(() => {
    ws1.current = new WebSocket(WEBSOCKET_IP);
    ws2.current = new WebSocket(WEBSOCKET_IP);

    ws1.current.onopen = () => {
      console.log('WebSocket connected for window 1');
    };

    ws1.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type === 'data') {
        const { Wind } = message;
        if (Wind === windowNumber1) {
          // Handle data for window 1 if necessary
        }
      }
    };

    ws1.current.onerror = (e) => {
      console.error('WebSocket error for window 1:', e.message);
    };

    ws1.current.onclose = () => {
      console.log('WebSocket closed for window 1');
    };

    ws2.current.onopen = () => {
      console.log('WebSocket connected for window 2');
    };

    ws2.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type === 'data') {
        const { Wind } = message;
        if (Wind === windowNumber2) {
          // Handle data for window 2 if necessary
        }
      }
    };

    ws2.current.onerror = (e) => {
      console.error('WebSocket error for window 2:', e.message);
    };

    ws2.current.onclose = () => {
      console.log('WebSocket closed for window 2');
    };

    return () => {
      if (ws1.current) ws1.current.close();
      if (ws2.current) ws2.current.close();
    };
  }, []);

  /*useEffect(() => {
    const fetchConditions = async (windowNumber) => {
      try {
        const response = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/schedules/${windowNumber}`);
        const data = await response.json();
        setConditions((prevConditions) => [...prevConditions, ...data]);
        console.log(`Conditions set for window ${windowNumber}:`, data);
      } catch (error) {
        console.error(`Fetch error for window ${windowNumber}:`, error);
      }
    };

    fetchConditions(windowNumber1);
    fetchConditions(windowNumber2);
  }, []);*/

  const fetchConditions = async (windowNumber, setConditions) => {
    try {
      const response = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/schedules/${windowNumber}`);
      const data = await response.json();
      setConditions(data);
      console.log(`Conditions set for window ${windowNumber}:`, data);
    } catch (error) {
      console.error(`Fetch error for window ${windowNumber}:`, error);
    }
  };
  
  useEffect(() => {
    fetchConditions(windowNumber1, setConditionsWindow1);
    fetchConditions(windowNumber2, () => {}); // Fetch for window 2 but don't set the state
  }, []);
  

  /*useEffect(() => {
    const checkAndUpdateTintLevel = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentDay = now.getDay(); // 0 (Sunday) to 6 (Saturday)

      conditions.forEach((condition) => {
        if (
          condition.hour == currentHour &&
          condition.minute == currentMinute &&
          condition.days.includes(currentDay)
        ) {
          setTintLevel(condition.tintLevel);
          sendTintLevelToWebSocket(condition.tintLevel, condition.windowNumber);
        }
      });
    };

    const interval = setInterval(checkAndUpdateTintLevel, 60000);
    return () => clearInterval(interval);
  }, [conditions]);*/

  useEffect(() => {
    const checkAndUpdateTintLevel = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentDay = now.getDay(); // 0 (Sunday) to 6 (Saturday)
  
      conditionsWindow1.forEach((condition) => {
        if (
          condition.hour == currentHour &&
          condition.minute == currentMinute &&
          condition.days.includes(currentDay)
        ) {
          setTintLevel(condition.tintLevel);
          sendTintLevelToWebSocket(condition.tintLevel, condition.windowNumber);
        }
      });
    };
  
    const interval = setInterval(checkAndUpdateTintLevel, 60000);
    return () => clearInterval(interval);
  }, [conditionsWindow1]);
  

  const openEditModal = (index) => {
    const condition = conditionsWindow1[index];
    setTintLevel(condition.tintLevel);
    setHour(condition.hour);
    setMinute(condition.minute);
    setDays(condition.days);
    setEditingConditionIndex(index);
    setModalVisible(true);
  };

  const openAddModal = () => {
    setTintLevel(0);
    setHour('');
    setMinute('');
    setDays([]);
    setEditingConditionIndex(null);
    setModalVisible(true);
  };

  const saveCondition = async () => {
    let newCondition = {
      windowNumber: windowNumber1,
      hour,
      minute,
      days,
      tintLevel,
    };

    try {
      let response;
      if (editingConditionIndex !== null) {
        response = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/schedules/${conditionsWindow1[editingConditionIndex]._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCondition),
        });
      } else {
        response = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/schedules`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCondition),
        });
      }

      const updatedCondition = await response.json();
      if (editingConditionIndex !== null) {
        const updatedConditions = [...conditionsWindow1];
        updatedConditions[editingConditionIndex] = updatedCondition;
        setConditionsWindow1(updatedConditions);
        setEditingConditionIndex(null);
      } else {
        setConditionsWindow1([...conditionsWindow1, updatedCondition]);
      }

      setHour('');
      setMinute('');
      setDays([]);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCondition = async (index) => {
    try {
      await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/schedules/${conditionsWindow1[index]._id}`, {
        method: 'DELETE',
      });
      setConditionsWindow1(conditionsWindow1.filter((_, i) => i !== index));
    } catch (error) {
      console.error(error);
    }
  };

  /*const sendTintLevelToWebSocket = (tintValue, windowNumber) => {
    const ws = windowNumber === windowNumber1 ? ws1.current : ws2.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ window: windowNumber, action: 'set', value: tintValue }));
    }
  };*/

  const sendTintLevelToWebSocket = (tintValue, window) => {
    if (window === windowNumber1) {
      if (ws1.current && ws1.current.readyState === WebSocket.OPEN) {
        console.log(`Sending tint level ${tintValue} to Window ${windowNumber1}`);
        ws1.current.send(JSON.stringify({ window: windowNumber1, action: 'set', value: tintValue }));
      } else {
        console.log(`WebSocket not open for Window ${windowNumber1}`);
      }
    } else if (window === windowNumber2) {
      if (ws2.current && ws2.current.readyState === WebSocket.OPEN) {
        console.log(`Sending tint level ${tintValue} to Window ${windowNumber2}`);
        ws2.current.send(JSON.stringify({ window: windowNumber2, action: 'set', value: tintValue }));
      } else {
        console.log(`WebSocket not open for Window ${windowNumber2}`);
      }
    }
  };

  
  const toggleDay = (day) => {
    setDays((prevDays) =>
      prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
    );
  };

  const taskManager = (label) => {
    setFocusedItem(label);
    switch (label) {
      case 'Privacy':
        router.replace(`/privacy${windowNumber1}`);
        break;
      case 'Schedule':
        router.replace(`/schedule${windowNumber1}`);
        break;
      case 'Automatic':
        router.replace(`/automatic${windowNumber1}`);
        break;
      default:
        router.replace(`/window${windowNumber1}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#161622" style="dark" />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBarButton} onPress={() => router.replace(`/window${windowNumber1}`)}>
          <Icon name="chevron-back-sharp" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.navBarText}>Schedule for Window {windowNumber1}</Text>
        <TouchableOpacity style={styles.plusButton} onPress={openAddModal}>
          <Icon name="add-circle-sharp" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <FlatList
          data={conditionsWindow1 || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.scheduleItem}>
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Time: </Text>
                  {`${item.hour % 12 === 0 ? 12 : item.hour % 12}:${item.minute < 10 ? `0${item.minute}` : item.minute} ${item.hour >= 12 ? 'PM' : 'AM'}`}
                  {'\n'}
                  <Text style={{ fontWeight: 'bold' }}>Days: </Text>
                  {item.days.map(day => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]).join(', ')}
                  {'\n'}
                  <Text style={{ fontWeight: 'bold' }}>Tint Level: </Text>{item.tintLevel}%
                </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => openEditModal(index)}>
                  <Icon name="create" size={20} color="#007BFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => deleteCondition(index)}>
                  <Icon name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
      {/* <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Set Schedule for Window {windowNumber1}</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Hour:</Text>
            <TextInput
              style={styles.input}
              placeholder="Hour"
              keyboardType="numeric"
              value={hour}
              onChangeText={setHour}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Minute:</Text>
            <TextInput
              style={styles.input}
              placeholder="Minute"
              keyboardType="numeric"
              value={minute}
              onChangeText={setMinute}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Days:</Text>
            <View style={styles.daysContainer}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    days.includes(index) ? styles.dayButtonSelected : {},
                  ]}
                  onPress={() => toggleDay(index)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      days.includes(index) ? styles.dayButtonTextSelected : {},
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tint Level:</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={tintLevel}
              onValueChange={setTintLevel}
              minimumTrackTintColor="#007BFF"
              maximumTrackTintColor="#000000"
            />
            <Text style={styles.tintLevelText}>{tintLevel}%</Text>
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
      </Modal> */}
       <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Schedule</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hour:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter hour (e.g., 06 or 18)"
                value={hour.toString()} // Ensure the value is a string
                onChangeText={(text) => setHour(parseInt(text) || 0)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Minute:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter minute (e.g., 50)"
                value={minute.toString()} // Ensure the value is a string
                onChangeText={(text) => setMinute(parseInt(text) || 0)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Days:</Text>
              <View style={styles.daysContainer}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <TouchableOpacity
                    key={day}
                    style={[styles.dayButton, days.includes(index) && styles.dayButtonSelected]}
                    onPress={() => toggleDay(index)}
                  >
                    <Text style={[styles.dayButtonText, !days.includes(index) && { color: '#000' }]}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
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
            
              <View style={styles.modalButtonGroup}>
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
  navBarButton: {
    padding: 10,
    color: 'black',
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
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 5,
    marginBottom: 10,
    width: '30%',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: 'gold',
    borderColor: 'black',
  },
  dayButtonText: {
    color: 'black',
  },
  slider: {
    width: '100%',
    height: 40,
    color: 'black',
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '28%',
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

export default Schedule;
