import React, { useContext, useEffect, useState } from "react";
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
  Alert,
} from "react-native";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { Family } from "@/src/types/Family/Family";
import { links } from "@/src/api/api";
import { ErrorAlertComponent, SuccessAlertComponent } from "@/src/app/components/Alerts/AlertComponent";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faUserPlus, faTrash, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "@/src/contexts/AuthContext";

export default function EditFamily() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [family, setFamily] = useState<Family | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (id) {
      fetchFamilyDetails();
    } else {
      ErrorAlertComponent("Erro", "Identificador do grupo não encontrado");
      router.back();
    }
  }, [id]);

  const fetchFamilyDetails = async () => {
    try {
      setLoading(true);
      const userEmail = authContext.user?.name;
      if (!userEmail) {
        ErrorAlertComponent("Erro", "Usuário não autenticado");
        router.dismissAll();
        router.replace({
          pathname: "/pages/tabs/MyFamily/MyFamily"
        });
        return;
      }

      // Buscar lista de famílias
      const familiesResponse = await links.getListFamilies(userEmail);
      const families = familiesResponse.data.model;
      
      const foundFamily = families.find((f: any) => f.family.id === id);
      if (!foundFamily) {
        throw new Error("Grupo não encontrado");
      }
      
      if (!foundFamily.isAdmin) {
        ErrorAlertComponent("Acesso negado", "Você não tem permissão para editar este grupo");
        router.dismissAll();
        router.replace({
          pathname: "/pages/tabs/MyFamily/MyFamily"
        });
        return;
      }

      // Criar objeto Family no formato que o componente espera
      const familyObj: Family = {
        id: foundFamily.family.id,
        name: foundFamily.family.name,
        description: foundFamily.family.description || "",
        isOwner: foundFamily.isAdmin
      };

      setFamily(familyObj);
      setName(familyObj.name);
      setDescription(familyObj.description || "");
    } catch (error) {
      console.error("Erro ao buscar detalhes do grupo:", error);
      ErrorAlertComponent("Erro", "Não foi possível carregar os detalhes do grupo");
      router.dismissAll();
      router.replace({
        pathname: "/pages/tabs/MyFamily/MyFamily"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      ErrorAlertComponent("Campo obrigatório", "O nome do grupo é obrigatório.");
      return;
    }

    try {
      setSaving(true);
      await links.updateFamily({
        id: id as string,
        name: name.trim(),
        description: description.trim() || undefined,
      });

      SuccessAlertComponent(
        "Grupo atualizado",
        "As alterações foram salvas com sucesso!"
      );

      // Usar replace para garantir que o parâmetro chegue corretamente
      router.dismissAll();
      router.replace({
        pathname: "/pages/tabs/MyFamily/MyFamily",
        params: { updated: "true" }
      });
      
      // Depois de 1 segundo, redefinir o parâmetro para false
      setTimeout(() => {
        router.setParams({ updated: "false" });
      }, 1000);
    } catch (error) {
      console.error("Erro ao atualizar grupo:", error);
      ErrorAlertComponent("Erro", "Não foi possível atualizar o grupo. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Excluir Grupo",
      "Tem certeza que deseja excluir este grupo? Esta ação não poderá ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      setSaving(true);
      await links.deleteFamily(id as string);
      
      SuccessAlertComponent(
        "Grupo excluído",
        "O grupo foi excluído com sucesso!"
      );
      
      // Usar replace para garantir que o parâmetro chegue corretamente
      router.dismissAll();
      router.replace({
        pathname: "/pages/tabs/MyFamily/MyFamily",
        params: { updated: "true" }
      });
      
      // Depois de 1 segundo, redefinir o parâmetro para false
      setTimeout(() => {
        router.setParams({ updated: "false" });
      }, 1000);
    } catch (error) {
      setSaving(false);
    }
  };

  const navigateToMembers = () => {
    router.push({
      pathname: "/pages/Families/Members",
      params: { id, refresh: "false" }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando dados do grupo...</Text>
      </View>
    );
  }

  return (
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
          <Text style={styles.headerTitle}>Editar Grupo</Text>
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

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, !name.trim() && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={!name.trim() || saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color={colors.textLight} />
              ) : (
                <Text style={styles.buttonText}>Salvar Alterações</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={saving}
            >
              <FontAwesomeIcon icon={faTrash} size={18} color={colors.textLight} />
              <Text style={styles.buttonText}>Excluir Grupo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.medium,
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
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
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.medium,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.large,
  },
  actionButtonText: {
    color: colors.textLight,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold as any,
    marginLeft: spacing.small,
  },
  buttonContainer: {
    marginTop: spacing.medium,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.medium,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.medium,
  },
  deleteButton: {
    backgroundColor: colors.error,
    borderRadius: 8,
    padding: spacing.medium,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold as any,
    marginLeft: spacing.small,
  },
}); 