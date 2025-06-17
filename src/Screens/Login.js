import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { supabase } from "../Config/SupaBaseConfig";

export default function LoginScreen({ navigation }) {
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
      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: { nome }
        }
      });

      if (error) throw error;

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");

      setIsRegistering(false);
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setNome("");
    } catch (error) {
      console.error("Erro ao criar o usuário:", error.message);
      Alert.alert("Erro", error.message);
    }
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) throw error;

      const nomeUsuario = data.user.user_metadata?.nome || data.user.email;

      Alert.alert("Bem-vindo", `Olá, ${nomeUsuario}!`);
      navigation.navigate("Inicio");
    } catch (error) {
      console.error("Erro no login:", error.message);
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#242424" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
            <Text style={styles.message}>{isRegistering ? "Cadastro" : "Login"}</Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" style={styles.containerForm}>
            <Image
              source={require("../../src/assets/img/2-removebg-preview.png")}
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

            {!isRegistering && (
              <Animatable.View animation="slideInUp" delay={300} duration={800}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setIsRegistering(true)}
                >
                  <Text style={styles.buttonText}>Criar uma conta</Text>
                </TouchableOpacity>
              </Animatable.View>
            )}

            {isRegistering && (
              <Animatable.View animation="slideInUp" delay={300} duration={800}>
                <TouchableOpacity onPress={() => setIsRegistering(false)}>
                  <Text style={styles.registerToggle}>Voltar para o login</Text>
                </TouchableOpacity>
              </Animatable.View>
            )}
          </Animatable.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    height: 50,
    marginBottom: 12,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#FF6B00",
    width: "100%",
    borderRadius: 30,
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
    backgroundColor: "#FF6B00",
    width: "100%",
    borderRadius: 30,
    paddingVertical: 12,
    marginTop: 20,
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 40,
  },
});