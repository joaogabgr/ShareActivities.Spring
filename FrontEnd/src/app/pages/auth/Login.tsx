import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { colors, fonts, shadows, spacing } from "../../../globalCSS";
import { AuthContext } from "@/src/contexts/AuthContext";
import KeyboardAvoidingContainer from "@/src/app/components/KeyboardAvoidingContainer/KeyboardAvoidingContainer";
import { validateEmail } from "@/src/utils/validations";
import { ErrorAlertComponent } from "@/src/app/components/Alerts/AlertComponent";

export default function Login() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateEmail(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginHandle = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await authContext.login(email, password);
    } catch (error) {
      ErrorAlertComponent("Erro", "Email ou senha inválidos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingContainer formType="auth">
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <FontAwesomeIcon 
              icon={faUser} 
              size={60} 
              color={colors.primary} 
            />
            <Text style={styles.title}>Share Activities</Text>
            <Text style={styles.subtitle}>Faça login para continuar</Text>
          </View>
          
          <View style={[styles.formContainer, shadows.medium]}>
            <View style={[styles.inputContainer, errors.email && styles.inputError]}>
              <FontAwesomeIcon icon={faEnvelope} size={20} color={colors.primary} />
              <TextInput
                style={styles.input}
                onChangeText={text => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                value={email}
                placeholder="Email"
                placeholderTextColor={colors.disabled}
                autoCapitalize="none"
                keyboardType="email-address"
                maxLength={100}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            
            <View style={[styles.inputContainer, errors.password && styles.inputError]}>
              <FontAwesomeIcon icon={faLock} size={20} color={colors.primary} />
              <TextInput
                style={styles.input}
                onChangeText={text => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
                value={password}
                placeholder="Senha"
                placeholderTextColor={colors.disabled}
                secureTextEntry={true}
                autoCapitalize="none"
                maxLength={20}
              />
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            
            <TouchableOpacity 
              onPress={loginHandle} 
              style={[styles.loginButton, shadows.small]}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textLight} />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem uma conta?</Text>
            <TouchableOpacity 
              onPress={() => router.push('/pages/auth/Register')}
            >
              <Text style={styles.registerText}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.large,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fonts.size.xxxl,
    fontWeight: fonts.weight.bold,
    color: colors.primary,
    marginTop: spacing.medium,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
    marginBottom: spacing.large,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.large,
    marginBottom: spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    paddingHorizontal: spacing.medium,
    marginBottom: spacing.medium,
    height: 56,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: spacing.medium,
    fontSize: fonts.size.medium,
    color: colors.textPrimary,
  },
  loginButton: {
    backgroundColor: colors.primary,
    padding: spacing.medium,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.medium,
    height: 56,
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.textLight,
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semiBold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.large,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: fonts.size.medium,
  },
  registerText: {
    color: colors.primary,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
    marginLeft: spacing.small,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: fonts.size.small,
    marginTop: -spacing.small,
    marginBottom: spacing.small,
    marginLeft: spacing.small,
  },
});
