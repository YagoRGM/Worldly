import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Modal, TextInput, FlatList } from 'react-native';
import app from '../Config/FireBaseConfig';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, } from 'firebase/firestore';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../Config/SupaBaseConfig';
import { ActivityIndicator } from 'react-native-web';


const BUCKET_NAME = 'images-mapa'
const db = getFirestore(app);


export default function Visualizar({ navigation }) {
    const [lugares, setLugares] = useState([]);
    const [nome_lugar, setNome_lugar] = useState('');
    const [descricao_lugar, setDescricao_Lugar] = useState('');
    const [latitude_lugar, setLatitude_Lugar] = useState('');
    const [longitude_lugar, setLongitude_lugar] = useState('');
    const [modalVisible_editar, setModalVisible_editar] = useState(false);
    const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
    const [deleteid, setDeleteID] = useState(null);
    const [lugarSelecionado, setLugarSelecionado] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        carregarLugares();
    }, [])

    const carregarLugares = async () => {
        try {
            const lugaresRef = await getDocs(collection(db, 'pontosTuristicos'))
            const lugares = lugaresRef.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    nome: String(data.nome),
                    descricao: String(data.descricao),
                    latitude: data.latitude,
                    longitude: data.longitude,
                }
            });

            setLugares(lugares)
            fetchImages(lugares)
        }
        catch (error) {
            console.error('Erro ao carregar lugares:', error);
        }
    }




    const fetchImages = async (lugares) => {
        setLoading(true);

        try {
            const { data, error } = await supabase
                .storage
                .from(BUCKET_NAME)
                .list("", { limit: 100 });

            if (error) throw error;

            const imageFiles = data.filter(file =>
                file.name.match(/\.(jpg|jpeg|png)$/i)
            );

            const imageURLs = lugares.map(lugar => {
                const imagemCorrespondente = imageFiles.find(file =>
                    file.name.startsWith(lugar.id)
                );
                return {
                    id: lugar.id,
                    url: imagemCorrespondente
                        ? supabase.storage.from(BUCKET_NAME).getPublicUrl(imagemCorrespondente.name).data.publicUrl
                        : null,
                }
            });

            setImages(imageURLs)
        }
        catch (error) {
            console.log('Erro ao vizualizar imagens:', error)
        }
        finally {
            setLoading(false)
        }
    };





    const editarLugar = async () => {
        try {
            const lugarRef = doc(db, 'pontosTuristicos', lugarSelecionado.id)
            await updateDoc(lugarRef, {
                nome: nome_lugar,
                descricao: descricao_lugar,
                latitude: latitude_lugar,
                longitude: longitude_lugar,
            })

            setNome_lugar('')
            setDescricao_Lugar('')
            setLatitude_Lugar('')
            setLongitude_lugar('')
            setLugarSelecionado(null)
            setModalVisible_editar(false);
            carregarLugares();
        }
        catch (error) {
            console.error('Erro ao editar lugar:', error);
        }
    }





    const abrirModalEditar = (lugares) => {
        setLugarSelecionado(lugares)
        setModalVisible_editar(true)
        setNome_lugar(lugares.nome)
        setDescricao_Lugar(lugares.descricao)
        setLatitude_Lugar(lugares.latitude)
        setLongitude_lugar(lugares.longitude)
    }




    const confirmarExclusao = (id) => {
        setDeleteAlertVisible(true)
        setDeleteID(id)
    }




    const excluirlocalidade = async () => {
        try {
            await deleteDoc(doc(db, 'pontosTuristicos', deleteid))
            setDeleteAlertVisible(false)
            carregarLugares();
        }
        catch (error) {
            console.error('Error ao excluir Localidade', error)
        }
    }

    const renderItem = ({ item }) => {

        const imagemDolugar = images.find(img => img.id === item.id)

        return (
            <View style={styles.card}>
                <Text style={styles.title}>{item.nome}</Text>
                <View style={styles.content}>
                    <View style={styles.row}>

                        {loading ? (
                            <ActivityIndicator size="large" color='#FF6B00' />
                        ) : (
                            imagemDolugar && imagemDolugar.url ? (
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={{ uri: imagemDolugar.url }}
                                        style={styles.image}
                                        resizeMode='cover'
                                    />
                                </View>
                            ) : (
                                <Text>Imagem nao encontrada</Text>
                            )
                        )}

                        <View style={styles.buttons}>
                            <TouchableOpacity style={styles.button_mapa} onPress={() => navigation.navigate('Mapa', { latitude: item.latitude, longitude: item.longitude })}>
                                <FontAwesome name="map" size={20} color="white" />
                                <Text style={styles.buttonText}>Ver no Mapa</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button_editar} onPress={() => abrirModalEditar(item)}>
                                <FontAwesome name="pencil" size={20} color="white" />
                                <Text style={styles.buttonText}>Editar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button_excluir} onPress={() => confirmarExclusao(item.id)}>
                                <FontAwesome name="trash" size={20} color="white" />
                                <Text style={styles.buttonText}>Excluir</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button_detalhes} onPress={() => navigation.navigate('Detalhes', { marcador: item })}>
                                <FontAwesome name="info-circle" size={20} color="white" />
                                <Text style={styles.buttonText}>Detalhes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View >
        )
    }

    let [fontsLoaded] = useFonts({
        'Poppins-Regular': Poppins_400Regular,
        'Poppins-Bold': Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return <Text>Carregando fontes...</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <Text style={styles.title_mapa}>Visualizar os lugares do mapa</Text>

                <FlatList
                    data={lugares}
                    renderItem={renderItem}
                />

                <Modal visible={modalVisible_editar} transparent animationType="fade">
                    <View style={styles.modalcontainer}>
                        <View style={styles.modal}>
                            <Text style={styles.modalTitulo}>Editar Localização</Text>

                            <TextInput
                                style={styles.input}
                                value={nome_lugar}
                                onChangeText={setNome_lugar}
                                placeholder="Nome da localização"
                                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                            />

                            <TextInput
                                style={styles.input}
                                value={descricao_lugar}
                                onChangeText={setDescricao_Lugar}
                                placeholder="Descrição da localização"
                                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                            />

                            <TextInput
                                style={styles.input}
                                value={latitude_lugar}
                                onChangeText={setLatitude_Lugar}
                                placeholder="Latitude"
                                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                keyboardType="numeric"
                            />

                            <TextInput
                                style={styles.input}
                                value={longitude_lugar}
                                onChangeText={setLongitude_lugar}
                                placeholder="Longitude"
                                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                keyboardType="numeric"
                            />

                            <View style={styles.modalBotoes}>
                                <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalVisible_editar(false)}>
                                    <Text style={styles.botaoTexto}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.botaoSalvar} onPress={editarLugar}>
                                    <Text style={styles.botaoTexto}>Salvar Edições</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView >

            <AwesomeAlert
                show={deleteAlertVisible}
                title="Excluir Localização"
                titleStyle={{
                    fontFamily: 'Poppins-Bold',
                    fontSize: 24,
                    textAlign: 'center',
                    color: '#333',
                    marginBottom: 10,
                }}
                message="Você tem certeza que deseja excluir essa localização?"
                messageStyle={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: 16,
                    textAlign: 'center',
                    color: '#555',
                }}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                showCancelButton={true}
                cancelText="Cancelar"
                cancelButtonStyle={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 25,
                    backgroundColor: '#FF3B30',
                    borderWidth: 1,
                    borderColor: '#FFF',
                    marginHorizontal: 10,
                }}
                cancelButtonTextStyle={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: 16,
                    color: '#FFF',
                }}
                showConfirmButton={true}
                confirmText="Excluir"
                confirmButtonStyle={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 25,
                    backgroundColor: '#FF6B00',
                    borderWidth: 1,
                    borderColor: '#FFF',
                    marginHorizontal: 10,
                }}
                confirmButtonTextStyle={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: 16,
                    color: '#FFF',
                }}
                contentContainerStyle={{
                    backgroundColor: '#fff',
                    borderRadius: 15,
                    padding: 25,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                }}
                onCancelPressed={() => {
                    setDeleteAlertVisible(false);
                }}
                onConfirmPressed={excluirlocalidade}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: ' #F5F5F5',
    },
    title_mapa: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        fontFamily: 'Poppins-Regular',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: ' #FF6B00',
        padding: 10,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        fontFamily: 'Poppins-Regular',
    },
    content: {
        flexDirection: 'column',
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lugar_image: {
        width: 150,
        height: 100,
        borderRadius: 10,
        resizeMode: 'cover',
    },

    imageList: {
        paddingBottom: 100,
    },
    imageContainer: {
        marginBottom: 24,
        borderRadius: 18,
        backgroundColor: '#FF6B00',
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#000',
        width: '50%'
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        backgroundColor: "#eee",
    },
    buttons: {
        flex: 1,
        marginLeft: 20,
        justifyContent: 'space-between',
    },
    button_mapa: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#007BFF',
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    button_editar: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#28A745',
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    button_excluir: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#DC3545',
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    button_detalhes: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#FF6B00',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
    modalcontainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitulo: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
        color: '#333',
    },
    input: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FF6B00',
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginTop: 12,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#333',
        backgroundColor: '#fdfdfd',
    },
    modalBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    botaoSalvar: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 12,
        borderRadius: 25,
        backgroundColor: '#FF6B00',
        alignItems: 'center',
    },
    botaoCancelar: {
        flex: 1,
        marginright: 10,
        paddingVertical: 12,
        borderRadius: 25,
        backgroundColor: '#FF3B30',
        alignItems: 'center',
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
});
