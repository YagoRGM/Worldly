import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequência de animações
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(loadingAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
    ]).start();

    // Splash dura 10 segundos
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim, rotateAnim, titleAnim, subtitleAnim, loadingAnim]);

  // Animação de rotação para a logo
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/img/3-removebg-preview (1).png')}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: rotateInterpolate },
            ],
          },
        ]}
        resizeMode="contain"
      />
      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: subtitleAnim,
            transform: [
              {
                translateY: subtitleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        Descubra. Compartilhe. Viva.
      </Animated.Text>
      <Animated.View
        style={{
          opacity: loadingAnim,
          marginTop: 40,
          transform: [
            {
              scale: loadingAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.7, 1],
              }),
            },
          ],
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Carregando experiências incríveis...</Text>
      </Animated.View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} Worldly</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 18,
    // Sem fundo, para PNG transparente
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 3,
    marginBottom: 6,
    textShadowColor: '#0006',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    fontStyle: 'italic',
    letterSpacing: 1.2,
    marginBottom: 24,
    textShadowColor: '#0003',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  loadingText: {
    color: '#fff',
    marginTop: 18,
    fontSize: 15,
    fontStyle: 'italic',
    letterSpacing: 0.5,
    opacity: 0.8,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.7,
    letterSpacing: 1,
  },
});