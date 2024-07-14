/*
// before changing the font and add the icons
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

  // Ensure windowNumber is set to 2
  const currentWindowNumber = 2;

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
        router.replace(`/privacy${currentWindowNumber}`);
        break;
      case 'Schedule':
        router.replace(`/schedule${currentWindowNumber}`);
        break;
      case 'Automatic':
        router.replace(`/automatic${currentWindowNumber}`);
        break;
      default:
        router.replace(`/window${currentWindowNumber}`);
    }
  };

  const increaseTint = () => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ window: currentWindowNumber, action: 'plus' }));
      setWindowData(prevData => ({
        ...prevData,
        [currentWindowNumber]: {
          ...prevData[currentWindowNumber],
          Tint: Math.min(100, prevData[currentWindowNumber].Tint + 10)
        }
      }));
    }
  };

  const decreaseTint = () => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ window: currentWindowNumber, action: 'minus' }));
      setWindowData(prevData => ({
        ...prevData,
        [currentWindowNumber]: {
          ...prevData[currentWindowNumber],
          Tint: Math.max(0, prevData[currentWindowNumber].Tint - 10)
        }
      }));
    }
  };

  const currentWindowData = windowData[currentWindowNumber] || { Temp: '-', Lux: '-', Tint: 0 };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#161622" style="dark" />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBarButton} onPress={backHome}>
          <Icon name="chevron-back-sharp" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.navBarText}>Window {currentWindowNumber}</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Temperature: {Math.round(currentWindowData.Temp)} °F</Text>
        <Text style={styles.label}>LUX: {Math.round(currentWindowData.Lux)} lx</Text>
        <Text style={styles.label}>Tint level: {Math.round(currentWindowData.Tint)}%</Text>
      </View>

      <View style={styles.content}>
        <ProgressCircle
          percent={currentWindowData.Tint}
          radius={100}
          borderWidth={20}
          color="black"
          shadowColor="grey"
          bgColor="#fff"
        >
          <Text style={styles.progressText}>{`${currentWindowData.Tint}%`}</Text>
        </ProgressCircle>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={decreaseTint}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={increaseTint}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 100,
    flex: 1,
  },
  navBarButton: {
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 20,
    margin: 10,
    color: '#003366',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 180,
  },
  progressText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'gold',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 100,
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
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  // Ensure windowNumber is set to 2
  const currentWindowNumber = 2;

  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_IP);

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.current.onmessage = (e) => {
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
        router.replace(`/privacy${currentWindowNumber}`);
        break;
      case 'Schedule':
        router.replace(`/schedule${currentWindowNumber}`);
        break;
      case 'Automatic':
        router.replace(`/automatic${currentWindowNumber}`);
        break;
      default:
        router.replace(`/window${currentWindowNumber}`);
    }
  };

  const increaseTint = () => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ window: currentWindowNumber, action: 'plus' }));
      setWindowData(prevData => ({
        ...prevData,
        [currentWindowNumber]: {
          ...prevData[currentWindowNumber],
          Tint: Math.min(100, prevData[currentWindowNumber].Tint + 10)
        }
      }));
    }
  };

  const decreaseTint = () => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ window: currentWindowNumber, action: 'minus' }));
      setWindowData(prevData => ({
        ...prevData,
        [currentWindowNumber]: {
          ...prevData[currentWindowNumber],
          Tint: Math.max(0, prevData[currentWindowNumber].Tint - 10)
        }
      }));
    }
  };

  const currentWindowData = windowData[currentWindowNumber] || { Temp: '-', Lux: '-', Tint: 0 };

  // Function to get temperature icon based on current temperature
  const getTemperatureIcon = (temp) => {
    if (temp <= 55) {
      return require('../assets/images/cold.png'); 
    } else if (temp <= 85) {
      return require('../assets/images/warm.png'); 
    } else {
      return require('../assets/images/hot.png'); 
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#161622" style="dark" />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBarButton} onPress={backHome}>
          <Icon name="chevron-back-sharp" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.navBarText}>Window {currentWindowNumber}</Text>
      </View>

      <View style={styles.container}>
     
        <View style={styles.temperatureContainer}>
        <Text>
        <Text style={{ fontWeight: 'bold', fontSize: 16,}}>Temperature:</Text> {Math.round(currentWindowData.Temp)} °F 
        <Text>   </Text><Image source={getTemperatureIcon(Math.round(currentWindowData.Temp))} style={styles.icon} />
        </Text>
        </View>
        <Text>
        <Text style={{ fontWeight: 'bold', fontSize: 16,}}>Lux: </Text>{Math.round(currentWindowData.Lux)} lx
        {'\n'}
        <Text style={{ fontWeight: 'bold', fontSize: 16,}}>Tint level: </Text>{Math.round(currentWindowData.Tint)}%
        </Text>
        
      </View>

      <View style={styles.content}>
        <ProgressCircle
          percent={currentWindowData.Tint}
          radius={100}
          borderWidth={20}
          color="black"
          shadowColor="grey"
          bgColor="#fff"
        >
          <Text style={styles.progressText}>{`${currentWindowData.Tint}%`}</Text>
        </ProgressCircle>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={decreaseTint}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={increaseTint}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 100,
    flex: 1,
  },
  navBarButton: {
    padding: 10,
  },
  container: {
    backgroundColor: '#fff',       
    borderRadius: 10,              
    shadowColor: '#000',           
    shadowOffset: {                
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,           
    shadowRadius: 3.84,            
    elevation: 5,                 
    padding: 20,                   
    margin: 10,                    
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,                           
    color: '#333',                
    marginBottom: 5,               
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 180,
    paddingTop:50,
  },
  progressText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'gold',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 100,
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
  icon: {
    width: 24,                    
    height: 24,                           
  },
});





