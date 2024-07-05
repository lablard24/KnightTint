import { Stack } from 'expo-router';
import React from 'react';

const TabLayout = () => {

  return (
   <>
    <Stack>
     <Stack.Screen 
        name="home"
        options={{
        headerShown: false
        }}/>

    <Stack.Screen 
        name="window1"
        options={{
        headerShown: false
        }}/>


     <Stack.Screen 
        name="window2"
        options={{
        headerShown: false
        }}/>

     <Stack.Screen 
        name="schedule1"
        options={{
        headerShown: false
        }}/>

     <Stack.Screen 
        name="schedule2"
        options={{
        headerShown: false
        }}/>

     <Stack.Screen 
        name="privacy1"
        options={{
        headerShown: false
        }}/>

     <Stack.Screen 
        name="privacy2"
        options={{
        headerShown: false
        }}/>

     <Stack.Screen 
        name="automatic"
        options={{
        headerShown: false
        }}/>

    </Stack>
   </>
  )
}

export default TabLayout