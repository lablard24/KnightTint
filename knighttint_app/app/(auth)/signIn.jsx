import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import FormField from '../components/FormField';

const SignIn = () => {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {
      username: '',
      password: '',
      general: ''
    };

    if (form.username === '') {
      newErrors.username = 'Username is required';
    }

    if (form.password === '') {
      newErrors.password = 'Password is required';
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
      const response = await fetch('http://192.168.0.194:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          ...errors,
          general: data.message || 'Login failed'
        });
        return;
      }

      console.log(data);
      router.replace('/home');
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
          <Text style={styles.title}>Log In</Text>

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
            title="Password"
            placeholder="Enter your password"
            iconName="lock-closed-outline"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={styles.field}
            error={errors.password}
          />

          {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

          <Link href="/forgotPassword" style={styles.forgotPassword}>
            Forgot Password?
          </Link>

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles={styles.button}
            isLoading={isSubmitting}
          />

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account?</Text>
            <Link href="/signUp" style={styles.signUpLink}>
              Sign Up
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
    paddingTop: 60,
  },
  logo: {
    width: 115,
    height: 100,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingTop: 80,
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
    marginLeft: 200,
    fontStyle: 'italic',
    paddingBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default SignIn;
