import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import app from '../Config/FireBaseConfig';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../Config/SupaBaseConfig';

const db = getFirestore(app);

export default function Visualizar({ navigation }) {
    const [lugares, setLugares] = useState([]);
    const [nome_lugar, setNome_lugar] = useState('');
    const [descricao_lugar, setDescricao_Lugar] = useState('');
    const [latitude_lugar, setLatitude_Lugar] = useState('');
    const [longitude_lugar, setLongitude_lugar] = useState('');
    const [imagem_lugar, setImagem_lugar] = useState('');
    const [imagem_local_file, setImagem_local_file] = useState(null);
    const [modalVisible_editar, setModalVisible_editar] = useState(false);
    const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
    const [deleteid, setDeleteID] = useState(null);
    const [lugarSelecionado, setLugarSelecionado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [abaFavoritos, setAbaFavoritos] = useState(false);
    const [favoritos, setFavoritos] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUserAndData = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);

            if (data.user && data.user.id) {
                await carregarFavoritos(data.user.id);
            } else {
                setFavoritos([]);
            }
            await carregarLugares();
        };

        const unsubscribeNav = navigation.addListener('focus', () => {
            getUserAndData();
        });

        getUserAndData();

        return () => {
            unsubscribeNav();
        };
    }, [navigation]);

    const carregarLugares = async () => {
        setLoading(true);
        try {
            const lugaresRef = await getDocs(collection(db, 'pontosTuristicos'));
            const lugares = lugaresRef.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    nome: String(data.nome),
                    descricao: String(data.descricao),
                    latitude: data.latitude,
                    longitude: data.longitude,
                    imagem: data.imagem || '',
                    user_email: data.user_email || '',
                }
            });
            setLugares(lugares);
        } catch (error) {
            console.error('Erro ao carregar lugares:', error);
        }
        setLoading(false);
    };

    const carregarFavoritos = async (userId) => {
        try {
            if (!userId) {
                setFavoritos([]);
                return;
            }
            const favRef = doc(db, 'favoritos', userId);
            const favSnap = await getDoc(favRef);
            if (favSnap.exists()) {
                setFavoritos(favSnap.data().lugares || []);
            } else {
                setFavoritos([]);
            }
        } catch (error) {
            setFavoritos([]);
        }
    };

    const alternarFavorito = async (item) => {
        if (!user || !user.id) {
            alert('Faça login para favoritar.');
            return;
        }
        try {
            const favRef = doc(db, 'favoritos', user.id);
            const favSnap = await getDoc(favRef);
            let favoritosAtuais = [];
            if (favSnap.exists()) {
                favoritosAtuais = favSnap.data().lugares || [];
            }
            let novosFavoritos = [];
            if (favoritosAtuais.includes(item.id)) {
                novosFavoritos = favoritosAtuais.filter(id => id !== item.id);
            } else {
                novosFavoritos = [...favoritosAtuais, item.id];
            }
            await setDoc(favRef, { lugares: novosFavoritos });
            setFavoritos(novosFavoritos);
            console.log('Favoritos salvos:', novosFavoritos);
        } catch (error) {
            alert('Erro ao favoritar. Tente novamente.');
            console.error('Erro ao favoritar:', error);
        }
    };

    const escolherImagem = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImagem_lugar(result.assets[0].uri);
            setImagem_local_file(result.assets[0]);
        }
    };

    const editarLugar = async () => {
        try {
            let urlImagem = imagem_lugar;
            const lugarRef = doc(db, 'pontosTuristicos', lugarSelecionado.id);
            await updateDoc(lugarRef, {
                nome: nome_lugar,
                descricao: descricao_lugar,
                latitude: latitude_lugar,
                longitude: longitude_lugar,
                imagem: urlImagem,
                user_email: user?.email || '',
            });

            setLugares(prev =>
                prev.map(l =>
                    l.id === lugarSelecionado.id
                        ? {
                            ...l,
                            nome: nome_lugar,
                            descricao: descricao_lugar,
                            latitude: latitude_lugar,
                            longitude: longitude_lugar,
                            imagem: urlImagem,
                            user_email: user?.email || '',
                        }
                        : l
                )
            );

            setNome_lugar('');
            setDescricao_Lugar('');
            setLatitude_Lugar('');
            setLongitude_lugar('');
            setImagem_lugar('');
            setImagem_local_file(null);
            setLugarSelecionado(null);
            setModalVisible_editar(false);
        } catch (error) {
            console.error('Erro ao editar lugar:', error);
        }
    };

    const abrirModalEditar = (lugar) => {
        setLugarSelecionado(lugar);
        setModalVisible_editar(true);
        setNome_lugar(lugar.nome);
        setDescricao_Lugar(lugar.descricao);
        setLatitude_Lugar(lugar.latitude ? String(lugar.latitude) : '');
        setLongitude_lugar(lugar.longitude ? String(lugar.longitude) : '');
        setImagem_lugar(lugar.imagem || '');
        setImagem_local_file(null);
    };

    const confirmarExclusao = (id) => {
        setDeleteAlertVisible(true);
        setDeleteID(id);
    };

    const excluirlocalidade = async () => {
        try {
            await deleteDoc(doc(db, 'pontosTuristicos', deleteid));
            setDeleteAlertVisible(false);
            carregarLugares();
            if (user && user.id) {
                carregarFavoritos(user.id);
            }
        } catch (error) {
            console.error('Error ao excluir Localidade', error);
        }
    };

    const lugaresFiltrados = abaFavoritos
        ? lugares.filter(l => favoritos.includes(l.id))
        : lugares;

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {item.imagem ? (
                <Image source={{ uri: item.imagem }} style={styles.imagemLocal} />
            ) : (
                <View style={styles.imagemPlaceholder}><Text>Sem imagem</Text></View>
            )}
            <Text style={styles.title}>{item.nome}</Text>
            <View style={styles.content}>
                <Text style={{ marginBottom: 8, color: '#555' }}>{item.descricao}</Text>
                <Text style={{ color: '#888' }}>Latitude: {item.latitude}</Text>
                <Text style={{ color: '#888' }}>Longitude: {item.longitude}</Text>
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
                    <TouchableOpacity onPress={() => alternarFavorito(item)}>
                        <FontAwesome
                            name={favoritos.includes(item.id) ? "star" : "star-o"}
                            size={28}
                            color="#FFD700"
                            style={{ marginLeft: 10 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    let [fontsLoaded] = useFonts({
        'Poppins-Regular': Poppins_400Regular,
        'Poppins-Bold': Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return <Text>Carregando fontes...</Text>;
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            <View style={styles.abas}>
                <TouchableOpacity
                    style={[styles.abaBotao, !abaFavoritos && styles.abaAtiva]}
                    onPress={() => setAbaFavoritos(false)}
                >
                    <Text style={styles.abaTexto}>Todos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.abaBotao, abaFavoritos && styles.abaAtiva]}
                    onPress={() => setAbaFavoritos(true)}
                >
                    <Text style={styles.abaTexto}>Favoritos</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.title_mapa}>{abaFavoritos ? "Meus Favoritos" : "Todos os Lugares"}</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#FF6B00" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={lugaresFiltrados}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.imageList}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40 }}>Nenhum lugar encontrado.</Text>}
                    showsVerticalScrollIndicator={true}
                />
            )}

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
                        <TouchableOpacity
                            style={[styles.input, { alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }]}
                            onPress={escolherImagem}
                        >
                            <FontAwesome name="image" size={20} color="#FF6B00" />
                            <Text style={{ marginLeft: 10, color: '#FF6B00', fontFamily: 'Poppins-Regular' }}>
                                {imagem_lugar ? 'Trocar Imagem' : 'Selecionar Imagem'}
                            </Text>
                        </TouchableOpacity>
                        {imagem_lugar ? (
                            <Image source={{ uri: imagem_lugar }} style={{ width: '100%', height: 120, borderRadius: 10, marginTop: 10 }} />
                        ) : null}
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

            {/* Modal de confirmação de exclusão */}
            <Modal
                visible={deleteAlertVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDeleteAlertVisible(false)}
            >
                <View style={styles.modalcontainer}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitulo}>Excluir Localização</Text>
                        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                            Você tem certeza que deseja excluir essa localização?
                        </Text>
                        <View style={styles.modalBotoes}>
                            <TouchableOpacity style={styles.botaoCancelar} onPress={() => setDeleteAlertVisible(false)}>
                                <Text style={styles.botaoTexto}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botaoSalvar} onPress={excluirlocalidade}>
                                <Text style={styles.botaoTexto}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
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
        alignSelf: 'center',
        width: '97%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    imagemLocal: {
        width: '100%',
        height: 180,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        resizeMode: 'cover',
    },
    imagemPlaceholder: {
        width: '100%',
        height: 180,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#FF6B00',
        padding: 10,
        borderBottomRightRadius: 14,
        borderBottomLeftRadius: 14,
        fontFamily: 'Poppins-Regular',
    },
    content: {
        flexDirection: 'column',
        padding: 20,
    },
    imageList: {
        paddingBottom: 100,
    },
    buttons: {
        flex: 1,
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button_mapa: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#007BFF',
        marginRight: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    button_editar: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#28A745',
        marginRight: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    button_excluir: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#DC3545',
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        marginLeft: 6,
    },
    abas: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    abaBotao: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 20,
        backgroundColor: '#ddd',
        marginHorizontal: 8,
    },
    abaAtiva: {
        backgroundColor: '#FF6B00',
    },
    abaTexto: {
        color: '#333',
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
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
        marginRight: 10,
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