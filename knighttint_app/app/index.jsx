import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from './components/CustomButton';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>

        <View style={styles.image}>
          <Image 
            source={require('./assets/images/logo.png')}
            style={styles.logo}
            resizeMode='contain'
          />
          </View>
        
          <Text style={styles.description}> Shade, Safety, Style Combined</Text>

          <CustomButton
            title="Get Started"
          // handlePress={() => router.push('/signIn')}
           handlePress={() => router.push('/window1')}
            containerStyles={styles.button}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="dark"/>
    </SafeAreaView> 
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '84vh',
    paddingHorizontal: 20,
  },
  logo: {
    width: 300,
    height: 300,
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
   paddingTop:100,
  },
  description: {
    fontSize: 20,
    color: 'white',
    marginTop: 7,
    textAlign: 'center',
  },
  button: {
    width: '50%',
    marginTop: 100,
  },
});
