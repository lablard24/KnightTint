import { Tabs } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View style={styles.tabContainer}>
      <Image
        source={icon}
        resizeMode="contain"
        style={[styles.icon, { tintColor: color }]}
      />
      <Text style={[styles.label, { color: color, fontWeight: focused ? 'bold' : 'normal' }]}>
        {name}
      </Text>
    </View>
  );
}

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{
      tabBarShowLabel: false,
      tabBarActiveTintColor: "#FFA001",
      tabBarInactiveTintColor: "#CDCDE0",
      tabBarStyle: styles.tabBar,
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon 
              icon={require('../assets/icons/home.png')}
              color={color}
              name="Home"
              focused={focused}
            />
          )
        }}
      />
     
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon 
              icon={require('../assets/icons/profile.png')}
              color={color}
              name="Profile"
              focused={focused}
            />
          )
        }}
      />
      
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    fontSize: 10,
  },
  tabBar: {
    backgroundColor: "#161622",
    borderTopWidth: 1,
    borderTopColor: "#232533",
    height: 84,
  },
});

export default TabsLayout;
