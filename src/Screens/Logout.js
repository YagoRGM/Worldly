import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { supabase } from '../Config/SupaBaseConfig';

export default function Logout({ navigation }) {
  useEffect(() => {
    const doLogout = async () => {
      await supabase.auth.signOut();
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