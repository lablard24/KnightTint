import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../components/CustomButton';

const SetWiFi = () => {

  const backToAddDevice = () => {
    router.replace('/addWindow');
  }

  const openWifi = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:root=WIFI');
    } else if (Platform.OS === 'android') {
      Linking.sendIntent('android.settings.WIFI_SETTINGS');
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#161622" style="dark" />
      <View style={styles.navBar}>
      <TouchableOpacity style={styles.navBarButton} onPress={backToAddDevice}>
          <Icon name="chevron-back-sharp" size={30} color="#000"/>
        </TouchableOpacity>
        <Text style={styles.navBarText}>Connect To Wi-Fi</Text>
        
      </View>

      <View style={styles.container}>
        <Text style={styles.listItem} numberOfLines={4}>Go to your mobile device's setting and {'\n'}  join your Smart Tint's Wi-Fi network.</Text>
        <Text style={styles.listItem} numberOfLines={4}>Return to Knignt Tint to continue setup.</Text>
    </View>

    <View style={styles.container}>
    <CustomButton
        title="Open Settings"
        handlePress={openWifi}
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
      paddingHorizontal: 70,
    },
    button: {
      marginTop: 200,
      paddingHorizontal: 60,
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
  
  export default SetWiFi;
  