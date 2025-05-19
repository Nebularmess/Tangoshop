import { Stack } from "expo-router";

const RootNavigation = () => {
    return(
        <Stack>
            <Stack.Screen name="(home)"/>
            <Stack.Screen name="(Products)" options={{headerShown: false}}/>
        </Stack>
    )
}

export default RootNavigation;