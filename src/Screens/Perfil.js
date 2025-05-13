import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Pressable, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

export default function Perfil({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore();
        const user = auth.currentUser;

        if (user) {
            const userDocRef = doc(db, 'users', user.uid);

            const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    console.log('Dados do usuário não encontrados.');
                }
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B00" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Perfil</Text>
            {userData ? (
                <>
                    <View style={styles.infoBox}>
                        <Text style={styles.label}>Nome:</Text>
                        <Text style={styles.info}>{userData.nome}</Text>
                    </View>
                    <View style={styles.infoBox}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.info}>{userData.email}</Text>
                    </View>
                </>
            ) : (
                <Text style={styles.info}>Dados do usuário não encontrados.</Text>
            )}

            <Pressable style={styles.button} onPress={() => navigation.navigate('EditarPerfil')}>
                <Text style={styles.buttonText}>Editar Perfil</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    infoBox: {
        width: '100%',
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    info: {
        fontSize: 18,
        color: '#000',
    },
    button: {
        marginTop: 24,
        backgroundColor: '#FF6B00',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 30,
        shadowColor: '#FF6B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
