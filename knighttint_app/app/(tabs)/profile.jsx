import { router } from 'expo-router';
import React from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const handleSignout = () => {
    console.log("User signed out");
    router.replace('/sign-in')
  }

  return (
    <SafeAreaView>
    <View style={styles.container}>
      <TouchableOpacity style={styles.topLeft} onPress={handleSignout}>
        <Image
          source={require('../assets/icons/logout.png')} 
          style={styles.signoutImage}
        />
      </TouchableOpacity>
      <Text>Profile no way</Text>
    </View>
    <StatusBar backgroundColor="#161622" style="black"/>
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 20,
  },
  signoutImage: {
    width: 200, 
    height: 200, 
    
  },
  
})
