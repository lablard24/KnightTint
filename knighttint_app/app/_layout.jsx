import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    useEffect(() => {
    SplashScreen.hideAsync();
    }, []);

    return (
        <Stack>
            <Stack.Screen name="(devices)" options={{ headerShown: false }}/>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
            <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
            <Stack.Screen name="index" options={{ headerShown: false }}/>
        </Stack>
    );
};

export default RootLayout;
