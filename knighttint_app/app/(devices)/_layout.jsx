import { Stack } from 'expo-router';
import React from 'react';

const DeviceLayout = () => {

  return (
   <>
    <Stack>
      <Stack.Screen 
        name="window"
        options={{
        headerShown: false
        }}/>

<Stack.Screen 
        name="help"
        options={{
        headerShown: false
        }}/>
    </Stack>
   </>
  )
}

export default DeviceLayout

