import { StyleSheet, Text, View } from "react-native";
export default function Login() {
    console.log('Estoy en el Login');
    const styles = StyleSheet.create({
        h1: {
            color: 'red',
            fontSize: 24,
            fontWeight: 'bold'
        }
    });
    return (
        <View>
            <Text style={styles.h1}>Login</Text>
            <Text>Please enter your credentials to access the application.</Text>
        </View>
    );
}