import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView,} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { db } from '../Config/FireBaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function CadastrarLugares({ navigation }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleCadastrar = async () => {
    if (!nome || !latitude || !longitude) {
      showMessage({
        message: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios.',
        type: 'warning',
        icon: 'warning',
      });      
      return;
    }

    const novoLugar = {
      nome,
      descricao,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    try {
      await addDoc(collection(db, 'pontosTuristicos'), novoLugar);
      showMessage({
        message: 'Sucesso!',
        description: 'Lugar cadastrado com sucesso!',
        type: 'success',
        icon: 'success',
      });
      
      navigation.navigate('Mapa', { novoLugar });
    } catch (error) {
      console.error('Erro ao cadastrar lugar:', error);
      showMessage({
        message: 'Erro!',
        description: 'Erro ao cadastrar lugar. Tente novamente.',
        type: 'danger',
        icon: 'danger',
      });      
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <KeyboardAvoidingView
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.title}>📍 Cadastrar Lugar</Text>

          <Text style={styles.label}>Nome*</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do lugar"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Digite uma descrição"
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />

          <Text style={styles.label}>Latitude</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: -23.5505"
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Longitude</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: -46.6333"
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#eaf2f8',
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FF6B00',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#FF6B00',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
