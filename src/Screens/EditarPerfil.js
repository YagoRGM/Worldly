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
    ScrollView,
    Image
} from 'react-native';
import { supabase } from '../Config/SupaBaseConfig';

export default function EditarPerfil({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                Alert.alert('Erro', 'Usuário não autenticado.');
                setLoading(false);
                return;
            }

            setNome(user.user_metadata?.nome || '');
            setEmail(user.email || '');
            setLoading(false);
        };

        fetchUserData();
    }, []);

    const handleSalvar = async () => {
        setLoading(true);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            Alert.alert('Erro', 'Usuário não autenticado.');
            setLoading(false);
            return;
        }

        try {
            // Só atualiza o nome, não permite trocar o e-mail
            const { error: updateError } = await supabase.auth.updateUser({
                data: { nome }
            });

            if (updateError) {
                throw updateError;
            }

            Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro ao atualizar perfil', error.message);
        } finally {
            setLoading(false);
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
            style={{ flex: 1, backgroundColor: '#f5f6fa' }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Editar Perfil</Text>

                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu nome"
                        placeholderTextColor="#aaa"
                        value={nome}
                        onChangeText={setNome}
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[styles.input, styles.inputDisabled]}
                        placeholder="Email"
                        placeholderTextColor="#aaa"
                        value={email}
                        editable={false}
                        selectTextOnFocus={false}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <Pressable style={styles.button} onPress={handleSalvar}>
                        <Text style={styles.buttonText}>Salvar Alterações</Text>
                    </Pressable>

                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backButtonText}>Voltar</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    card: {
        width: '100%',
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF6B00',
        marginBottom: 28,
        marginTop: 4,
        letterSpacing: 1,
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 15,
        color: '#888',
        marginBottom: 4,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginTop: 10,
    },
    input: {
        width: '100%',
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
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
    inputDisabled: {
        backgroundColor: '#eee',
        color: '#888',
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
        marginTop: 20,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 1,
    },
    backButton: {
        marginTop: 18,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 30,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#FF6B00',
        alignItems: 'center',
        width: '100%',
    },
    backButtonText: {
        color: '#FF6B00',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 1,
    },
});