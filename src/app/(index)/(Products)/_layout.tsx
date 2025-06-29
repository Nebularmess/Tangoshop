import { Stack } from "expo-router"; //importa el componente Stack
//componente layout raiz
const RootNavigation = () => {
    //devuelve el componente stack como contenedor de todas las pantallas
    //define la pantalla con laruta index.tsx y el headerShown false es para ocultar la barrra de nav sup
    return(
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}}/>
        </Stack>
    )
}

export default RootNavigation;