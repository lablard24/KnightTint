import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  iconName,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, otherStyles]}>
      <Text style={styles.title}>{title}</Text>

      <View style={[styles.inputContainer, isFocused && styles.focusedInputContainer]}>
        {iconName && (
          <Ionicons name={iconName} size={24} color="white" style={styles.icon} />
        )}
        <TextInput
          style={[styles.input, isFocused && styles.focusedInput]}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="white"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <Ionicons name="eye-off-sharp" size={24} color="white" style={styles.eyeIcon} />
            ) : (
              <Ionicons name="eye-sharp" size={24} color="white" style={styles.eyeIcon} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 56,
  },
  focusedInputContainer: {
    borderColor: 'gold', 
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    fontStyle: 'italic', 
  },
  focusedInput: {
    color: 'gold', 
  },
  icon: {
    marginRight: 12,
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
});

export default FormField;
