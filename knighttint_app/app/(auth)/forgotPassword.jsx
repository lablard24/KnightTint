import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import FormField from '../components/FormField';
import { CHECKEMAIL_ENDPOINT, RESET_PASSWORD_ENDPOINT, SERVER_DOMAIN, SERVER_PROTOCOL } from '../config';

const ForgotPassword = () => {
  const [form, setForm] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
    general: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const validateEmail = () => {
    const newErrors = { email: '', general: '' };

    if (!form.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const validatePasswords = () => {
    const newErrors = { newPassword: '', confirmPassword: '', general: '' };

    if (form.newPassword === '') {
      newErrors.newPassword = 'New password is required';
    } else if (form.newPassword.length < 8 || !/[A-Z]/.test(form.newPassword) || !/[a-z]/.test(form.newPassword)) {
      newErrors.newPassword = '* Password must be at least 8 characters';
    }

    if (form.confirmPassword === '') {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const checkEmail = async () => {
    if (!validateEmail()) return;

    try {
      setIsSubmitting(true);
      const url = `${SERVER_PROTOCOL}://${SERVER_DOMAIN}${CHECKEMAIL_ENDPOINT}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email })
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      if (data.emailExists) {
        setEmailExists(true);
      } else {
        setErrors({ ...errors, email: 'Email does not exist' });
      }
    } catch (error) {
      setErrors({ ...errors, general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async () => {
    if (!validatePasswords()) return;

    try {
      setIsSubmitting(true);
      const url = `${SERVER_PROTOCOL}://${SERVER_DOMAIN}${RESET_PASSWORD_ENDPOINT}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error(await response.text());

      router.replace('/signIn');
    } catch (error) {
      setErrors({ ...errors, general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
          </View>

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

          {emailExists && (
            <>
              <FormField
                title="New Password"
                placeholder="Enter your new password"
                iconName="lock-closed-outline"
                value={form.newPassword}
                handleChangeText={(e) => setForm({ ...form, newPassword: e })}
                otherStyles={styles.field}
                error={errors.newPassword}
              />

              <FormField
                title="Confirm Password"
                placeholder="Enter your new password"
                iconName="lock-closed-outline"
                value={form.confirmPassword}
                handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
                otherStyles={styles.field}
                error={errors.confirmPassword}
              />
            </>
          )}

          {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

          <CustomButton
            title={emailExists ? "Reset Password" : "Submit"}
            handlePress={emailExists ? resetPassword : checkEmail}
            containerStyles={styles.button}
            isLoading={isSubmitting}
          />
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
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingTop: 60,
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

export default ForgotPassword;
