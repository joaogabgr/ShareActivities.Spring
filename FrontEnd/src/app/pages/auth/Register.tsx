import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faIdCard, faLock, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { colors, fonts, shadows, spacing } from "../../../globalCSS";
import { AuthContext } from "@/src/contexts/AuthContext";
import { api } from "@/src/api/api";
import { ErrorAlertComponent } from "../../components/Alerts/AlertComponent";
import KeyboardAvoidingContainer from "@/src/app/components/KeyboardAvoidingContainer/KeyboardAvoidingContainer";

export default function Register() {
    const router = useRouter();
    const authContext = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const registerHandle = async () => {
        if (password !== confirmPassword) {
            ErrorAlertComponent("Erro", "As senhas não coincidem");
            return;
        }

        const user = {
            name,
            email,
            cpf,
            password,
            role: 'USER'
        };

        try {
            await api.post('/auth/register', user);
            await authContext.login(email, password);
        } catch (error) {
            ErrorAlertComponent("Erro", "Erro ao registrar");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingContainer formType="auth">
                <View style={styles.content}>
                    <View style={styles.logoContainer}>
                        <FontAwesomeIcon 
                            icon={faUserPlus} 
                            size={60} 
                            color={colors.primary} 
                        />
                        <Text style={styles.title}>Criar Conta</Text>
                        <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>
                    </View>
                    
                    <View style={[styles.formContainer, shadows.medium]}>
                        <View style={styles.inputContainer}>
                            <FontAwesomeIcon icon={faUserPlus} size={20} color={colors.primary} />
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setName(text)}
                                value={name}
                                placeholder="Nome de usuário"
                                placeholderTextColor={colors.disabled}
                            />
                        </View>
                        
                        <View style={styles.inputContainer}>
                            <FontAwesomeIcon icon={faEnvelope} size={20} color={colors.primary} />
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setEmail(text)}
                                value={email}
                                placeholder="Email"
                                placeholderTextColor={colors.disabled}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                        
                        <View style={styles.inputContainer}>
                            <FontAwesomeIcon icon={faIdCard} size={20} color={colors.primary} />
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setCpf(text)}
                                value={cpf}
                                placeholder="CPF"
                                placeholderTextColor={colors.disabled}
                                keyboardType="numeric"
                            />
                        </View>
                        
                        <View style={styles.inputContainer}>
                            <FontAwesomeIcon icon={faLock} size={20} color={colors.primary} />
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setPassword(text)}
                                value={password}
                                placeholder="Senha"
                                placeholderTextColor={colors.disabled}
                                secureTextEntry={true}
                                autoCapitalize="none"
                            />
                        </View>
                        
                        <View style={styles.inputContainer}>
                            <FontAwesomeIcon icon={faLock} size={20} color={colors.primary} />
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setConfirmPassword(text)}
                                value={confirmPassword}
                                placeholder="Confirmar senha"
                                placeholderTextColor={colors.disabled}
                                secureTextEntry={true}
                                autoCapitalize="none"
                            />
                        </View>
                        
                        <TouchableOpacity 
                            onPress={registerHandle} 
                            style={[styles.registerButton, shadows.small]}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>Cadastrar</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Já tem uma conta?</Text>
                        <TouchableOpacity 
                            onPress={() => router.push('/pages/auth/Login')}
                        >
                            <Text style={styles.loginText}>Entrar</Text>
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
    registerButton: {
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
    loginText: {
        color: colors.primary,
        fontSize: fonts.size.medium,
        fontWeight: fonts.weight.semiBold,
        marginLeft: spacing.small,
    },
});
