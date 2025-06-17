import React, { useState, useEffect, useRef, } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { db } from '../Config/FireBaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import * as Location from 'expo-location';
import { Modalize } from 'react-native-modalize';
import { useRoute } from '@react-navigation/native';

const containerStyle = {
  width: '100%',
  height: '100%',
  flex: 1,
};

const center = {
  latitude: -23.55052,
  longitude: -46.633308,
};

const mapOptions = {
  styles: [
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

export default function Mapa({ navigation, route }) {
  const [marcadores, setMarcadores] = useState([]);
  const [marcadorSelecionado, setMarcadorSelecionado] = useState(null);
  const modalRef = useRef(null);
  const [localizacaoAtual, setLocalizacaoAtual] = useState(null);
  const [localizacaoAtual_marcador, setLocalizacaoAtual_marcador] = useState(null);

  const buscarMarcadores = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'pontosTuristicos'));
      const marcadoresFirestore = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(), // Pegando todas as infos (ex: nome, descrição, imagem)
        latitude: Number(doc.data().latitude),
        longitude: Number(doc.data().longitude),
      }));
      setMarcadores(marcadoresFirestore);
    } catch (error) {
      console.error('Erro ao buscar marcadores:', error);
    }
  };

  useEffect(() => {
    buscarMarcadores();
  }, []);

  useEffect(() => {
    if (route.params?.novoLugar) {
      const novo = {
        id: 'novo',
        latitude: route.params.novoLugar.latitude,
        longitude: route.params.novoLugar.longitude,
        nome: route.params.novoLugar.nome || 'Novo Lugar',
        descricao: route.params.novoLugar.descricao || 'Sem descrição',
      };
      setMarcadores((prev) => [...prev, novo]);
    }
  }, [route.params?.novoLugar]);

  const abrirModal = (marcador) => {
    setMarcadorSelecionado(marcador);
    modalRef.current?.open();
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Não foi possível acessar a localização');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocalizacaoAtual({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    if (route.params?.latitude && route.params?.longitude) {
      setLocalizacaoAtual_marcador({
        latitude: route.params.latitude,
        longitude: route.params.longitude,
      });
    }
  }, [route.params]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={containerStyle}
        initialRegion={{
          latitude: (localizacaoAtual_marcador || localizacaoAtual || center).latitude,
          longitude: (localizacaoAtual_marcador || localizacaoAtual || center).longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        region={
          (localizacaoAtual_marcador || localizacaoAtual) && {
            latitude: (localizacaoAtual_marcador || localizacaoAtual).latitude,
            longitude: (localizacaoAtual_marcador || localizacaoAtual).longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }
        }
        customMapStyle={mapOptions.styles}
        showsUserLocation={!!localizacaoAtual}
      >
        {marcadores.map((marcador, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marcador.latitude,
              longitude: marcador.longitude,
            }}
            onPress={() => abrirModal(marcador)}
          />
        ))}
        {localizacaoAtual && (
          <>
            <Circle
              center={localizacaoAtual}
              radius={50}
              strokeColor="#4285F4"
              strokeWidth={2}
              fillColor="rgba(66,133,244,0.35)"
            />
            <Circle
              center={localizacaoAtual}
              radius={20}
              strokeColor="#4285F4"
              strokeWidth={2}
              fillColor="rgba(66,133,244,0.35)"
            />
            <Marker
              coordinate={localizacaoAtual}
              pinColor="blue"
            />
          </>
        )}
      </MapView>

      <TouchableOpacity style={styles.botaoCadastrar} onPress={() => navigation.navigate('Cadastrar Lugares')}>
        <Text style={styles.simboloMais}>+</Text>
        <Text style={styles.textoBotaoCadastrar}> Cadastrar Lugar</Text>
      </TouchableOpacity>


      {/* Bottom Modal */}
      <Modalize
        ref={modalRef}
        snapPoint={300}
        modalHeight={350}
        handleStyle={{ backgroundColor: '#ccc', width: 60 }}
      >
        {marcadorSelecionado && (
          <View style={styles.modalContent}>
            <Text style={styles.titulo}>{marcadorSelecionado.nome}</Text>
            <Text style={styles.descricao}>{marcadorSelecionado.descricao}</Text>
            <Text style={styles.coordenadas}>
              📍 {marcadorSelecionado.latitude}, {marcadorSelecionado.longitude}
            </Text>

            <TouchableOpacity
              style={styles.botaoDetalhes}
              onPress={() => {
                modalRef.current?.close();
                navigation.navigate('Detalhes', { marcador: marcadorSelecionado });
              }}
            >
              <Text style={styles.textoBotaoDetalhes}>Ver Detalhes</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modalize>


    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  botaoCadastrar: {
    position: 'absolute',
    bottom: 20,
    left: 32,
    right: 32,
    backgroundColor: '#00796B',
    paddingVertical: 8,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  simboloMais: {
    color: '#fff',
    fontSize: 24,
    bottom: 2,
    fontWeight: 'bold',
  },
  textoBotaoCadastrar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  descricao: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
  coordenadas: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  botaoDetalhes: {
    backgroundColor: '#00796B',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotaoDetalhes: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
