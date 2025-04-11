import React from 'react';
import { View, Text, Button } from 'react-native';

export default function Visualizar({ navigation }) {
    return (
        <View style={{
            flex: 1, justifyContent: 'center', alignItems:
                'center'
        }}>
            <Text>Visualizar</Text>
            <Button title="DETALHES" onPress={() =>
                navigation.navigate('Detalhes')} />
        </View>
    );
}