import { router } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import WindowFrame from '../components/WindowFrame';

const Home = () => {
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good Morning';
    } else {
      return 'Good Afternoon';
    }
  };

  const addWindow = () => {
    router.replace('/addWindow'); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#161622" style="dark" />
      
      <View style={styles.navBar}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <TouchableOpacity style={styles.button} onPress={addWindow}>
          <Icon name="add-circle-sharp" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <WindowFrame
          imageSource={require('../assets/images/logo.png')} 
          initialTitle="Edit Me"
          handlePress={() => console.log('Button Pressed')}
          containerStyles={styles.customButtonContainer}
          textStyles={styles.customButtonText}
          isLoading={false}
        />
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'gold',
  },
  greeting: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'gold',
    borderRadius: 10,
    minHeight: 62,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButtonContainer: {
    marginTop: 20,
    backgroundColor: 'gold',
    borderRadius: 10,
    minHeight: 62,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  customButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Home;