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

  const ws1 = useRef(null);
  const ws2 = useRef(null);
  const windowNumber = 1;

  useEffect(() => {
    ws1.current = new WebSocket(WEBSOCKET_IP);
    ws2.current = new WebSocket(WEBSOCKET_IP);

    ws1.current.onopen = () => {
      console.log('WebSocket for window 1 connected');
    };

    ws2.current.onopen = () => {
      console.log('WebSocket for window 2 connected');
    };

    ws1.current.onerror = (e) => {
      console.error('WebSocket error for window 1:', e.message);
    };

    ws2.current.onerror = (e) => {
      console.error('WebSocket error for window 2:', e.message);
    };

    ws1.current.onclose = () => {
      console.log('WebSocket for window 1 closed');
    };

    ws2.current.onclose = () => {
      console.log('WebSocket for window 2 closed');
    };

    return () => {
      if (ws1.current) {
        ws1.current.close();
      }
      if (ws2.current) {
        ws2.current.close();
      }
    };
  }, []);

  useEffect(() => {

    /*const fetchConditions = async () => {
      try {
        const response1 = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/schedules/1`);
        const data1 = await response1.json();
        
        const response2 = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/schedules/2`);
        const data2 = await response2.json();

        const combinedData = [...data1, ...data2];
        setConditions(combinedData);
        console.log('Conditions set to:', combinedData);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };*/
    
    const fetchConditions = async () => {
      try {
        const response = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/schedules/${windowNumber}`);
        const data = await response.json();
        setConditions(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchConditions();
  }, [windowNumber]);

  useEffect(() => {
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
          sendTintLevelToWebSocket(condition.tintLevel);
        }
      });
    };

    const interval = setInterval(checkAndUpdateTintLevel, 60000);
    return () => clearInterval(interval);
  }, [conditions]);

  const openEditModal = (index) => {
    const condition = conditions[index];
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
      windowNumber,
      hour,
      minute,
      days,
      tintLevel,
    };

    try {

     /* let response1, response2;
      if (editingConditionIndex !== null) {
        response1 = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/schedules/${conditions[editingConditionIndex]._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCondition),
        });
        
        response2 = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/schedules/${conditions[editingConditionIndex]._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCondition),
        });
      } else {
        response1 = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/schedules`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...newCondition, windowNumber: 1 }),
        });
        
        response2 = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/schedules`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...newCondition, windowNumber: 2 }),
        });
      }

      const updatedCondition1 = await response1.json();
      const updatedCondition2 = await response2.json();
      if (editingConditionIndex !== null) {
        const updatedConditions = [...conditions];
        updatedConditions[editingConditionIndex] = updatedCondition1;
        setConditions(updatedConditions);
        setEditingConditionIndex(null);
      } else {
        setConditions([...conditions, updatedCondition1, updatedCondition2]);
      }*/

        let response;
        if (editingConditionIndex !== null) {
          response = await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/schedules/${conditions[editingConditionIndex]._id}`, {
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
          const updatedConditions = [...conditions];
          updatedConditions[editingConditionIndex] = updatedCondition;
          setConditions(updatedConditions);
          setEditingConditionIndex(null);
        } else {
          setConditions([...conditions, updatedCondition]);
        }

      setHour('');
      setMinute('');
      setDays([]);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  /*const deleteCondition = async (index) => {
    try {
      await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/schedules/${conditions[index]._id}`, {
        method: 'DELETE',
      });
      setConditions(conditions.filter((_, i) => i !== index));
    } catch (error) {
      console.error(error);
    }
  };*/

  const deleteCondition = async (index) => {
    try {
      await fetch(`${SERVER_PROTOCOL}://${SERVER_DOMAIN}/schedules/${conditions[index]._id}`, {
        method: 'DELETE',
      });
      setConditions(conditions.filter((_, i) => i !== index));
    } catch (error) {
      console.error(error);
    }
  };

  const sendTintLevelToWebSocket = (tintValue) => {
    if (ws1.current && ws1.current.readyState === WebSocket.OPEN) {
      ws1.current.send(JSON.stringify({ window: 1, action: 'set', value: tintValue }));
    }
    if (ws2.current && ws2.current.readyState === WebSocket.OPEN) {
      ws2.current.send(JSON.stringify({ window: 2, action: 'set', value: tintValue }));
    }
  };

  const toggleDay = (day) => {
    setDays((prevDays) =>
      prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
    );
  };

  const backHome = () => {
    router.replace('/sync');
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
        <TouchableOpacity style={styles.navBarButton} onPress={backHome}>
          <Icon name="chevron-back-sharp" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.navBarText}>Synchronization for Schedule Mode</Text>
        <TouchableOpacity style={styles.plusButton} onPress={openAddModal}>
          <Icon name="add-circle-sharp" size={30} color="#000" />
        </TouchableOpacity>
      </View>


      <View style={styles.content}>
        <FlatList
          data={conditions || []}
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
    backgroundColor: 'white',
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
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
   // textAlign: 'center',
    
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


