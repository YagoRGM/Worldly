import React from 'react';
import { View, Text, Button } from 'react-native';

export default function Login({ navigation }) {
    return (
        <View style={{
            flex: 1, justifyContent: 'center', alignItems:
                'center'
        }}>
            <Text>Login</Text>
            <Button title="Ir para Home" onPress={() =>
                navigation.replace('Inicio')} />
        </View>
    );
}