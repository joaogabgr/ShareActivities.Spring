import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faUserCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { borderRadius, colors, margin, padding } from "../../../globalCSS";
import { AuthContext } from "@/src/contexts/AuthContext";
import { api } from "@/src/api/api";
import { ErrorAlertComponent } from "../../components/Alerts/AlertComponent";

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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.textUpper}>FamilyPlans</Text>
                <View style={styles.shapping}></View>
                <FontAwesomeIcon icon={faUserPlus} size={120} style={styles.icon} />
                <TextInput
                    style={styles.inputText}
                    onChangeText={text => setName(text)}
                    value={name}
                    placeholder="Nome de usuario"
                    placeholderTextColor={colors.gray}
                />
                <TextInput
                    style={styles.inputText}
                    onChangeText={text => setEmail(text)}
                    value={email}
                    placeholder="Email"
                    placeholderTextColor={colors.gray}
                />
                <TextInput
                    style={styles.inputText}
                    onChangeText={text => setCpf(text)}
                    value={cpf}
                    placeholder="CPF"
                    placeholderTextColor={colors.gray}
                />
                <TextInput
                    style={styles.inputText}
                    onChangeText={text => setPassword(text)}
                    value={password}
                    placeholder="Password"
                    placeholderTextColor={colors.gray}
                    secureTextEntry={true}
                />
                <TextInput
                    style={styles.inputText}
                    onChangeText={text => setConfirmPassword(text)}
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    placeholderTextColor={colors.gray}
                    secureTextEntry={true}
                />
                <TouchableOpacity onPress={registerHandle} style={styles.button}>
                    <Text style={styles.textWhite}>Registrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonBottom} onPress={() => router.push('/pages/auth/Login')}>
                    <Text style={styles.textWhite}>Já tenho uma conta</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },

    textUpper: {
        fontSize: 40,
        color: colors.white,
        position: 'absolute',
        top: 60,
        backgroundColor: colors.darkGray,
        padding: padding,
        width: '90%',
        textAlign: 'center',
        borderRadius: borderRadius * 2,
    },

    shapping: {
        zIndex: -1,
        backgroundColor: colors.darkGray,
        borderRadius: borderRadius * 4,
        padding: padding,
        margin: margin,
        width: '90%',
        height: '90%',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 0,
        marginBottom: 20,
    },

    icon: {
        color: colors.orange,
        marginBottom: 20,
    },

    inputText: {
        height: 40,
        width: '80%',
        margin: 12,
        
        padding: 10,
        borderRadius: borderRadius,
        backgroundColor: colors.white,
    },

    button: {
        alignItems: "center",
        backgroundColor: colors.orange,
        padding: padding,
        borderRadius: borderRadius,
        width: '70%',
        marginTop: margin,
    },

    buttonBottom: {
        alignItems: "center",
        backgroundColor: colors.gray,
        padding: padding,
        borderRadius: borderRadius,
        width: '70%',
        marginTop: margin,
        position: 'absolute',
        bottom: 40,
    },

    textWhite: {
        color: colors.white,
        fontSize: 20,
    },
});
