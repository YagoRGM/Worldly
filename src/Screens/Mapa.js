import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '../Config/MapsConfig';
import { db } from '../Config/FireBaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import * as Location from 'expo-location';
import { Modalize } from 'react-native-modalize';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: -23.55052,
  lng: -46.633308,
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

  const buscarMarcadores = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'pontosTuristicos'));
      const marcadoresFirestore = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(), // Pegando todas as infos (ex: nome, descrição, imagem)
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
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    })();
  }, []);


  return (
    <View style={{ flex: 1 }}>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={localizacaoAtual}
          zoom={17}
          options={mapOptions}

        >
          {marcadores.map((marcador, index) => (
            <Marker
              key={index}
              position={{
                lat: marcador.latitude,
                lng: marcador.longitude,
              }}
              onClick={() => abrirModal(marcador)}

            />
          ))}
          {localizacaoAtual && (
            <>
              <Circle
                center={localizacaoAtual}
                radius={50}
                options={{
                  strokeColor: '#4285F4',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#4285F4',
                  fillOpacity: 0.35,
                }}
              />
              {localizacaoAtual && (
                <>
                  <Circle
                    center={localizacaoAtual}
                    radius={20} // raio em metros
                    options={{
                      strokeColor: '#4285F4',
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: '#4285F4',
                      fillOpacity: 0.35,
                    }}
                  />
                </>
              )}
              <Marker
                position={localizacaoAtual}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            </>
          )}

        </GoogleMap>
      </LoadScript>
      <TouchableOpacity style={styles.botaoCadastrar} onPress={() => navigation.navigate('CadastrarLugares')}>
        <Text style={styles.textoBotaoCadastrar}>+ Cadastrar Lugar</Text>
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
  modalContent: {
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  botaoCadastrar: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 13,
    marginBottom: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
    backgroundColor: '#34A853',
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
