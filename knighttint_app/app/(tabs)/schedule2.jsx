// Everything works fine
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { WEBSOCKET_IP } from '../config';

const Schedule = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmpm] = useState('AM');
  const [tintLevel, setTintLevel] = useState(0);
  const [repeatDays, setRepeatDays] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const windowNumber = 2; // Replace with your hardcoded window number

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
    router.replace('/home');
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
        <FlatList
          data={schedules}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <View style={styles.scheduleItem}>
              <Text>Time: {item.hour}:{item.minute} {item.ampm}</Text>
              <Text>Tint Level: {item.tintLevel}%</Text>
              <Text>Repeat: {item.repeatDays.join(', ')}</Text>
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
    </SafeAreaView>
  );
}

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
});
