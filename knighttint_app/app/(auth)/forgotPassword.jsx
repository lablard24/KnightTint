import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import FormField from '../components/FormField';

const ForgotPassword = () => {
  const [form, setForm] = useState({
    username: '',
    password:''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
 
  const submit = async () => {
   
    if (form.email === '' ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch('http://192.168.56.1:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      const data = await response.json();
     
      console.log(data);
      router.replace('/sign-in');
      
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Image
            source={require('../assets/images/logo.png')}
            resizeMode='contain'
            style={styles.logo}
          />

          <View style={styles.container}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.listItem} numberOfLines={2}>If you have an account with us, you will receive {"\n    "}an email to change your password.</Text>
          </View>

          <FormField
            title="Email"
            placeholder="Enter your email address"
            iconName="mail-outline"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={styles.field}
            keyboardType="email-address"
          />

          <CustomButton
            title="Submit"
            handlePress={submit}
            containerStyles={styles.button}
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="dark"/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  logo: {
    width: 115,
    height: 35,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  field: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
    
  listItem: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
    paddingHorizontal: 10,
    
  },
});

export default ForgotPassword;
