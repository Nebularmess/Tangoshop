import { Stack } from "expo-router"; //importa el componente Stack
//componente layout raiz
const RootNavigation = () => {
    return(
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}}/>
            <Stack.Screen name="[id]" options={{headerShown: false}}/>
        </Stack>
    )
}

export default RootNavigation;