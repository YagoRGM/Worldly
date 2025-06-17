import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { supabase } from '../Config/SupaBaseConfig';

export default function Perfil({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Atualiza dados do usuário toda vez que a tela ganha foco
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            setLoading(true);
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                setUserData(null);
                setLoading(false);
                return;
            }
            setUserData({
                nome: user.user_metadata?.nome || '',
                email: user.email || '',
            });
            setLoading(false);
        });

        // Carrega na primeira montagem também
        (async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                setUserData(null);
                setLoading(false);
                return;
            }
            setUserData({
                nome: user.user_metadata?.nome || '',
                email: user.email || '',
            });
            setLoading(false);
        })();

        return unsubscribe;
    }, [navigation]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B00" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.profileCard}>
                <Text style={styles.title}>Meu Perfil</Text>
                {userData ? (
                    <>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Nome</Text>
                            <Text style={styles.info}>{userData.nome}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Email</Text>
                            <Text style={styles.info}>{userData.email}</Text>
                        </View>
                    </>
                ) : (
                    <Text style={styles.info}>Dados do usuário não encontrados.</Text>
                )}
                <Pressable style={[styles.button, styles.buttonMargin]} onPress={() => navigation.navigate('EditarPerfil')}>
                    <Text style={styles.buttonText}>Editar Perfil</Text>
                </Pressable>
                <Pressable
                    style={styles.buttonLogout}
                    onPress={async () => {
                        await supabase.auth.signOut();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }}
                >
                    <Text style={styles.buttonText}>Sair</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f6fa',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f6fa',
    },
    profileCard: {
        width: '95%',
        maxWidth: 380,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 12,
        elevation: 8,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        marginBottom: 18,
        backgroundColor: '#eee',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FF6B00',
        marginBottom: 28,
        marginTop: 4,
        letterSpacing: 1,
    },
    infoRow: {
        width: '100%',
        flexDirection: 'column',
        marginBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 10,
    },
    label: {
        fontSize: 15,
        color: '#888',
        marginBottom: 2,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    info: {
        fontSize: 19,
        color: '#222',
        fontWeight: '500',
    },
    button: {
        backgroundColor: '#FF6B00',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
        shadowColor: '#FF6B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        width: '100%', 
        alignItems: 'center', 
    },
    buttonLogout: {
        backgroundColor: 'red',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
        shadowColor: '#FF6B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        width: '100%', 
        alignItems: 'center', 
    },
    buttonMargin: {
        marginTop: 32,
        marginBottom: 16, 
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});