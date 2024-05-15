import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import FormField from '../components/FormField';

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if(form.name === '' || form.email === ''|| form.username === '' || form.password === ''){
      Alert.alert("Error", "Please fill in all fields");
    }
    try {
      setIsSubmitting(true);
      const response = await fetch('http://192.168.56.1:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      const data = await response.json();
     
      console.log(data);
      Alert.alert('User created successfully!')

      router.replace('/sign-in')

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
            resizeMode="contain" 
            style={styles.logo} 
          />

          <Text style={styles.title}>Register</Text>

          <FormField
            title="Full Name"
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyles={styles.field}
          />

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles={styles.field}
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={styles.field}
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={styles.field}
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles={styles.button}
            isLoading={isSubmitting}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Have an account already?</Text>
            <Link href="/sign-in" style={styles.loginLink}>
              Log In
            </Link>
          </View>
        </View>
      </ScrollView>
     
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
    paddingVertical: 40,
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
  },
  field: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'normal',
  },
  loginLink: {
    fontSize: 16,
    color: 'gold',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default SignUp;


