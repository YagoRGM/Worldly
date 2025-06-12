import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const logoBounceAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;

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
        Animated.spring(logoBounceAnim, {
          toValue: 1,
          friction: 2,
          tension: 60,
          useNativeDriver: true,
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
      Animated.timing(footerAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
    ]).start();

    // Splash dura 5 segundos
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim, rotateAnim, titleAnim, subtitleAnim, loadingAnim, logoBounceAnim, footerAnim]);

  // Animação de rotação para a logo
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Animação de bounce para a logo
  const bounceInterpolate = logoBounceAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -30, 0],
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
              { translateY: bounceInterpolate },
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
              {
                scale: subtitleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
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
            {
              translateY: loadingAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Carregando experiências incríveis...</Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.footer,
          {
            opacity: footerAnim,
            transform: [
              {
                translateY: footerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.footerText}>© {new Date().getFullYear()} Worldly</Text>
      </Animated.View>
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
    width: 250,
    height: 500,
    marginBottom: 18,
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
    height: 50,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.7,
    letterSpacing: 1,
  },
});