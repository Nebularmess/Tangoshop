import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";


const borrarStorage = async () => {
    try {
        await AsyncStorage.removeItem("currentUser");
        const currentUser = await AsyncStorage.getItem("currentUser");
        console.log("Borrado", currentUser)
    } catch (error) {
        console.log(error);
    }
}

const RootNavigation = () => {
    borrarStorage()
    return(
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}}/>
        </Stack>
    )
}

export default RootNavigation;