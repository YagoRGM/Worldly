import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Inicio from '../Screens/Inicio';
import Perfil from '../Screens/Perfil';
import Login from '../Screens/Login';
import CadastrarLugares from '../Screens/CadastrarLugares';
import Visualizar from '../Screens/Visualizar';
import Detalhes from '../Screens/Detalhes';
import Mapa from '../Screens/Mapa';
import LoginScreen from '../Screens/LoginScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Inicio"
            screenOptions={({ route }) => ({
                headerStyle: {
                    backgroundColor: '#FF6B00',
                },
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#FF6B00',
                    borderTopWidth: 0,
                },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Visualizar':
                            iconName = focused ? 'list' : 'list-outline';
                            break;
                        case 'CadastrarLugares':
                            iconName = focused ? 'add-circle' : 'add-circle-outline';
                            break;
                        case 'Inicio':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Mapa':
                            iconName = focused ? 'map' : 'map-outline';
                            break;
                        case 'Perfil':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        default:
                            iconName = 'alert-circle';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
                tabBarStyle: {
                    backgroundColor: '#FF6B00',
                    borderTopWidth: 0,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 4,
                },
            })}
        >
            <Tab.Screen name="Visualizar" component={Visualizar} />
            <Tab.Screen name="CadastrarLugares" component={CadastrarLugares} />
            <Tab.Screen name="Inicio" component={Inicio} />
            <Tab.Screen name="Mapa" component={Mapa} />
            <Tab.Screen name="Perfil" component={Perfil} />
        </Tab.Navigator>
    );
}


export default function Routes() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Inicio" component={BottomTabs} options={{ headerShown: false }} />
            <Stack.Screen name="Detalhes" component={Detalhes}
                options={{
                    title: 'Detalhes',
                    headerStyle: { backgroundColor: '#FF6B00' },
                    headerTintColor: '#fff',
                }}
            />
        </Stack.Navigator>
    );
}
