import { Stack } from "expo-router";

const RootNavigation = () => {
    return(
        <Stack>
            <Stack.Screen name="(index)"/>
            <Stack.Screen name="(auth)" options={{headerShown: false}}/>
        </Stack>
    )
}

export default RootNavigation;