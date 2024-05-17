import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const Help = () => {

  const backToDevice = () => {
    router.replace('/addWindow')
  }

  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#161622" style="dark" />
      <View style={styles.navBar}>
      <TouchableOpacity style={styles.navBarButton} onPress={backToDevice}>
          <Icon name="chevron-back-sharp" size={30} color="#000"/>
        </TouchableOpacity>
        <Text style={styles.navBarText}>Help</Text>
      </View>
      
      <View>
        <Text style={styles.title}>Possible reasons</Text>
        <Text style={styles.listItem} numberOfLines={4}>1. Ensure that the router is powered on.</Text>
        <Text style={styles.listItem} numberOfLines={4}>2. Ensure that your smartphone is connected to the {"\n    "} router's Wi-Fi network.</Text>
        <Text style={styles.listItem} numberOfLines={4}>3. Ensure that the router's network is stable.</Text>
        <Text style={styles.listItem} numberOfLines={4}>4. Ensure that the device can be managed by the App.</Text>
    </View>

    <StatusBar backgroundColor="#161622" style="dark"/>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'gold',
  },

  navBarText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 120,
  },

  listItem: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
    color: 'black',
    paddingHorizontal: 10,
    
  },

  navBarButton: {
    padding: 10,
    color: 'black',
  },

  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#eaeaea',
  },

  title: {
    marginTop: 16,
    paddingVertical: 8,
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default Help;
