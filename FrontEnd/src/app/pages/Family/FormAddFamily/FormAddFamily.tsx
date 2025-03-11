import { links } from "@/src/api/api";
import { ErrorAlertComponent } from "@/src/app/components/Alerts/AlertComponent";
import Header from "@/src/app/components/header/Header";
import KeyboardAvoidingContainer from "@/src/app/components/KeyboardAvoidingContainer/KeyboardAvoidingContainer";
import { AuthContext } from "@/src/contexts/AuthContext";
import { borderRadius, colors, margin, padding } from "@/src/globalCSS";
import { CreateFamilyDTO } from "@/src/types/Family/CreateFamilyDTO";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function FormAddFamily() {
    const [name, setName] = useState('')
    const authContext = useContext(AuthContext)
    const router = useRouter()
    
    const handleSubmit = async () => {
        try {
            const createFamilyDTO: CreateFamilyDTO = {
                userEmail: authContext.user?.name || '',
                name: name
            }
    
            const response = await links.createFamily(createFamilyDTO)
            router.replace("/pages/Default")
        } catch {
            ErrorAlertComponent("Erro", "Erro ao tentar criar uma familia.")
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <KeyboardAvoidingContainer>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Nome da Familia</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Digite o nome da familia"
                        placeholderTextColor={colors.gray}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Salvar Atividade</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingContainer>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray,
    },
    formContainer: {
        padding: padding,
        margin: margin,
    },
    label: {
        color: colors.white,
        fontSize: 16,
        marginBottom: 8,
        fontWeight: "bold",
    },
    input: {
        backgroundColor: colors.darkGray,
        borderRadius: borderRadius,
        padding: padding,
        color: colors.white,
        marginBottom: margin,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    statusButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.darkGray,
        borderRadius: borderRadius,
        padding: padding,
        marginBottom: margin,
    },
    statusButtonText: {
        color: colors.white,
        fontSize: 16,
    },
    button: {
        backgroundColor: colors.orange,
        padding: padding,
        borderRadius: borderRadius,
        alignItems: "center",
        marginTop: margin,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "bold",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: colors.darkGray,
        borderTopLeftRadius: borderRadius * 2,
        borderTopRightRadius: borderRadius * 2,
        padding: padding,
    },
    modalTitle: {
        color: colors.white,
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: margin,
        textAlign: "center",
    },
    modalOption: {
        padding: padding,
        borderRadius: borderRadius,
        marginBottom: 8,
    },
    modalOptionSelected: {
        backgroundColor: colors.orange,
    },
    modalOptionText: {
        color: colors.white,
        fontSize: 16,
        textAlign: "center",
    },
    modalOptionTextSelected: {
        fontWeight: "bold",
    },
});
