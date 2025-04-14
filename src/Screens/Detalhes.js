import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Detalhes({ route }) {
  const { marcador } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>{marcador.nome}</Text>

        <Text style={styles.descricao}>{marcador.descricao}</Text>

        <View style={styles.infoBox}>
          <Ionicons name="location-sharp" size={25} color="#FF6B00" />
          <Text style={styles.infoText}>Latitude: {marcador.latitude}</Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="location-sharp" size={25} color="#FF6B00" />
          <Text style={styles.infoText}>Longitude: {marcador.longitude}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#e9f0f7',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  descricao: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
    lineHeight: 22,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f3f7fa',
    padding: 10,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
});
