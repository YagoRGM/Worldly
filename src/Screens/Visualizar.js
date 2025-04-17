import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';

export default function Visualizar({ navigation }) {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title_mapa}>Visualizar os lugares do mapa</Text>
            <View style={styles.card}>
                <Text style={styles.title}>Camp Nou</Text>
                <View style={styles.content}>
                    <View style={styles.row}>
                        <Image style={styles.lugar_image} source={require('../img/camp_nou.png')} />
                        <View style={styles.buttons}>
                            <TouchableOpacity style={styles.button_mapa}>
                                <Text style={styles.buttonText}>Ver no Mapa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button_editar}>
                                <Text style={styles.buttonText}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button_excluir}>
                                <Text style={styles.buttonText}>Excluir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button_detalhes} onPress={() => navigation.navigate('Detalhes')}>
                                <Text style={styles.buttonText}>Detalhes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    title_mapa: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    content: {
        flexDirection: 'column',
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lugar_image: {
        width: 150,
        height: 100,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    buttons: {
        flex: 1,
        marginLeft: 20,
        justifyContent: 'space-between',
    },
    button_mapa: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#007BFF',
        marginBottom: 10,
    },
    button_editar: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#28A745',
        marginBottom: 10,
    },
    button_excluir: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#DC3545',
        marginBottom: 10,
    },
    button_detalhes: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#FF6B00',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#FF6B00',
        padding: 10,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
    },
});
