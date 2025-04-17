import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../Config/FireBaseConfig";

export default function LoginScreen() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleCadastro = async () => {
    if (!email || !senha || !confirmarSenha || !nome) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Atualizar perfil no Authentication
      await updateProfile(user, {
        displayName: nome,
        photoURL: "https://i.imgur.com/5RHR6Ku.png", // imagem padrão
      });

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");

      // Limpar campos
      setIsRegistering(false);
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setNome("");
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  const handleLogin = () => {
    console.log("Logando com:", email, senha);
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>{isRegistering ? "Cadastro" : "Login"}</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Image
          source={require("../../src/assets/img/Worldly__1_-removebg-preview.png")}
          style={styles.formImage}
          resizeMode="contain"
        />

        {isRegistering && (
          <>
            <Text style={styles.title}>Nome</Text>
            <TextInput
              placeholder="Digite seu nome"
              style={styles.input}
              value={nome}
              onChangeText={setNome}
            />
          </>
        )}

        <Text style={styles.title}>Email</Text>
        <TextInput
          placeholder="Digite seu email"
          style={styles.input}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.title}>Senha</Text>
        <TextInput
          placeholder="Digite sua senha"
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          value={senha}
          onChangeText={setSenha}
        />

        {isRegistering && (
          <>
            <Text style={styles.title}>Confirmar Senha</Text>
            <TextInput
              placeholder="Confirme sua senha"
              style={styles.input}
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
          </>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={isRegistering ? handleCadastro : handleLogin}
        >
          <Text style={styles.buttonText}>
            {isRegistering ? "Cadastrar" : "Acessar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
          <Text style={styles.registerToggle}>
            {isRegistering ? "Voltar para o login" : "Criar uma conta"}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
  },
  containerHeader: {
    marginTop: "14%",
    marginBottom: "8%",
    paddingStart: "5%",
  },
  message: {
    fontSize: 50,
    color: "#fff",
    fontWeight: "bold",
  },
  containerForm: {
    backgroundColor: "#eeeeee",
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: "5%",
  },
  formImage: {
    width: 200,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
    opacity: 1,
  },
  title: {
    fontSize: 20,
    marginTop: 20,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1e90ff",
    width: "100%",
    borderRadius: 4,
    paddingVertical: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerToggle: {
    marginTop: 20,
    color: "#1e90ff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
