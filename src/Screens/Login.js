import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";

export default function Inicio() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.ContainerLogo}>
                <Animatable.Image
                    animation="flipInY"
                    delay={600}
                    source={require('../../src/assets/img/Worldly__1_-removebg-preview.png')}
                    style={{ width: '100%' }}
                    resizeMode="contain"
                />
            </View>

            <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>Bem-vindo!</Text>
                <Text style={styles.subText}>
                    "Rastreamos o 𝗜𝗻𝘃𝗶𝘀𝗶́𝘃𝗲𝗹, Você conquista o 𝗜𝗺𝗽𝗼𝘀𝘀𝗶́𝘃𝗲𝗹"
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('LoginScreen')}
                >
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242424',
    },
    ContainerLogo: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerForm: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 28,
        marginBottom: 12,
        textAlign: 'center',
    },
    subText: {
        color: '#000',
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        width: '90%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#F0F0F0',
    },
    button: {
        position: 'absolute',
        backgroundColor: '#FF6B00',
        borderRadius: 50,
        paddingVertical: 10,
        width: '60%',
        alignSelf: 'center',
        bottom: '10%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
