import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { db } from '../Config/FireBaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

export default function CadastrarLugares() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imagem, setImagem] = useState('');

  const escolherImagem = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImagem(result.assets[0].uri);
    }
  };

  const cadastrarLugar = async () => {
    if (!nome || !descricao || !latitude || !longitude) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      await addDoc(collection(db, 'pontosTuristicos'), {
        nome,
        descricao,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        favorito: false,
        imagem: imagem || '',
      });
      Alert.alert('Sucesso', 'Cidade cadastrada com sucesso!');
      setNome('');
      setDescricao('');
      setLatitude('');
      setLongitude('');
      setImagem('');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar cidade.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F5F5F5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Cadastrar Cidade</Text>
        <Text style={styles.subtitulo}>Preencha os dados da cidade que merece ser lembrada!</Text>
        <TextInput
          placeholder="Nome da Cidade"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholderTextColor="#FF6B00"
        />
        <TextInput
          placeholder="Descrição"
          style={[styles.input, { height: 80 }]}
          value={descricao}
          onChangeText={setDescricao}
          multiline
          placeholderTextColor="#FF6B00"
        />
        <View style={styles.row}>
          <TextInput
            placeholder="Latitude"
            style={[styles.input, styles.inputHalf]}
            keyboardType="numeric"
            value={latitude}
            onChangeText={setLatitude}
            placeholderTextColor="#FF6B00"
          />
          <TextInput
            placeholder="Longitude"
            style={[styles.input, styles.inputHalf]}
            keyboardType="numeric"
            value={longitude}
            onChangeText={setLongitude}
            placeholderTextColor="#FF6B00"
          />
        </View>
        <TouchableOpacity style={[styles.input, styles.imagemPicker]} onPress={escolherImagem}>
          <FontAwesome name="image" size={20} color="#FF6B00" />
          <Text style={{ marginLeft: 10, color: '#FF6B00', fontFamily: 'Poppins-Regular' }}>
            {imagem ? 'Trocar Imagem' : 'Selecionar Imagem'}
          </Text>
        </TouchableOpacity>
        {imagem ? (
          <Image source={{ uri: imagem }} style={styles.imagemPreview} />
        ) : null}
        <TouchableOpacity style={styles.botao} onPress={cadastrarLugar}>
          <Text style={styles.botaoTexto}>Cadastrar Cidade</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1,
  },
  subtitulo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#FF6B00',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 18,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  inputHalf: {
    width: '48%',
  },
  imagemPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffbe6',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#FF6B00',
    marginBottom: 10,
    height: 50,
  },
  imagemPreview: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 18,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  botao: {
    backgroundColor: '#FF6B00',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    width: '100%',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1,
  },
});