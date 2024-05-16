import { router } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const Window = () => {

  const backHome = () => {
    router.replace('/home')
  }

  const help = () => {
    router.replace('/help')
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#161622" style="dark" />
      <View style={styles.navBar}>
      <TouchableOpacity style={styles.navBarButton} onPress={backHome}>
          <Icon name="chevron-back-sharp" size={30} color="#000"/>
        </TouchableOpacity>
        <Text style={styles.navBarText}>Add Device</Text>
        <TouchableOpacity style={styles.navBarButton} onPress={help}>
          <Icon name="help-circle-outline" size={30} color="#000"/>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text>Home</Text>
      </View>
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

  navBarText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },

  navBarButton: {
    padding: 10,
    color: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Window;
