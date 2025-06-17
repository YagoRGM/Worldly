import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image, Linking } from 'react-native';
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
      Alert.alert('Sucesso', 'Ponto cadastrada com sucesso!');
      setNome('');
      setDescricao('');
      setLatitude('');
      setLongitude('');
      setImagem('');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar ponto.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F5F5F5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.outerContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.box}>
          <Text style={styles.titulo}>Cadastrar Ponto Turístico</Text>
          <Text style={styles.subtitulo}>
            Preencha os dados do ponto turístico que merece ser compartilhado!
          </Text>
          <TextInput
            placeholder="Nome do Ponto Turístico"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholderTextColor="#"
          />
          <TextInput
            placeholder="Descrição"
            style={[styles.input, { height: 80 }]}
            value={descricao}
            onChangeText={setDescricao}
            multiline
            placeholderTextColor="#"
          />
          <View style={styles.row}>
            <TextInput
              placeholder="Latitude"
              style={[styles.input, styles.inputHalf]}
              keyboardType="numeric"
              value={latitude}
              onChangeText={setLatitude}
              placeholderTextColor="#"
            />
            <TextInput
              placeholder="Longitude"
              style={[styles.input, styles.inputHalf]}
              keyboardType="numeric"
              value={longitude}
              onChangeText={setLongitude}
              placeholderTextColor="#"
            />
          </View>

          <TouchableOpacity
            onPress={() => Linking.openURL('https://maps.google.com')}
            style={{ marginBottom: 10, alignSelf: 'flex-start' }}
          >
            <Text style={{ color: '#00796B', textDecorationLine: 'underline', fontSize: 13 }}>
               Não sabe a localização exata? Abra no Google Maps
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.input, styles.imagemPicker]} onPress={escolherImagem}>
            <FontAwesome name="image" size={20} color="#ff6b00" />
            <Text style={{ marginLeft: 10, color: '#ff6b00', fontFamily: 'Poppins-Regular' }}>
              {imagem ? 'Trocar Imagem' : 'Selecionar Imagem'}
            </Text>
          </TouchableOpacity>
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.imagemPreview} />
          ) : null}
          <TouchableOpacity style={styles.botao} onPress={cadastrarLugar}>
            <Text style={styles.botaoTexto}>Cadastrar Ponto Turístico</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5F2',
    paddingVertical: 32,
  },
  box: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CDE4DF',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00796B',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1,
  },
  subtitulo: {
    fontSize: 15,
    color: '#4F4F4F',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#ff6b00',
    backgroundColor: '#F9FDFD',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  imagemPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDFB',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#ff6b00',
    marginBottom: 10,
    height: 50,
    borderRadius: 12,
  },
  imagemPreview: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#B2DFDB',
  },
  botao: {
    backgroundColor: '#00796B',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
    width: '100%',
    marginBottom: 6,
  },
  botaoTexto: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1,
  },
});
