import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { links } from "@/src/api/api";
import { ErrorAlertComponent, SuccessAlertComponent } from "@/src/app/components/Alerts/AlertComponent";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "@/src/contexts/AuthContext";


export default function CreateFamily() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(""); 
  const [description, setDescription] = useState("");
  const router = useRouter();
  const authContext = useContext(AuthContext);

  const handleBack = () => {
    router.back();
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      ErrorAlertComponent("Campo obrigatório", "O nome do grupo é obrigatório.");
      return;
    }

    try {
      setLoading(true);
      const userEmail = authContext.user?.name;
      
      if (!userEmail) {
        ErrorAlertComponent("Erro", "Usuário não autenticado. Faça login novamente.");
        router.dismissAll();
        router.replace("/pages/auth/Login");
        return;
      }

      await links.createFamily({
        userEmail,
        name: name.trim(),
        description: description.trim() || undefined
      });

      SuccessAlertComponent(
        "Grupo criado",
        "Seu grupo foi criado com sucesso!"
      );

      router.dismissAll();
      router.replace({
        pathname: "/pages/tabs/MyFamily/MyFamily",
        params: { updated: "true" }
      });
      
      setTimeout(() => {
        router.setParams({ updated: "false" });
      }, 1000);
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
      ErrorAlertComponent("Erro", "Não foi possível criar o grupo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Criar Grupo</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome do Grupo*</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do grupo"
              value={name}
              onChangeText={setName}
              maxLength={50}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descrição (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Digite uma descrição para o grupo"
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={200}
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>
              {description.length}/200
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, !name.trim() && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={!name.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.textLight} />
            ) : (
              <Text style={styles.buttonText}>Criar Grupo</Text>
            )}
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: spacing.medium,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.large,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold as any,
    color: colors.textPrimary,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.large,
    ...shadows.small,
  },
  inputContainer: {
    marginBottom: spacing.large,
  },
  label: {
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.medium as any,
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.medium,
    fontSize: fonts.size.medium,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  characterCount: {
    alignSelf: "flex-end",
    fontSize: fonts.size.xs,
    color: colors.textSecondary,
    marginTop: spacing.small,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.medium,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.medium,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold as any,
  },
}); 