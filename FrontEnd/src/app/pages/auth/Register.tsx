import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faIdCard, faLock, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { colors, fonts, shadows, spacing } from "../../../globalCSS";
import { AuthContext } from "@/src/contexts/AuthContext";
import { api } from "@/src/api/api";
import { ErrorAlertComponent } from "../../components/Alerts/AlertComponent";
import KeyboardAvoidingContainer from "@/src/app/components/KeyboardAvoidingContainer/KeyboardAvoidingContainer";
import { validateEmail, validatePassword, validateCPF, formatCPF, validateName } from "@/src/utils/validations";

export default function Register() {
    const router = useRouter();
    const authContext = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validação do nome
        const nameValidation = validateName(name);
        if (!nameValidation.isValid) {
            newErrors.name = nameValidation.message;
        }

        // Validação do email
        if (!validateEmail(email)) {
            newErrors.email = "Email inválido";
        }

        // Validação do CPF
        if (!validateCPF(cpf)) {
            newErrors.cpf = "CPF inválido";
        }

        // Validação da senha
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.message;
        }

        // Validação da confirmação de senha
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "As senhas não coincidem";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCPFChange = (text: string) => {
        const formattedCPF = formatCPF(text);
        setCpf(formattedCPF);
    };

    const registerHandle = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const user = {
                name,
                email,
                cpf: cpf.replace(/[^\d]/g, ''),
                password,
                role: 'USER'
            };

            await api.post('/auth/register', user);
            await authContext.login(email, password);
        } catch (error) {
            ErrorAlertComponent("Erro", "Erro ao registrar. Tente novamente.");
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
                            icon={faUserPlus} 
                            size={60} 
                            color={colors.primary} 
                        />
                        <Text style={styles.title}>Criar Conta</Text>
                        <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>
                    </View>
                    
                    <View style={[styles.formContainer, shadows.medium]}>
                        <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                            <FontAwesomeIcon icon={faUserPlus} size={20} color={colors.primary} />
                            <TextInput
                                style={styles.input}
                                onChangeText={text => {
                                    setName(text);
                                    if (errors.name) {
                                        setErrors(prev => ({ ...prev, name: '' }));
                                    }
                                }}
                                value={name}
                                placeholder="Nome de usuário"
                                placeholderTextColor={colors.disabled}
                                maxLength={50}
                            />
                        </View>
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                        
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
                        
                        <View style={[styles.inputContainer, errors.cpf && styles.inputError]}>
                            <FontAwesomeIcon icon={faIdCard} size={20} color={colors.primary} />
                            <TextInput
                                style={styles.input}
                                onChangeText={handleCPFChange}
                                value={cpf}
                                placeholder="CPF"
                                placeholderTextColor={colors.disabled}
                                keyboardType="numeric"
                                maxLength={14}
                            />
                        </View>
                        {errors.cpf && <Text style={styles.errorText}>{errors.cpf}</Text>}
                        
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
                        
                        <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                            <FontAwesomeIcon icon={faLock} size={20} color={colors.primary} />
                            <TextInput
                                style={styles.input}
                                onChangeText={text => {
                                    setConfirmPassword(text);
                                    if (errors.confirmPassword) {
                                        setErrors(prev => ({ ...prev, confirmPassword: '' }));
                                    }
                                }}
                                value={confirmPassword}
                                placeholder="Confirmar senha"
                                placeholderTextColor={colors.disabled}
                                secureTextEntry={true}
                                autoCapitalize="none"
                                maxLength={20}
                            />
                        </View>
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                        
                        <TouchableOpacity 
                            onPress={registerHandle} 
                            style={[styles.registerButton, shadows.small]}
                            activeOpacity={0.8}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={colors.textLight} />
                            ) : (
                                <Text style={styles.buttonText}>Cadastrar</Text>
                            )}
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
