import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import FormField from '../components/FormField';
import { REGISTER_ENDPOINT, SERVER_DOMAIN, SERVER_PROTOCOL } from '../config';

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    general: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      username: '',
      password: '',
      general: ''
    };

    if (form.name.length < 2) {
      newErrors.name = 'Full Name must be at least 2 characters long';
    }

    if (form.username.length < 2) {
      newErrors.username = 'Username must be at least 2 characters long';
    }

    if (!form.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error);
  };

  const submit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const url = `${SERVER_PROTOCOL}://${SERVER_DOMAIN}${REGISTER_ENDPOINT}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.message && data.message.includes('username')) {
          setErrors({
            ...errors,
            username: 'Username already exists'
          });
        } else {
          setErrors({
            ...errors,
            general: data.message || 'Registration failed'
          });
        }
        return;
      }

      console.log(data);
      console.log('User created successfully!');

      router.replace('/signIn');
    } catch (error) {
      console.error('Error:', error);
      setErrors({ ...errors, general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>Register</Text>

          <FormField
            title="Full Name"
            placeholder="Enter your full name"
            iconName="person-circle-outline"
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyles={styles.field}
            error={errors.name}
          />

          <FormField
            title="Username"
            placeholder="Enter your username"
            iconName="person-outline"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles={styles.field}
            error={errors.username}
          />

          <FormField
            title="Email"
            placeholder="Enter your email address"
            iconName="mail-outline"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={styles.field}
            keyboardType="email-address"
            error={errors.email}
          />

          <FormField
            title="Password"
            placeholder="Enter your password"
            iconName="lock-closed-outline"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={styles.field}
            error={errors.password}
          />

          {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles={styles.button}
            isLoading={isSubmitting}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Have an account already?</Text>
            <Link href="/signIn" style={styles.loginLink}>
              Log In
            </Link>
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="dark" />
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
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingTop: 30,
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
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
});

export default SignUp;
