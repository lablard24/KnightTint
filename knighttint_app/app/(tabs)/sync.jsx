/*
// WIP but show both progress circle and buttons

import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { WEBSOCKET_IP } from '../config';

export default function Sync() {
  const [windowData, setWindowData] = useState({});
  const [focusedItem, setFocusedItem] = useState('Home');
  const ws = useRef(null);
  const router = useRouter();
  const { windowNumber } = useLocalSearchParams();
  const currentWindowNumbers = [1, 2];

  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_IP);

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.current.onmessage = (e) => {
      console.log('WebSocket message received:', e.data);
      const data = JSON.parse(e.data);

      setWindowData(prevData => ({
        ...prevData,
        [data.Wind]: {
          Temp: data.Temp,
          Lux: data.Lux,
          Tint: data.Tint
        }
      }));
    };

    ws.current.onerror = (e) => {
      console.log('WebSocket error: ', e.message);
    };

    ws.current.onclose = (e) => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const backHome = () => {
    router.replace('/home');
  };

  const taskManager = (label) => {
    setFocusedItem(label);
    switch (label) {
      case 'Privacy':
        router.replace(`/privacy${currentWindowNumbers}`);
        break;
      case 'Schedule':
        router.replace(`/schedule${currentWindowNumbers}`);
        break;
      case 'Automatic':
        router.replace(`/automatic${currentWindowNumbers}`);
        break;
      default:
        router.replace(`/window${currentWindowNumbers}`);
    }
  };

  const increaseTint = (windowNumber) => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ window: windowNumber, action: 'plus' }));
      setWindowData(prevData => ({
        ...prevData,
        [windowNumber]: {
          ...prevData[windowNumber],
          Tint: Math.min(100, prevData[windowNumber].Tint + 10)
        }
      }));
    }
  };

  const decreaseTint = (windowNumber) => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ window: windowNumber, action: 'minus' }));
      setWindowData(prevData => ({
        ...prevData,
        [windowNumber]: {
          ...prevData[windowNumber],
          Tint: Math.max(0, prevData[windowNumber].Tint - 10)
        }
      }));
    }
  };

  const getCurrentWindowData = (windowNumber) => windowData[windowNumber] || { Temp: '-', Lux: '-', Tint: 0 };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#161622" style="dark" />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBarButton} onPress={backHome}>
          <Icon name="chevron-back-sharp" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.navBarText}>Synchronize Mode</Text>
      </View>

      <View style={styles.container}>
        {currentWindowNumbers.map(windowNumber => {
          const currentWindowData = getCurrentWindowData(windowNumber);
          return (
            <View key={windowNumber} style={styles.windowContainer}>
              <Text style={styles.label}>Temperature: {currentWindowData.Temp} °F</Text>
              <Text style={styles.label}>LUX: {currentWindowData.Lux} lx</Text>
              <Text style={styles.label}>Tint level: {currentWindowData.Tint}%</Text>
              <View style={styles.content}>
                <ProgressCircle
                  percent={currentWindowData.Tint}
                  radius={50}
                  borderWidth={10}
                  color="black"
                  shadowColor="grey"
                  bgColor="#fff"
                >
                  <Text style={styles.progressText}>{`${currentWindowData.Tint}%`}</Text>
                </ProgressCircle>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={() => decreaseTint(windowNumber)}>
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => increaseTint(windowNumber)}>
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'gold',
  },
  navBarText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  navBarButton: {
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  windowContainer: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    margin: 5,
    color: '#003366',
  },
  content: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'gold',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'black',
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
});*/

import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { WEBSOCKET_IP } from '../config';

export default function Window() {
  const [windowData, setWindowData] = useState({});
  const [focusedItem, setFocusedItem] = useState('Home');
  const ws = useRef(null);
  const router = useRouter();
  const { windowNumber } = useLocalSearchParams();
  const currentWindowNumbers = [1, 2];

  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_IP);

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.current.onmessage = (e) => {
      console.log('WebSocket message received:', e.data);
      const data = JSON.parse(e.data);

      setWindowData(prevData => ({
        ...prevData,
        [data.Wind]: {
          Temp: data.Temp,
          Lux: data.Lux,
          Tint: data.Tint
        }
      }));
    };

    ws.current.onerror = (e) => {
      console.log('WebSocket error: ', e.message);
    };

    ws.current.onclose = (e) => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const backHome = () => {
    router.replace('/home');
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

  const increaseTint = () => {
    currentWindowNumbers.forEach(windowNumber => {
      if (ws.current) {
        ws.current.send(JSON.stringify({ window: windowNumber, action: 'plus' }));
        setWindowData(prevData => ({
          ...prevData,
          [windowNumber]: {
            ...prevData[windowNumber],
            Tint: Math.min(100, prevData[windowNumber].Tint + 10)
          }
        }));
      }
    });
  };

  const decreaseTint = () => {
    currentWindowNumbers.forEach(windowNumber => {
      if (ws.current) {
        ws.current.send(JSON.stringify({ window: windowNumber, action: 'minus' }));
        setWindowData(prevData => ({
          ...prevData,
          [windowNumber]: {
            ...prevData[windowNumber],
            Tint: Math.max(0, prevData[windowNumber].Tint - 10)
          }
        }));
      }
    });
  };

  const getCurrentWindowData = (windowNumber) => windowData[windowNumber] || { Temp: '-', Lux: '-', Tint: 0 };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#161622" style="dark" />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBarButton} onPress={backHome}>
          <Icon name="chevron-back-sharp" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.navBarText}>Synchronization Mode</Text>
      </View>

      <View style={styles.container}>
        {currentWindowNumbers.map(windowNumber => {
          const currentWindowData = getCurrentWindowData(windowNumber);
          return (
            <View key={windowNumber} style={styles.windowContainer}>
             <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Window {windowNumber}</Text>
              <Text style={styles.label}>Temperature: {currentWindowData.Temp} °F</Text>
              <Text style={styles.label}>LUX: {currentWindowData.Lux} lx</Text>
              <Text style={styles.label}>Tint level: {currentWindowData.Tint}%</Text>
              <View style={styles.content}>
                <ProgressCircle
                  percent={currentWindowData.Tint}
                  radius={50}
                  borderWidth={10}
                  color="black"
                  shadowColor="grey"
                  bgColor="#fff"
                >
                  <Text style={styles.progressText}>{`${currentWindowData.Tint}%`}</Text>
                </ProgressCircle>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={decreaseTint}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={increaseTint}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'gold',
  },
  navBarText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    flex: 1,
    paddingHorizontal: 50,
  },
  navBarButton: {
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  windowContainer: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    margin: 5,
    color: '#003366',
  },
  content: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 240,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'gold',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'black',
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

