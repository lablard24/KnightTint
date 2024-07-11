/*import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { WEBSOCKET_IP } from '../config';

const Schedule = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [focusedItem, setFocusedItem] = useState('Schedule');
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmpm] = useState('AM');
  const [tintLevel, setTintLevel] = useState(0);
  const [repeatDays, setRepeatDays] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const windowNumber = 1;

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_IP);
    
    ws.current.onopen = () => {
      console.log('WebSocket connected');
      fetchSchedules();
    };

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type === 'schedules') {
        const updatedSchedules = message.schedules
          .filter(schedule => schedule.windowNumber === windowNumber)
          .map(schedule => {
            const { hour, minute, ampm } = convertTo12Hour(`${schedule.hour}:${schedule.minute}`);
            return { ...schedule, hour, minute, ampm };
          });
        setSchedules(updatedSchedules);
      } else if (message.type === 'update') {
        fetchSchedules(); // Refresh schedules on any update
      }
    };

    ws.current.onerror = (e) => {
      console.error('WebSocket error:', e.message);
    };

    ws.current.onclose = (e) => {
      console.log('WebSocket closed');
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const fetchSchedules = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'getSchedules', windowNumber }));
    } else {
      console.error('WebSocket is not open');
    }
  };

  const toggleDay = (day) => {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const backHome = () => {
    router.replace(`/window${windowNumber}`);
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

  const convertTo24Hour = (hour, minute, ampm) => {
    let hours24 = parseInt(hour, 10);
    if (ampm === 'PM' && hours24 !== 12) {
      hours24 += 12;
    } else if (ampm === 'AM' && hours24 === 12) {
      hours24 = 0;
    }
    return `${String(hours24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  const convertTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(':');
    let hours12 = parseInt(hours, 10);
    const ampm = hours12 >= 12 ? 'PM' : 'AM';
    hours12 = hours12 % 12 || 12;
    return { hour: String(hours12).padStart(2, '0'), minute: String(minutes).padStart(2, '0'), ampm };
  };

  const saveSchedule = () => {
    const time24 = convertTo24Hour(hour, minute, ampm);
    const [hours24, minutes24] = time24.split(':');
    const newSchedule = {
      type: editingScheduleId ? 'edit' : 'schedule',
      windowNumber,
      hour: hours24,
      minute: minutes24,
      tintLevel,
      repeatDays,
    };
    if (editingScheduleId) {
      newSchedule.id = editingScheduleId;
    }
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(newSchedule));
      setModalVisible(false);
      // Update state immediately
      if (editingScheduleId) {
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule._id === editingScheduleId ? { ...schedule, hour, minute, ampm, tintLevel, repeatDays } : schedule
          )
        );
      } else {
        setSchedules((prev) => [
          ...prev,
          { ...newSchedule, _id: Date.now().toString(), hour, minute, ampm },
        ]);
      }
      setEditingScheduleId(null);
    } else {
      console.error('WebSocket is not open');
    }
  };

  const editSchedule = (index) => {
    const schedule = schedules[index];
    const { hour, minute, ampm } = convertTo12Hour(`${schedule.hour}:${schedule.minute}`);
    setHour(hour);
    setMinute(minute);
    setAmpm(ampm);
    setTintLevel(schedule.tintLevel);
    setRepeatDays(schedule.repeatDays);
    setEditingScheduleId(schedule._id);
    setModalVisible(true);
  };

  const deleteSchedule = (index) => {
    const scheduleToDelete = schedules[index];
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'delete', id: scheduleToDelete._id, windowNumber }));
      setSchedules(schedules.filter((_, i) => i !== index)); // Update state immediately
    } else {
      console.error('WebSocket is not open');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
     <StatusBar backgroundColor="#161622" style="dark" />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBarButton} onPress={backHome}>
          <Icon name="chevron-back-sharp" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.navBarText}>Schedule for Window {windowNumber}</Text>
        <TouchableOpacity style={styles.plusButton} onPress={() => setModalVisible(true)}>
          <Icon name="add-circle-sharp" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {/* <FlatList
          data={schedules}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <View style={styles.scheduleItem}>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Time:</Text> {item.hour && item.minute && item.ampm ? `${item.hour}:${item.minute} ${item.ampm}` : 'Not Set'}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Tint Level:</Text> {item.tintLevel != null ? `${item.tintLevel}%` : 'Not Set'}
              </Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Repeat:</Text> {item.repeatDays.length ? item.repeatDays.join(', ') : 'Not Set'}
              </Text>

              <View style={styles.scheduleActions}>
                <TouchableOpacity onPress={() => editSchedule(index)}>
                  <Icon name="create-outline" size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteSchedule(index)}>
                  <Icon name="trash-outline" size={25} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          )}   
        /> *//*}
        <FlatList
  data={schedules}
  keyExtractor={(item) => item._id}
  renderItem={({ item, index }) => (
    <View style={styles.scheduleItem} key={item._id}>
      <Text>
        <Text style={{ fontWeight: 'bold' }}>Time:</Text> {item.hour ? `${item.hour}:${item.minute}` : 'Not Set'} {item.ampm ? item.ampm : 'Not Set'}
      </Text>
      <Text>
        <Text style={{ fontWeight: 'bold' }}>Tint Level:</Text> {item.tintLevel ? `${item.tintLevel}%` : 'Not Set'}
      </Text>
      <Text>
        <Text style={{ fontWeight: 'bold' }}>Repeat:</Text> {item.repeatDays && item.repeatDays.length > 0 ? item.repeatDays.join(', ') : 'Not Set'}
      </Text>

      <View style={styles.scheduleActions}>
        <TouchableOpacity key={`edit_${item._id}`} onPress={() => editSchedule(index)}>
          <Icon name="create-outline" size={25} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity key={`delete_${item._id}`} onPress={() => deleteSchedule(index)}>
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
            <Text style={styles.label}>Time</Text>
            <Picker
              selectedValue={hour}
              style={styles.picker}
              onValueChange={(itemValue) => setHour(itemValue)}
            >
              {Array.from({ length: 12 }, (_, i) => {
                const hourValue = String(i + 1).padStart(2, '0');
                return (
                  <Picker.Item key={i} label={`${hourValue}`} value={`${hourValue}`} />
                );
              })}
            </Picker>
            <Picker
              selectedValue={minute}
              style={styles.picker}
              onValueChange={(itemValue) => setMinute(itemValue)}
            >
              {Array.from({ length: 60 }, (_, i) => {
                const minuteValue = String(i).padStart(2, '0');
                return (
                  <Picker.Item key={i} label={`${minuteValue}`} value={`${minuteValue}`} />
                );
              })}
            </Picker>
            <Picker
              selectedValue={ampm}
              style={styles.picker}
              onValueChange={(itemValue) => setAmpm(itemValue)}
            >
              <Picker.Item label="AM" value="AM" />
              <Picker.Item label="PM" value="PM" />
            </Picker>
            <Text style={styles.label}>Tint Level: {tintLevel}%</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={tintLevel}
              onValueChange={(value) => setTintLevel(value)}
            />
            <Text style={styles.label}>Repeat Days</Text>
            <View style={styles.daysContainer}>
              {daysOfWeek.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    repeatDays.includes(day) && styles.dayButtonSelected,
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={saveSchedule}>
              <Text style={styles.saveButtonText}>Save Schedule</Text>
            </TouchableOpacity>
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
}

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

export default Schedule;

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
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navBarButton: {
    padding: 10,
    color: 'black',
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
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scheduleActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
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
  picker: {
    height: 50,
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  dayButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
    marginVertical: 5,
  },
  dayButtonSelected: {
    backgroundColor: 'gold',
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
});*/



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
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [days, setDays] = useState([]);
  const [conditions, setConditions] = useState([]);
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
      if (message.type === 'data') {
        const { Wind } = message;
        if (Wind === windowNumber) {
          // Handle data if necessary
        }
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
        const data = await response.json();
        setConditions(data);
        console.log('Conditions set to:', data);
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
      ws.current.send(JSON.stringify({ window: windowNumber, action: 'set', value: tintValue }));
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
          data={conditions || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.scheduleItem}>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Time: </Text>
                {`${item.hour}:${item.minute < 10 ? `0${item.minute}` : item.minute}`} 
                <Text style={{ fontWeight: 'bold' }}> Days: </Text>
                {item.days.map(day => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]).join(', ')} 
                <Text style={{ fontWeight: 'bold' }}> Tint Level: </Text>{item.tintLevel}%
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
              <Text style={styles.label}>Hour:</Text>
              <TextInput
                style={styles.input}
                value={hour}
                onChangeText={(text) => setHour(text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Minute:</Text>
              <TextInput
                style={styles.input}
                value={minute}
                onChangeText={(text) => setMinute(text)}
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
            <View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tint Level:</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={tintLevel}
                  onValueChange={(value) => setTintLevel(value)}
                  minimumTrackTintColor="#007AFF"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#007AFF"
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
        </View>
      </Modal>
      <View style={styles.footer}>
        {['Privacy', 'Schedule', 'Automatic'].map((item) => (
          <TouchableOpacity key={item} onPress={() => taskManager(item)} style={styles.footerItem}>
            <Icon
              name={item === 'Privacy' ? 'eye-off' : item === 'Schedule' ? 'time' : 'construct'}
              size={30}
              color={focusedItem === item ? '#1E90FF' : '#8A8A8A'}
            />
            <Text style={[styles.footerText, focusedItem === item && { color: '#1E90FF' }]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  navBarButton: {
    padding: 5,
  },
  navBarText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  plusButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  scheduleItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 5,
    padding: 10,
    width: '100%',
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
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  dayButtonText: {
    color: '#FFFFFF',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
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
    width: '48%',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginTop: 5,
    color: '#8A8A8A',
  },
});

export default Automatic;
