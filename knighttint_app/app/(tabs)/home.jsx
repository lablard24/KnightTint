import { router } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

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
        <TouchableOpacity style={styles.plusButton} onPress={addWindow}>
          <Icon name="add-circle-sharp" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text>Home</Text>
      </View>
      <StatusBar backgroundColor="#161622" style="dark"/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'blue',
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
  plusButton: {
    padding: 10,
    color: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
