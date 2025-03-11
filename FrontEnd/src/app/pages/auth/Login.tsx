import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { borderRadius, colors, margin, padding } from "../../../globalCSS";
import { AuthContext } from "@/src/contexts/AuthContext";
import KeyboardAvoidingContainer from "@/src/app/components/KeyboardAvoidingContainer/KeyboardAvoidingContainer";

export default function Login() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginHandle = async () => {
    await authContext.login(email, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingContainer formType="auth">
        <View style={styles.content}>
          <Text style={styles.title}>FamilyPlans</Text>
          
          <View style={styles.formContainer}>
            <FontAwesomeIcon icon={faUser} size={80} style={styles.icon} />
            
            <TextInput
              style={styles.input}
              onChangeText={text => setEmail(text)}
              value={email}
              placeholder="Email"
              placeholderTextColor={colors.gray}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              onChangeText={text => setPassword(text)}
              value={password}
              placeholder="Password"
              placeholderTextColor={colors.gray}
              secureTextEntry={true}
              autoCapitalize="none"
            />
            
            <TouchableOpacity onPress={loginHandle} style={styles.loginButton}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={() => router.push('/pages/auth/Register')}
          >
            <Text style={styles.buttonText}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: padding,
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    color: colors.white,
    backgroundColor: colors.darkGray,
    padding: padding,
    textAlign: 'center',
    borderRadius: borderRadius * 2,
    marginBottom: margin * 2,
  },
  formContainer: {
    backgroundColor: colors.darkGray,
    borderRadius: borderRadius * 2,
    padding: padding * 2,
    alignItems: 'center',
    marginBottom: margin,
  },
  icon: {
    color: colors.orange,
    marginBottom: margin * 2,
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: borderRadius,
    paddingHorizontal: padding,
    marginBottom: margin,
    color: colors.darkGray,
  },
  loginButton: {
    width: '100%',
    backgroundColor: colors.orange,
    padding: padding,
    borderRadius: borderRadius,
    alignItems: 'center',
    marginTop: margin,
  },
  registerButton: {
    width: '100%',
    backgroundColor: colors.gray,
    padding: padding,
    borderRadius: borderRadius,
    alignItems: 'center',
    marginTop: margin,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
