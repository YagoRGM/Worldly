import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    Dimensions,
    ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Home({ navigation }) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>🌍 Bem-vindo ao Worldly</Text>
            <Text style={styles.subtitle}>Descubra lugares incríveis perto de você!</Text>

            {/* Imagem impactante no lugar do mapa */}
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' }}
                style={styles.heroImage}
                imageStyle={{ borderRadius: 16 }}
            >
                <View style={styles.overlay}>
                    <Text style={styles.heroText}>Explore o mundo com apenas um toque!</Text>
                </View>
            </ImageBackground>

            <View style={styles.buttonGroup}>
                <Pressable style={styles.button} onPress={() => navigation.navigate('Mapa')}>
                    <Ionicons name="location-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Locais Próximos</Text>
                </Pressable>

                <Pressable
                    style={[styles.button, { backgroundColor: '#009688' }]}
                    onPress={() => navigation.navigate('CadastrarLugares')}
                >
                    <Ionicons name="add-circle-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Adicionar Local</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    heroImage: {
        width: width - 48,
        height: 220,
        marginBottom: 30,
        justifyContent: 'flex-end',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        padding: 16,
    },
    heroText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonGroup: {
        width: '100%',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6B00',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 16,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});
