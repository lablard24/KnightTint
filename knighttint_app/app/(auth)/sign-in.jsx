import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import FormField from '../components/FormField';

const SignIn = () => {
  const [form, setForm] = useState({
    username: '',
    password:''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
 
  const submit = async () => {
   
    if (form.username === '' || form.password === '') {
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
      Alert.alert('Success', "User signed in successfully");

      router.replace('/home');
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

          <Text style={styles.title}>Log In</Text>

          <FormField
            title="Username"
            placeholder="Enter your username"
            iconName="person-outline"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles={styles.field}
          />

          <FormField
            title="Password"
            placeholder="Enter your password"
            iconName="lock-closed-outline"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={styles.field}
          />

          {/* <View style={styles.signUpContainer}>
            <Link
              href="/forgotPassword"
              style={styles.forgotPassword}>
              Forgot Password?
            </Link>
          </View> */}

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles={styles.button}
            isLoading={isSubmitting}
          />

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              style={styles.signUpLink}>
              Sign Up
            </Link>
          </View>
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'normal',
  },
  signUpLink: {
    fontSize: 16,
    color: 'gold',
    fontWeight: 'bold',
    marginLeft: 5,
  },

  forgotPassword: {
    fontSize: 16,
    color: 'white',
    marginLeft: 230,
    fontStyle: 'italic', 
    
  },
});

export default SignIn;
