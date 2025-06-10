import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../Config/FireBaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function LoginScreen({ navigation }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleCadastro = async () => {
    if (!email || !senha || !confirmarSenha || !nome) {
      alert("Erro, preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("Erro, as senhas não coincidem.");
      return;
    }

    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Atualizar perfil do Firebase Auth
      await updateProfile(user, {
        displayName: nome,

      });

      // Salvar usuário no Firestore
      await setDoc(doc(db, "users", user.uid), {
        nome: nome,
        email: email,
        photoURL: "",
        uid: user.uid,
      });

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");

      // Resetar campos
      setIsRegistering(false);
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setNome("");

    } catch (error) {
      console.error("Erro ao criar o usuário:", error.message);
      alert("Erro", error.message);
    }
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      alert("Erro, preencha todos os campos.");
      return;
    }

    try {
      // Fazer login
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Buscar informações no Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("Usuário logado:", userData);
      } else {
        console.log("Usuário logado mas não encontrado no Firestore.");
      }

      alert(`Bem-vindo, Olá, ${user.displayName || "usuário"}!`);

      // Redirecionar para a tela inicial
      navigation.navigate("Inicio");

    } catch (error) {
      console.error("Erro no login:", error.message);
      alert("Erro", error.message);
    }
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

        <Animatable.View animation="slideInUp" duration={800}>
          <TouchableOpacity
            style={styles.button}
            onPress={isRegistering ? handleCadastro : handleLogin}
          >
            <Text style={styles.buttonText}>
              {isRegistering ? "Cadastrar" : "Acessar"}
            </Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="slideInUp" delay={300} duration={800}>
          <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
            <Text style={styles.registerToggle}>
              {isRegistering ? "Voltar para o login" : "Criar uma conta"}
            </Text>
          </TouchableOpacity>
        </Animatable.View>
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
    fontSize: 22,
    marginTop: 20,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#00796b",
    width: "100%",
    borderRadius: 6,
    paddingVertical: 12,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  registerToggle: {
    color: "#1e90ff",
    marginTop: 20,
    fontSize: 20,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});