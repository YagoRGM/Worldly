import React, { useState, useEffect, useCallback } from 'react';
import { View, Button } from 'react-native';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '../Config/MapsConfig';
import { db } from '../Config/FireBaseConfig'; // Importa o Firestore configurado
import { collection, getDocs } from 'firebase/firestore'; // Importa os métodos necessários do Firestore

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: -23.55052, // Pode mudar depois
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

  // Função para buscar os marcadores do Firestore
  const buscarMarcadores = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'pontosTuristicos'));
      const marcadoresFirestore = querySnapshot.docs.map((doc) => ({
        lat: doc.data().latitude,
        lng: doc.data().longitude,
      }));
      setMarcadores(marcadoresFirestore);
    } catch (error) {
      console.error('Erro ao buscar marcadores:', error);
    }
  };

  useEffect(() => {
    buscarMarcadores(); // Busca os marcadores ao carregar o componente
  }, []);

  useEffect(() => {
    if (route.params?.novoLugar) {
      const novo = {
        lat: route.params.novoLugar.latitude,
        lng: route.params.novoLugar.longitude,
      };
      setMarcadores((prev) => [...prev, novo]);
    }
  }, [route.params?.novoLugar]);

  const handleMapClick = useCallback((event) => {
    const novoMarcador = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarcadores((prev) => [...prev, novoMarcador]);
  }, []);

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={mapOptions}
        onClick={handleMapClick}
      >
        {marcadores.map((posicao, index) => (
          <Marker key={index} position={posicao} />
        ))}
      </GoogleMap>

      <Button title="Cadastrar Lugar" onPress={() => navigation.navigate('CadastrarLugares')} />
    </LoadScript>
  );
}