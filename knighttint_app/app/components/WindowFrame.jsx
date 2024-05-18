import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Switch, TextInput, TouchableOpacity, View } from 'react-native';

const CustomButton = ({
  imageSource,
  initialTitle,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const toggleSwitch = () => setIsSwitchOn(previousState => !previousState);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.button, containerStyles, isLoading && styles.disabled]}
      disabled={isLoading}
    >
      <View style={styles.content}>
        <Image source={imageSource} style={styles.image} />
        <TextInput
          style={[styles.textInput, textStyles]}
          value={title}
          onChangeText={setTitle}
          editable={!isLoading}
        />
        <Switch
          onValueChange={toggleSwitch}
          value={isSwitchOn}
          disabled={isLoading}
          style={styles.switch}
        />
      </View>
      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          style={styles.activityIndicator}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'gold',
    borderRadius: 10,
    minHeight: 62,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  image: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  switch: {
    marginLeft: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  activityIndicator: {
    position: 'absolute',
    right: 10,
  },
});

export default CustomButton;
