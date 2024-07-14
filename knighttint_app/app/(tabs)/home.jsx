/*// Works fine assanier
import { router, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { WEBSOCKET_IP } from '../config';

const Home = () => {
  const [focusedItem, setFocusedItem] = useState('Home');
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const ws = useRef(null);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    return currentHour < 12 ? 'Good Morning!' : 'Good Afternoon!';
  };

  const signOut = () => {
    router.replace('/signIn');
  };

  const handleNavigation = (label) => {
    setFocusedItem(label);
    switch (label) {
      case 'Home':
        router.replace('/home');
        break;
      default:
        router.replace('/home');
    }
  };

  const navigateToWindowDetail = (windowNumber) => {
    router.replace(`window${windowNumber}`);
  };

  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_IP);

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.current.onmessage = (e) => {
    //  console.log('WebSocket message received:', e.data);
      try {
        const receivedData = JSON.parse(e.data);
    
        // Check if receivedData has all expected properties
        if (receivedData && receivedData.Wind !== undefined && receivedData.Temp !== undefined && receivedData.Lux !== undefined && receivedData.Tint !== undefined) {
          setData(prevData => {
            const existingWindowIndex = prevData.findIndex(item => item.windowNumber === receivedData.Wind);
            let updatedData;
            if (existingWindowIndex !== -1) {
              updatedData = [...prevData];
              updatedData[existingWindowIndex] = {
                windowNumber: receivedData.Wind,
                Temp: receivedData.Temp,
                Lux: receivedData.Lux,
                Tint: receivedData.Tint
              };
            } else {
              updatedData = [
                ...prevData,
                {
                  windowNumber: receivedData.Wind,
                  Temp: receivedData.Temp,
                  Lux: receivedData.Lux,
                  Tint: receivedData.Tint
                }
              ];
            }
            // Sort the data by window number in ascending order
            return updatedData.sort((a, b) => a.windowNumber - b.windowNumber);
          });
        } else {
          console.log('Received data is missing required properties:', receivedData);
        }
      } catch (error) {
        console.log('Error parsing WebSocket message:', error);
      }
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.windowButton}
      onPress={() => navigateToWindowDetail(item.windowNumber)}
    >
      <Text style={styles.buttonText}>Window {item.windowNumber}</Text>
      <Text style={styles.buttonTextData}>Temperature: {item.Temp}°F  Lux: {item.Lux} lx  Tint Level: {item.Tint}% </Text>
    </TouchableOpacity>
  );

  

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#161622" style="dark" />
      <View style={styles.navBar}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <TouchableOpacity style={styles.button} onPress={signOut}>
          <Icon name="log-out" size={30} color="#000"/>
        </TouchableOpacity>
      </View>

      <View style={styles.navBarDevices}>
        <Text style={styles.greetingDevices}>Devices </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.windowNumber.toString()}
        renderItem={renderItem}
      />
      
      <View style={styles.taskbar}>
        <TaskBarItem
          icon="home"
          label="Home"
          isFocused={focusedItem === 'Home'}
          onPress={handleNavigation}
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
    paddingVertical: 28,
    backgroundColor: 'gold',
  },
  navBarDevices: {
    paddingVertical: 10,
    backgroundColor: 'black',
    margin: 10,
    paddingHorizontal: 5,
  },
  greetingDevices: {
    fontSize: 18,
    color: 'gold',
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  greeting: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    paddingHorizontal: 30,
  },
  navBarButton: {
    padding: 10,
    color: 'black',
    paddingHorizontal: 150,
  },
  windowButton: {
    padding: 10,
    margin: 20,
    marginVertical: 5,
    backgroundColor: 'gold',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  buttonTextData: {
    fontSize: 15,
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
  button: {
    backgroundColor: 'gold',
    borderRadius: 10,
    paddingHorizontal: 150,
  },
});

export default Home;*/

/*
// Good
import { useRoute } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { WEBSOCKET_IP } from '../config';

const Home = () => {
  const [focusedItem, setFocusedItem] = useState('Home');
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const ws = useRef(null);
  const route = useRoute(); 
 

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    return currentHour < 12 ? 'Good Morning' : 'Good Afternoon';
  };

  const signOut = () => {
    router.replace('/signIn');
  };

  const handleNavigation = (label) => {
    setFocusedItem(label);
    switch (label) {
      case 'Home':
        router.replace('/home');
        break;
      case 'Sync':
        router.replace('/sync');
        break;
      default:
        router.replace('/home');
    }
  };

  const navigateToWindowDetail = (windowNumber) => {
    router.replace(`window${windowNumber}`);
  };

 
  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_IP);

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.current.onmessage = (e) => {
    //  console.log('WebSocket message received:', e.data);
      try {
        const receivedData = JSON.parse(e.data);
    
        // Check if receivedData has all expected properties
        if (receivedData && receivedData.Wind !== undefined && receivedData.Temp !== undefined && receivedData.Lux !== undefined && receivedData.Tint !== undefined) {
          setData(prevData => {
            const existingWindowIndex = prevData.findIndex(item => item.windowNumber === receivedData.Wind);
            let updatedData;
            if (existingWindowIndex !== -1) {
              updatedData = [...prevData];
              updatedData[existingWindowIndex] = {
                windowNumber: receivedData.Wind,
                Temp: receivedData.Temp,
                Lux: receivedData.Lux,
                Tint: receivedData.Tint
              };
            } else {
              updatedData = [
                ...prevData,
                {
                  windowNumber: receivedData.Wind,
                  Temp: receivedData.Temp,
                  Lux: receivedData.Lux,
                  Tint: receivedData.Tint
                }
              ];
            }
            // Sort the data by window number in ascending order
            return updatedData.sort((a, b) => a.windowNumber - b.windowNumber);
          });
        } else {
          console.log('Received data is missing required properties:', receivedData);
        }
      } catch (error) {
        console.log('Error parsing WebSocket message:', error);
      }
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.windowButton}
      onPress={() => navigateToWindowDetail(item.windowNumber)}
    >
      <Text style={styles.buttonText}>Window {item.windowNumber}</Text>
      <Text style={styles.buttonTextData}>Temperature: {Math.round(item.Temp)}°F  Lux: {Math.round(item.Lux)} lx  Tint Level: {Math.round(item.Tint)}%</Text>
    </TouchableOpacity>
  );


 
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#161622" style="dark" />
      <View style={styles.navBar}>
        <Text style={styles.greeting}>{getGreeting()}!</Text>
        <TouchableOpacity style={styles.button} onPress={signOut}>
          <Icon name="log-out" size={30} color="#000"/>
        </TouchableOpacity>
      </View>

      <View style={styles.navBarDevices}>
        <Text style={styles.greetingDevices}>Devices </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.windowNumber.toString()}
        renderItem={renderItem}
      />


      <View style={styles.taskbar}>
        <TaskBarItem
          icon="home"
          label="Home"
          isFocused={focusedItem === 'Home'}
          onPress={handleNavigation}
        />

        <TaskBarItem
          icon="sync"
          label="Sync"
          isFocused={focusedItem === 'Sync'}
          onPress={handleNavigation}
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
    paddingVertical: 28,
    backgroundColor: 'gold',
  },
  navBarDevices: {
    paddingVertical: 10,
    backgroundColor: 'black',
    margin: 10,
    paddingHorizontal: 5,
  },
  greetingDevices: {
    fontSize: 18,
    color: 'gold',
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  greeting: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    paddingHorizontal: 30,
  },
  navBarButton: {
    padding: 10,
    color: 'black',
    paddingHorizontal: 150,
  },
  windowButton: {
    padding: 10,
    margin: 20,
    marginVertical: 5,
    backgroundColor: 'gold',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  buttonTextData: {
    fontSize: 15,
    color: '#000',
  },
  showAllButton: {
    padding: 5,
    margin: 20,
    marginVertical: 150,
    backgroundColor: 'gold',
    borderRadius: 10,
    alignItems: 'center',
  
   
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
  button: {
    backgroundColor: 'gold',
    borderRadius: 10,
    paddingHorizontal: 150,
  },
});

export default Home;*/


// home.jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { WEBSOCKET_IP } from '../config';

const Home = () => {
  const [focusedItem, setFocusedItem] = useState('Home');
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const navigation = useNavigation();
  const ws = useRef(null);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    return currentHour < 12 ? 'Good Morning' : 'Good Afternoon';
  };

  const addPrefix = (name) => {
    const specialNames = ['Chan', 'Mike', 'Justin'];
    return specialNames.includes(name) ? `Dr. ${name}` : name;
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('userName');
    router.replace('/signIn');
  };

  const handleNavigation = (label) => {
    setFocusedItem(label);
    switch (label) {
      case 'Home':
        router.replace('/home');
        break;
      case 'Sync':
        router.replace('/sync');
        break;
      default:
        router.replace('/home');
    }
  };

  const navigateToWindowDetail = (windowNumber) => {
    router.replace(`window${windowNumber}`);
  };

  useEffect(() => {
    const fetchUserName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setName(storedName);
      }
    };

    fetchUserName();

    ws.current = new WebSocket(WEBSOCKET_IP);

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.current.onmessage = (e) => {
      // console.log('WebSocket message received:', e.data);
      try {
        const receivedData = JSON.parse(e.data);

        // Check if receivedData has all expected properties
        if (receivedData && receivedData.Wind !== undefined && receivedData.Temp !== undefined && receivedData.Lux !== undefined && receivedData.Tint !== undefined) {
          setData(prevData => {
            const existingWindowIndex = prevData.findIndex(item => item.windowNumber === receivedData.Wind);
            let updatedData;
            if (existingWindowIndex !== -1) {
              updatedData = [...prevData];
              updatedData[existingWindowIndex] = {
                windowNumber: receivedData.Wind,
                Temp: receivedData.Temp,
                Lux: receivedData.Lux,
                Tint: receivedData.Tint
              };
            } else {
              updatedData = [
                ...prevData,
                {
                  windowNumber: receivedData.Wind,
                  Temp: receivedData.Temp,
                  Lux: receivedData.Lux,
                  Tint: receivedData.Tint
                }
              ];
            }
            // Sort the data by window number in ascending order
            return updatedData.sort((a, b) => a.windowNumber - b.windowNumber);
          });
        } else {
          console.log('Received data is missing required properties:', receivedData);
        }
      } catch (error) {
        console.log('Error parsing WebSocket message:', error);
      }
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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.windowButton} onPress={() => navigateToWindowDetail(item.windowNumber)}>
      <Text style={styles.buttonText}>Window {item.windowNumber}</Text>
      <Text style={styles.buttonTextData}>Temperature: {Math.round(item.Temp)}°F  Lux: {Math.round(item.Lux)} lx  Tint Level: {Math.round(item.Tint)}%</Text>
    </TouchableOpacity>
  );

  const firstName = name.split(' ')[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#161622" style="dark" />
      <View style={styles.navBar}>
        <Text style={styles.greeting}>{getGreeting()} {addPrefix(firstName)}!</Text>
        <TouchableOpacity style={styles.button} onPress={signOut}>
          <Icon name="log-out" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.navBarDevices}>
        <Text style={styles.greetingDevices}>Devices </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.windowNumber.toString()}
        renderItem={renderItem}
      />

      <View style={styles.taskbar}>
        <TaskBarItem
          icon="home"
          label="Home"
          isFocused={focusedItem === 'Home'}
          onPress={handleNavigation}
        />

        <TaskBarItem
          icon="sync"
          label="Sync"
          isFocused={focusedItem === 'Sync'}
          onPress={handleNavigation}
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
    paddingVertical: 28,
    backgroundColor: 'gold',
  },
  navBarDevices: {
    paddingVertical: 10,
    backgroundColor: 'black',
    margin: 10,
    paddingHorizontal: 5,
  },
  greetingDevices: {
    fontSize: 18,
    color: 'gold',
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  greeting: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    paddingHorizontal: 30,
  },
  navBarButton: {
    padding: 10,
    color: 'black',
    paddingHorizontal: 150,
  },
  windowButton: {
    padding: 10,
    margin: 20,
    marginVertical: 5,
    backgroundColor: 'gold',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  buttonTextData: {
    fontSize: 15,
    color: '#000',
  },
  showAllButton: {
    padding: 5,
    margin: 20,
    marginVertical: 150,
    backgroundColor: 'gold',
    borderRadius: 10,
    alignItems: 'center',
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
  button: {
    backgroundColor: 'gold',
    borderRadius: 10,
    paddingHorizontal: 80,
  },
});

export default Home;
