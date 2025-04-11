import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { db } from '../Config/FireBaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function CadastrarLugares({ navigation }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleCadastrar = async () => {
    if (!nome || !latitude || !longitude) {
      Alert.alert('Preencha todos os campos obrigatórios!');
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
      Alert.alert('Lugar cadastrado com sucesso!');
      navigation.navigate('Mapa', { novoLugar });
    } catch (error) {
      console.error('Erro ao cadastrar lugar:', error);
      Alert.alert('Erro ao cadastrar lugar. Tente novamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Lugar</Text>

      <Text style={styles.label}>Nome*</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do lugar"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite uma descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text style={styles.label}>Latitude*</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: -23.5505"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Longitude*</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
