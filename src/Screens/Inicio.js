import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  Animated,
  ImageBackground,
  Image,
  FlatList,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../Config/SupaBaseConfig';

const { width } = Dimensions.get('window');

export default function Home({ navigation }) {
  const [scale1] = useState(new Animated.Value(1));
  const [scale2] = useState(new Animated.Value(1));
  const [carouselImages, setCarouselImages] = useState([]);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.storage.from('imagens').list('', { limit: 10 });
      if (error) return;
      const urls = data
        .filter(item => item.name.match(/\.(jpg|jpeg|png|webp)$/i))
        .map(item =>
          supabase.storage.from('imagens').getPublicUrl(item.name).data.publicUrl
        );
      setCarouselImages(urls);
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (carouselImages.length === 0) return;
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % carouselImages.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3500);
    return () => clearInterval(interval);
  }, [carouselImages, currentIndex]);

  const animateButton = (animation, toValue, callback) => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={true}
      indicatorStyle="white"
      style={Platform.OS === 'android' ? { backgroundColor: '#f8f9fa' } : {}}
    >
      {/* Frase inspiradora */}
      <Text style={styles.quote}>
        "Viajar é trocar a roupa da alma." – Mario Quintana
      </Text>

      {/* Destaques de funcionalidades */}
      <View style={styles.featuresRow}>
        <View style={styles.featureItem}>
          <Ionicons name="map" size={28} color="#FF6B00" />
          <Text style={styles.featureText}>Mapa Interativo</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="camera" size={28} color="#FF6B00" />
          <Text style={styles.featureText}>Compartilhe Fotos</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="star" size={28} color="#FF6B00" />
          <Text style={styles.featureText}>Favoritos</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="heart" size={28} color="#FF6B00" />
          <Text style={styles.featureText}>Comunidade</Text>
        </View>
      </View>

      {/* Estatísticas rápidas */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Ionicons name="earth" size={24} color="#009688" />
          <Text style={styles.statNumber}>+120</Text>
          <Text style={styles.statLabel}>Lugares</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="people" size={24} color="#009688" />
          <Text style={styles.statNumber}>+300</Text>
          <Text style={styles.statLabel}>Exploradores</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="images" size={24} color="#009688" />
          <Text style={styles.statNumber}>+800</Text>
          <Text style={styles.statLabel}>Fotos</Text>
        </View>
      </View>

      {/* Dica do dia */}
      <View style={styles.tipBox}>
        <Ionicons name="bulb" size={22} color="#FF6B00" style={{ marginRight: 6 }} />
        <Text style={styles.tipText}>
          Dica do dia: Explore lugares próximos e descubra tesouros escondidos na sua cidade!
        </Text>
      </View>

      {/* Descrição moderna no topo */}
      <View style={styles.topDescriptionBox}>
        <Text style={styles.topTitle}>Descubra. Compartilhe. Viva.</Text>
        <Text style={styles.topDescription}>
          Bem-vindo ao <Text style={{ color: '#FF6B00', fontWeight: 'bold' }}>Worldly</Text>, a plataforma feita para quem ama explorar, viver novas experiências e compartilhar o melhor do mundo!{'\n\n'}
          Aqui você encontra lugares incríveis, descobre segredos locais, registra memórias e inspira outros viajantes. Seja para planejar sua próxima aventura ou para mostrar aquele cantinho especial da sua cidade, o Worldly é seu passaporte para uma comunidade apaixonada por cultura, turismo e conexão real.
        </Text>
      </View>

      {/* Chamada de ação */}
      <Text style={styles.ctaText}>
        Pronto para sua próxima aventura? Explore o mapa ou compartilhe um lugar especial agora mesmo!
      </Text>

      <ImageBackground
        source={require('../assets/img/4.png')}
        style={styles.heroImage}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.heroTitle}>🌍 Bem-vindo ao Worldly</Text>
          <Text style={styles.heroSubtitle}>Descubra lugares incríveis perto de você</Text>
        </View>
      </ImageBackground>

      {/* Carrossel de imagens */}
      {carouselImages.length > 0 && (
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={carouselImages}
            horizontal
            pagingEnabled
            snapToAlignment="center"
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.carouselImage} />
            )}
            onMomentumScrollEnd={ev => {
              const idx = Math.round(ev.nativeEvent.contentOffset.x / (width - 48));
              setCurrentIndex(idx);
            }}
            getItemLayout={(data, index) => ({
              length: width - 48,
              offset: (width - 48) * index,
              index,
            })}
          />
          <View style={styles.dotsContainer}>
            {carouselImages.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  currentIndex === idx && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Descrição do carrossel */}
      <Text style={styles.carouselDescription}>
        Veja alguns dos lugares incríveis já cadastrados pela comunidade Worldly!
      </Text>

      <Text style={styles.description}>
        O Worldly é seu guia global e local! Explore pontos turísticos próximos, adicione novos lugares, compartilhe experiências e viva aventuras ao redor do mundo. Tudo isso na palma da sua mão!
      </Text>

      {/* Texto extra para engajamento */}
      <View style={styles.extraInfoBox}>
        <Text style={styles.extraInfoTitle}>Por que usar o Worldly?</Text>
        <Text style={styles.extraInfoText}>
          • Descubra pontos turísticos e segredos locais{'\n'}
          • Compartilhe fotos e dicas com outros exploradores{'\n'}
          • Salve seus lugares favoritos e planeje roteiros{'\n'}
          • Atualizações constantes com novidades e eventos
        </Text>
      </View>

      {/* Texto motivacional extra */}
      <View style={styles.extraInfoBox}>
        <Text style={styles.extraInfoTitle}>Junte-se à nossa comunidade!</Text>
        <Text style={styles.extraInfoText}>
          No Worldly, cada usuário é um explorador e cada lugar tem uma história. Compartilhe suas experiências, inspire outros viajantes e ajude a construir o maior mapa colaborativo de aventuras do Brasil e do mundo!
        </Text>
      </View>

      {/* Botão de acesso rápido */}
      <Pressable style={styles.quickStartButton} onPress={() => navigation.navigate('Mapa')}>
        <Text style={styles.quickStartButtonText}>Explorar Agora</Text>
      </Pressable>

      <View style={styles.buttonGroup}>
        <Animated.View style={{ transform: [{ scale: scale1 }] }}>
          <Pressable
            style={styles.button}
            onPress={() => animateButton(scale1, 0.95, () => navigation.navigate('Visualizar'))}
          >
            <Ionicons name="location-outline" size={22} color="#fff" />
            <Text style={styles.buttonText}>Locais Próximos</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scale2 }] }}>
          <Pressable
            style={[styles.button, { backgroundColor: '#009688' }]}
            onPress={() => animateButton(scale2, 0.95, () => navigation.navigate('Cadastrar Lugares'))}
          >
            <Ionicons name="add-circle-outline" size={22} color="#fff" />
            <Text style={styles.buttonText}>Adicionar Local</Text>
          </Pressable>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    padding: 24,
  },
  quote: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 15,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    width: '100%',
  },
  featureItem: {
    alignItems: 'center',
    width: 90,
  },
  featureText: {
    fontSize: 13,
    color: '#444',
    marginTop: 4,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 18,
    marginTop: 8,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#444',
    marginTop: 1,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbe7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    width: '100%',
    elevation: 1,
  },
  tipText: {
    color: '#FF6B00',
    fontSize: 14,
    fontStyle: 'italic',
    flex: 1,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B00',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'center',
    marginBottom: 18,
    marginTop: 2,
    elevation: 3,
  },
  socialButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
    letterSpacing: 1,
  },
  topDescriptionBox: {
    width: '100%',
    marginBottom: 18,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  topTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 1,
  },
  topDescription: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaText: {
    fontSize: 16,
    color: '#FF6B00',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  heroImage: {
    width: width - 48,
    height: 220,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 16,
  },
  heroTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    marginTop: 4,
  },
  carouselContainer: {
    width: width - 48,
    height: 180,
    marginBottom: 12,
    alignSelf: 'center',
  },
  carouselImage: {
    width: width - 48,
    height: 180,
    borderRadius: 16,
    marginRight: 8,
    resizeMode: 'cover',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#FF6B00',
    width: 16,
  },
  carouselDescription: {
    fontSize: 15,
    color: '#FF6B00',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  extraInfoBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  extraInfoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#009688',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  extraInfoText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
  quickStartButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginVertical: 16,
    elevation: 4,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  quickStartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  buttonGroup: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B00',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

// Customização da barra de rolagem laranja para web
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.innerHTML = `
    ::-webkit-scrollbar-thumb {
      background: #FF6B00 !important;
      border-radius: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #f8f9fa !important;
    }
    ::-webkit-scrollbar {
      width: 10px;
    }
  `;
  document.head.appendChild(style);
}