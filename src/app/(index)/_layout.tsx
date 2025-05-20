import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from "expo-router";

const TabNavigation = () => {
    return(
        <Tabs>
            <Tabs.Screen 
                name="(home)" 
                options={{
                    title: "Inicio", 
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Icon size={28} name="home" color={color} />
                }}
            />
            <Tabs.Screen 
                name="(Products)"
                options={{
                    title: "Productos",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Icon size={28} name="shopping" color={color} />
                }}
                

            />
            <Tabs.Screen 
                name="(Providers)"
                options={{
                    title: "Proveedores", 
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Icon size={28} name="store" color={color} />
                }} 
            />
            <Tabs.Screen 
                name="(MyProducts)" 
                options={{
                    title: "Mis Productos", 
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Icon size={28} name="heart" color={color} />
                }} 
            />
            <Tabs.Screen 
                name="(Setings)" 
                options={{
                    title: "Configuración", 
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Icon size={28} name="tools" color={color} />
                }} 
            />
        </Tabs>
    )
}

export default TabNavigation;