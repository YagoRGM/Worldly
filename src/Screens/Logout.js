import React, { useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../Config/SupaBaseConfig';

export default function Logout({ navigation }) {
  useEffect(() => {
    const doLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Erro ao sair', error.message);
        return;
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    };
    doLogout();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#FF6B00" />
    </View>
  );
}