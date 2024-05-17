import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../components/CustomButton';

const Window = () => {

  const backHome = () => {
    router.replace('/home')
  }

  const setWifi = () => {
    router.replace('/setupWifi')
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#161622" style="dark" />
      <View style={styles.navBar}>
      <TouchableOpacity style={styles.navBarButton} onPress={backHome}>
          <Icon name="chevron-back-sharp" size={30} color="#000"/>
        </TouchableOpacity>
        <Text style={styles.navBarText}>Power Up Your Smart Window</Text>
        
      </View>

      <View style={styles.container}>
        <Text style={styles.listItem} numberOfLines={4}>Plug in your smart window.</Text>
        <Text style={styles.listItem} numberOfLines={4}>Make sure the area has a strong Wi-Fi signal.</Text>
    </View>

    <View style={styles.container}>
    <CustomButton
        title="Next"
        handlePress={setWifi}
        containerStyles={styles.button}
        isLoading={isSubmitting}
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
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'gold',
  },

  navBarText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
   paddingHorizontal: 40,
  },

  button: {
    marginTop: 200,
    paddingHorizontal:60,
    paddingTop: 5,
  },

  navBarButton: {
    padding: 10,
    color: 'black',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },

 
  
  listItem: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
    color: 'black',
    paddingHorizontal: 10,
    
    
  },
});

export default Window;
