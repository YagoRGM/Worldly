import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { getAuth, updateEmail } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

export default function EditarPerfil({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();
            const db = getFirestore();
            const user = auth.currentUser;

            if (user) {
                const userDoc = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userDoc);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setNome(data.nome || '');
                    setEmail(data.email || '');
                } else {
                    Alert.alert('Erro', 'Dados do usuário não encontrados.');
                }
            }

            setLoading(false);
        };

        fetchUserData();
    }, []);

    const handleSalvar = async () => {
        const auth = getAuth();
        const db = getFirestore();
        const user = auth.currentUser;

        if (!user) return;

        try {
            if (user.email !== email) {
                await updateEmail(user, email);
            }

            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                nome,
                email,
            });

            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro ao atualizar perfil', error.message);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B00" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Editar Perfil</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    placeholderTextColor="#aaa"
                    value={nome}
                    onChangeText={setNome}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Pressable style={styles.button} onPress={handleSalvar}>
                    <Text style={styles.buttonText}>Salvar Alterações</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        padding: 14,
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        color: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    button: {
        backgroundColor: '#FF6B00',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 30,
        shadowColor: '#FF6B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
