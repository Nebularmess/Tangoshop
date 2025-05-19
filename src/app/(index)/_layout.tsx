import { Stack, Tabs } from "expo-router";

const RootNavigation = () => {
    return(
        <Stack>
            <Stack.Screen name="(home)" options={{headerShown: false}}/>
            <Stack.Screen name="(Products)" options={{headerShown: false}}/>
            <Stack.Screen name="(MyProducts)" options={{headerShown: false}}/>
            <Stack.Screen name="(Providers)" options={{headerShown: false}}/>
            <Stack.Screen name="(Setings)" options={{headerShown: false}}/>
        </Stack>
    )
}

const TabNavigation = () => {
    return(
        <Tabs>
            <Tabs.Screen 
                name="(home)" 
                options={{title: "Inicio", headerShown: false}}
            />
            <Tabs.Screen 
                name="(Products)"
                options={{title: "Productos",headerShown: false}}
            />
            <Tabs.Screen 
                name="(Providers)"
                options={{title: "Proveedores", headerShown: false}} 
            />
            <Tabs.Screen 
                name="(MyProducts)" 
                options={{title: "Mis Productos", headerShown: false}} 
            />
            <Tabs.Screen 
                name="(Setings)" 
                options={{title: "Configuración", headerShown: false}} 
            />
        </Tabs>
    )
}

export default TabNavigation;