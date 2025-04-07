import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Header from "../../components/header/Header";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { useRouter } from "expo-router";
import { links } from "@/src/api/api";
import { ErrorAlertComponent } from "@/src/app/components/Alerts/AlertComponent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTasksAlt,
  faTag,
  faAlignLeft,
  faFlag,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { CreateActivities } from "@/src/types/Activities/CreateActivities";
import { UpdateActivities } from "@/src/types/Activities/UpdateActivities";
import { AuthContext } from "@/src/contexts/AuthContext";
import KeyboardAvoidingContainer from "@/src/app/components/KeyboardAvoidingContainer/KeyboardAvoidingContainer";
import DatePicker from "../DatePicker/DatePicker";
import StatusPicker from "../StatusPicker/StatusPicker";
import PriorityPicker from "../PriorityPicker/PriorityPicker";
import FormField from "../FormField/FormField";

interface ActivityFormProps {
  mode: "create" | "edit";
  activityData?: any; // Dados da atividade para edição
  onSuccess?: () => void;
}

export default function ActivityForm({ mode, activityData, onSuccess }: ActivityFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [dateCreate, setDateCreate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<string>("MEDIUM");
  const [daysForRecover, setDaysForRecover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [activity, setActivity] = useState<any>(null);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (mode === "edit" && activityData) {
      try {
        setActivity(activityData);
        setTitle(activityData.name || "");
        setDescription(activityData.description || "");
        setStatus(activityData.status || "PENDING");
        setDateCreate(activityData.date ? new Date(activityData.date) : undefined);
        setNotes(activityData.notes || "");
        setLocation(activityData.location || "");
        
        // Configurar tipo se existir
        if (activityData.type) {
          setType(activityData.type);
        }
        
        // Configurar data de expiração se existir
        if (activityData.dateExpire) {
          const expireDate = new Date(activityData.dateExpire);
          // Ajusta o fuso horário
          expireDate.setHours(expireDate.getHours() - 3);
          setExpirationDate(expireDate);
        }

        // Configurar dias para recuperar se existir
        if (activityData.dayForRecover) {
          const dayForRecoverDate = new Date(activityData.dayForRecover).getTime();
          const activityDate = new Date(activityData.date).getTime();
          setDaysForRecover(Math.ceil((dayForRecoverDate - activityDate) / (1000 * 60 * 60 * 24)));
        }
        
        // Configurar prioridade se existir
        if (activityData.priority) {
          setPriority(activityData.priority);
        }
      } catch (error) {
        console.error("Erro ao processar dados da atividade:", error);
        ErrorAlertComponent(
          "Erro",
          "Não foi possível carregar os dados da atividade."
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [mode, activityData]);

  const validateForm = () => {
    // Validação mais específica dos campos obrigatórios
    if (!title.trim()) {
      ErrorAlertComponent(
        "Campo obrigatório",
        "Por favor, preencha o nome da atividade."
      );
      return false;
    }

    if (!description.trim()) {
      ErrorAlertComponent(
        "Campo obrigatório",
        "Por favor, preencha a descrição da atividade."
      );
      return false;
    }

    if (!type.trim()) {
      ErrorAlertComponent(
        "Campo obrigatório",
        "Por favor, preencha o tipo da atividade."
      );
      return false;
    }

    // Validação de tamanho mínimo
    if (title.trim().length < 3) {
      ErrorAlertComponent(
        "Nome muito curto",
        "O nome da atividade deve ter pelo menos 3 caracteres."
      );
      return false;
    }

    if (description.trim().length < 10) {
      ErrorAlertComponent(
        "Descrição muito curta",
        "A descrição da atividade deve ter pelo menos 10 caracteres."
      );
      return false;
    }

    // Validação de dias para recuperar
    if (daysForRecover < 0) {
      ErrorAlertComponent(
        "Valor inválido",
        "Os dias para recuperar não podem ser negativos."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Se tiver data de expiração, ajusta para o final do dia
    let formattedDate = null;
    if (expirationDate) {
      formattedDate = new Date(expirationDate);
      formattedDate.setHours(23, 59, 59, 999);
    }

    try {
      if (mode === "create") {
        // Criar nova atividade
        const newActivity: CreateActivities = {
          name: title,
          description: description,
          status: status,
          userId: authContext.user?.name || "",
          type: type,
          dateExpire: formattedDate ? formattedDate.toISOString() : null,
          priority: priority,
          daysForRecover: daysForRecover,
          familyId: "",
          notes: notes,
          location: location,
        };

        await links.createActivity(newActivity);
      } else if (mode === "edit" && activity) {
        // Atualizar atividade existente
        const formatedDateCreated = dateCreate ? new Date(dateCreate) : null;

        const updateActivity: UpdateActivities = {
          id: activity.id,
          name: title,
          description: description,
          status: status,
          userId: authContext.user?.name || "",
          type: type,
          dateExpire: formattedDate ? formattedDate.toISOString() : "",
          dateCreated: formatedDateCreated ? formatedDateCreated.toISOString() : "",
          priority: priority,
          daysForRecover: daysForRecover,
          familyId: "",
          notes: notes,
          location: location,
        };

        await links.updateActivity(updateActivity);
      }

      // Redirecionar para a lista de atividades com parâmetro de atualização
      if (onSuccess) {
        onSuccess();
      } else {
        router.push({
          pathname: "/pages/tabs/ToDo/ToDo",
          params: { refresh: Date.now().toString() },
        });
      }
    } catch (error) {
      const errorMessage = mode === "create" 
        ? "Não foi possível criar a atividade. Tente novamente mais tarde."
        : "Ocorreu um erro ao atualizar a atividade. Tente novamente.";
      
      ErrorAlertComponent(
        `Erro ao ${mode === "create" ? "criar" : "atualizar"} atividade`,
        errorMessage
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando atividade...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <KeyboardAvoidingContainer>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>
              {mode === "create" ? "Nova Atividade" : "Editar Atividade"}
            </Text>

            <View style={[styles.formContainer, shadows.medium]}>
              {/* Nome da atividade */}
              <FormField
                label="Nome da atividade"
                value={title}
                onChangeText={setTitle}
                placeholder="Digite o nome da atividade"
                icon={faTasksAlt}
                required
              />

              {/* Descrição */}
              <FormField
                label="Descrição"
                value={description}
                onChangeText={setDescription}
                placeholder="Digite a descrição da atividade"
                icon={faAlignLeft}
                required
              />

              {/* Tipo */}
              <FormField
                label="Tipo"
                value={type}
                onChangeText={setType}
                placeholder="Digite o tipo da atividade"
                icon={faTag}
                required
              />

              {/* NOTAS */}
              <FormField
                label="Notas"
                value={notes}
                onChangeText={setNotes}
                placeholder="Digite notas ou links relacionados à atividade"
                icon={faAlignLeft}
                isLinksField={true}
              />

              {/* Endereço */}
              <FormField
                label="Endereço"
                value={location}
                onChangeText={setLocation}
                placeholder="Digite o endereço aonde a atividade será realizada"
                icon={faTag}
              />

              {/* Dias para recuperar */}
              <FormField
                label="Dias para recuperar"
                value={daysForRecover.toString()}
                onChangeText={(text) => setDaysForRecover(Number(text.replace(/[^0-9]/g, "")))}
                placeholder="Digite a quantidade de dias para recuperar"
                icon={faFlag}
                keyboardType="numeric"
              />

              {/* Status */}
              <StatusPicker
                status={status}
                onStatusChange={setStatus}
              />

              {/* Prioridade */}
              <PriorityPicker
                priority={priority}
                onPriorityChange={setPriority}
              />

              {/* Data de expiração */}
              <DatePicker
                date={expirationDate}
                onDateChange={setExpirationDate}
                label="Data de expiração"
              />

              {/* Botões */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.cancelButton, shadows.small]}
                  onPress={() => router.back()}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, shadows.small]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={colors.textLight} />
                  ) : (
                    <>
                      {mode === "edit" && (
                        <FontAwesomeIcon 
                          icon={faSave} 
                          size={18} 
                          color={colors.textLight} 
                          style={styles.submitButtonIcon} 
                        />
                      )}
                      <Text style={styles.submitButtonText}>
                        {mode === "create" ? "Criar Atividade" : "Salvar Alterações"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
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
  },
  loadingText: {
    marginTop: spacing.medium,
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  content: {
    padding: spacing.medium,
  },
  title: {
    fontSize: fonts.size.xxl,
    fontWeight: fonts.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.large,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.large,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.large,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    padding: spacing.medium,
    alignItems: "center",
    marginRight: spacing.small,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.medium,
    alignItems: "center",
    marginLeft: spacing.small,
    flexDirection: "row",
    justifyContent: "center",
  },
  submitButtonText: {
    color: colors.textLight,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
  },
  submitButtonIcon: {
    marginRight: spacing.xs,
  },
});