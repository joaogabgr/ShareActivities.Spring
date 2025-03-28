import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import Header from "../../../components/header/Header";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { useRouter, useLocalSearchParams } from "expo-router";
import { links } from "@/src/api/api";
import { ErrorAlertComponent } from "@/src/app/components/Alerts/AlertComponent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { 
  faChevronDown, 
  faCalendarAlt, 
  faTasksAlt, 
  faListCheck, 
  faTag, 
  faAlignLeft, 
  faSave,
  faFlag
} from "@fortawesome/free-solid-svg-icons";
import { UpdateActivities } from "@/src/types/Activities/UpdateActivities";
import { AuthContext } from "@/src/contexts/AuthContext";
import { ActivitiesStatus } from "@/src/app/enum/ActivitiesStatus";
import KeyboardAvoidingContainer from "@/src/app/components/KeyboardAvoidingContainer/KeyboardAvoidingContainer";

const STATUS_OPTIONS = [
  { label: "Pendente", value: "PENDING" },
  { label: "Em Progresso", value: "IN_PROGRESS" },
  { label: "Concluído", value: "DONE" },
] as const;

const PRIORITY_OPTIONS = [
  { label: "Alta", value: "HIGH" },
  { label: "Média", value: "MEDIUM" },
  { label: "Baixa", value: "LOW" },
] as const;

// Meses em português para o seletor de data
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function FormEditActivities() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activity, setActivity] = useState<UpdateActivities | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");
  const [daysForRecover, setDaysForRecover] = useState(0);
  const [status, setStatus] = useState<ActivitiesStatus>(ActivitiesStatus.PENDING);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (params.activity) {
      try {
        const parsedActivity = JSON.parse(params.activity as string);
        setActivity(parsedActivity);
        setTitle(parsedActivity.name);
        setDescription(parsedActivity.description);
        setStatus(parsedActivity.status);
        
        // Configurar tipo se existir
        if (parsedActivity.type) {
          setType(parsedActivity.type);
        }
        
        // Configurar data de expiração se existir
        if (parsedActivity.dateExpire) {
          const expireDate = new Date(parsedActivity.dateExpire);
          // Ajusta o fuso horário
          expireDate.setHours(expireDate.getHours() - 3);
          setExpirationDate(expireDate);
          setTempDate(expireDate);
        }
        
        // Configurar prioridade se existir
        if (parsedActivity.priority) {
          setPriority(parsedActivity.priority);
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
  }, [params.activity]);

  const handleSubmit = async () => {
    if (!activity) {
      ErrorAlertComponent(
        "Erro",
        "Não foi possível encontrar os dados da atividade."
      );
      return;
    }

    // Validação mais específica dos campos obrigatórios
    if (!title.trim()) {
      ErrorAlertComponent(
        "Campo obrigatório",
        "Por favor, preencha o nome da atividade."
      );
      return;
    }

    if (!description.trim()) {
      ErrorAlertComponent(
        "Campo obrigatório",
        "Por favor, preencha a descrição da atividade."
      );
      return;
    }

    if (!type.trim()) {
      ErrorAlertComponent(
        "Campo obrigatório",
        "Por favor, preencha o tipo da atividade."
      );
      return;
    }

    // Validação de tamanho mínimo
    if (title.trim().length < 3) {
      ErrorAlertComponent(
        "Nome muito curto",
        "O nome da atividade deve ter pelo menos 3 caracteres."
      );
      return;
    }

    if (description.trim().length < 10) {
      ErrorAlertComponent(
        "Descrição muito curta",
        "A descrição da atividade deve ter pelo menos 10 caracteres."
      );
      return;
    }

    // Validação de dias para recuperar
    if (daysForRecover < 0) {
      ErrorAlertComponent(
        "Valor inválido",
        "Os dias para recuperar não podem ser negativos."
      );
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
      const updateActivity: UpdateActivities = {
        id: activity.id,
        name: title,
        description: description,
        status: status,
        userId: authContext.user?.name || "",
        type: type,
        dateExpire: formattedDate ? formattedDate.toISOString() : null,
        priority: priority,
        daysForRecover: daysForRecover,
        familyId: ""
      };

      await links.updateActivity(updateActivity);
      router.push({
        pathname: "/pages/tabs/ToDo/ToDo",
        params: { refresh: Date.now().toString() }
      });
    } catch (error) {
      console.error("Erro ao atualizar atividade:", error);
      ErrorAlertComponent(
        "Erro ao atualizar atividade",
        "Ocorreu um erro ao atualizar a atividade. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDatePicker = () => {
    const today = new Date();
    if (!expirationDate || expirationDate < today) {
      setTempDate(today);
    } else {
      setTempDate(expirationDate);
    }
    setShowDateModal(true);
  };

  const confirmDate = () => {
    setExpirationDate(tempDate);
    setShowDateModal(false);
  };

  const cancelDateSelection = () => {
    setShowDateModal(false);
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "Selecione uma data";
    return `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const generateDays = (month: number, year: number) => {
    // Pega o último dia do mês
    const lastDay = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const days = [];
    
    // Se for o mês e ano atual, começa do dia atual
    // Se for um mês/ano anterior, não mostra nenhum dia
    // Se for um mês/ano futuro, mostra todos os dias
    if (year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth())) {
      return [];
    }
    
    const startDay = (year === today.getFullYear() && month === today.getMonth()) 
      ? today.getDate() 
      : 1;
      
    for (let i = startDay; i <= lastDay; i++) {
      days.push(i);
    }
    return days;
  };

  const generateAvailableMonths = (year: number) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    // Se for o ano atual, só mostra os meses a partir do mês atual
    if (year === currentYear) {
      return MONTHS.slice(currentMonth);
    }
    // Se for um ano futuro, mostra todos os meses
    return MONTHS;
  };

  const getStatusLabel = (value: string) => {
    const option = STATUS_OPTIONS.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const getPriorityLabel = (value: string) => {
    const option = PRIORITY_OPTIONS.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const getPriorityColor = (value: string) => {
    switch (value) {
      case "HIGH":
        return colors.priorityHigh;
      case "MEDIUM":
        return colors.priorityMedium;
      case "LOW":
        return colors.priorityLow;
      default:
        return colors.disabled;
    }
  };

  const getStatusColor = (value: string) => {
    switch (value) {
      case "PENDING":
        return colors.statusPending;
      case "IN_PROGRESS":
        return colors.statusInProgress;
      case "DONE":
        return colors.statusDone;
      default:
        return colors.disabled;
    }
  };

  const handleTitleChange = (text: string) => {
    if (text.length <= 255) {
      setTitle(text);
    }
  };

  const handleDescriptionChange = (text: string) => {
    if (text.length <= 255) {
      setDescription(text);
    }
  };

  const handleTypeChange = (text: string) => {
    if (text.length <= 255) {
      setType(text);
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
            <Text style={styles.title}>Editar Atividade</Text>

            <View style={[styles.formContainer, shadows.medium]}>
              {/* Nome da atividade */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nome da atividade *</Text>
                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faTasksAlt} size={20} color={colors.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Digite o nome da atividade"
                    value={title}
                    onChangeText={handleTitleChange}
                    placeholderTextColor={colors.disabled}
                  />
                </View>
                <Text style={styles.characterCount}>{title.length}/255</Text>
              </View>

              {/* Descrição */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Descrição *</Text>
                <View style={styles.textareaContainer}>
                  <FontAwesomeIcon icon={faAlignLeft} size={20} color={colors.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textarea}
                    placeholder="Digite a descrição da atividade"
                    value={description}
                    onChangeText={handleDescriptionChange}
                    multiline
                    numberOfLines={4}
                    placeholderTextColor={colors.disabled}
                  />
                </View>
                <Text style={styles.characterCount}>{description.length}/255</Text>
              </View>

              {/* Tipo */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tipo *</Text>
                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faTag} size={20} color={colors.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Digite o tipo da atividade"
                    value={type}
                    onChangeText={handleTypeChange}
                    placeholderTextColor={colors.disabled}
                  />
                </View>
                <Text style={styles.characterCount}>{type.length}/255</Text>
              </View>

              {/* Dias para recuperar */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Dias para recuperar</Text>
                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faFlag} size={20} color={colors.primary} style={styles.inputIcon} />
                  <TextInput
                  style={styles.input}
                  placeholder="Digite a quantidade de dias para recuperar"
                  value={daysForRecover.toString()}
                  onChangeText={(text) => setDaysForRecover(Number(text.replace(/[^0-9]/g, '')))}
                  keyboardType="numeric"
                  placeholderTextColor={colors.disabled}
                  />
                </View>
              </View>

              {/* Status */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Status</Text>
                <TouchableOpacity
                  style={styles.selectContainer}
                  onPress={() => setShowStatusModal(true)}
                >
                  <FontAwesomeIcon icon={faListCheck} size={20} color={colors.primary} style={styles.inputIcon} />
                  <View style={styles.selectTextContainer}>
                    <Text style={styles.selectText}>{getStatusLabel(status)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
                    <Text style={styles.statusBadgeText}>{getStatusLabel(status)}</Text>
                  </View>
                  <FontAwesomeIcon icon={faChevronDown} size={16} color={colors.disabled} />
                </TouchableOpacity>
              </View>

              {/* Prioridade */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Prioridade</Text>
                <TouchableOpacity
                  style={styles.selectContainer}
                  onPress={() => setShowPriorityModal(true)}
                >
                  <FontAwesomeIcon icon={faListCheck} size={20} color={colors.primary} style={styles.inputIcon} />
                  <View style={styles.selectTextContainer}>
                    <Text style={styles.selectText}>{getPriorityLabel(priority)}</Text>
                  </View>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(priority) }]}>
                    <Text style={styles.priorityBadgeText}>{getPriorityLabel(priority)}</Text>
                  </View>
                  <FontAwesomeIcon icon={faChevronDown} size={16} color={colors.disabled} />
                </TouchableOpacity>
              </View>

              {/* Data de expiração */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Data de expiração</Text>
                <TouchableOpacity
                  style={styles.selectContainer}
                  onPress={openDatePicker}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} size={20} color={colors.primary} style={styles.inputIcon} />
                  <Text style={styles.selectText}>{formatDisplayDate(expirationDate)}</Text>
                  <FontAwesomeIcon icon={faChevronDown} size={16} color={colors.disabled} />
                </TouchableOpacity>
              </View>

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
                      <FontAwesomeIcon icon={faSave} size={18} color={colors.textLight} style={styles.submitButtonIcon} />
                      <Text style={styles.submitButtonText}>Salvar Alterações</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingContainer>

      {/* Modal para seleção de status */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showStatusModal}
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, shadows.large]}>
            <Text style={styles.modalTitle}>Selecione o Status</Text>
            
            <View style={styles.optionsList}>
              {STATUS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    status === option.value as ActivitiesStatus && styles.optionItemSelected,
                  ]}
                  onPress={() => {
                    setStatus(option.value as ActivitiesStatus);
                    setShowStatusModal(false);
                  }}
                >
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(option.value) }]}>
                    <Text style={styles.statusBadgeText}>{option.label}</Text>
                  </View>
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowStatusModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para seleção de prioridade */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPriorityModal}
        onRequestClose={() => setShowPriorityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, shadows.large]}>
            <Text style={styles.modalTitle}>Selecione a Prioridade</Text>
            
            <View style={styles.optionsList}>
              {PRIORITY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    priority === option.value && styles.optionItemSelected,
                  ]}
                  onPress={() => {
                    setPriority(option.value as "HIGH" | "MEDIUM" | "LOW");
                    setShowPriorityModal(false);
                  }}
                >
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(option.value) }]}>
                    <Text style={styles.priorityBadgeText}>{option.label}</Text>
                  </View>
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPriorityModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para seleção de data */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDateModal}
        onRequestClose={cancelDateSelection}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, shadows.large]}>
            <Text style={styles.modalTitle}>Selecione a Data</Text>
            
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Dia</Text>
                <ScrollView 
                  style={styles.datePickerScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {generateDays(tempDate.getMonth(), tempDate.getFullYear()).map((day) => (
                    <TouchableOpacity
                      key={`day-${day}`}
                      style={[
                        styles.datePickerItem,
                        tempDate.getDate() === day && styles.datePickerItemSelected,
                      ]}
                      onPress={() => {
                        const newDate = new Date(tempDate);
                        newDate.setDate(day);
                        setTempDate(newDate);
                      }}
                    >
                      <Text
                        style={[
                          styles.datePickerItemText,
                          tempDate.getDate() === day && styles.datePickerItemTextSelected,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Mês</Text>
                <ScrollView 
                  style={styles.datePickerScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {generateAvailableMonths(tempDate.getFullYear()).map((month, index) => {
                    const monthIndex = tempDate.getFullYear() === new Date().getFullYear() 
                      ? new Date().getMonth() + index 
                      : index;
                      
                    return (
                      <TouchableOpacity
                        key={`month-${monthIndex}`}
                        style={[
                          styles.datePickerItem,
                          tempDate.getMonth() === monthIndex && styles.datePickerItemSelected,
                        ]}
                        onPress={() => {
                          const newDate = new Date(tempDate);
                          newDate.setMonth(monthIndex);
                          // Ajusta para o último dia do mês se o dia atual for maior
                          const lastDay = new Date(newDate.getFullYear(), monthIndex + 1, 0).getDate();
                          if (newDate.getDate() > lastDay) {
                            newDate.setDate(lastDay);
                          }
                          setTempDate(newDate);
                        }}
                      >
                        <Text
                          style={[
                            styles.datePickerItemText,
                            tempDate.getMonth() === monthIndex && styles.datePickerItemTextSelected,
                          ]}
                        >
                          {month}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Ano</Text>
                <ScrollView 
                  style={styles.datePickerScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {generateYears().map((year) => (
                    <TouchableOpacity
                      key={`year-${year}`}
                      style={[
                        styles.datePickerItem,
                        tempDate.getFullYear() === year && styles.datePickerItemSelected,
                      ]}
                      onPress={() => {
                        const newDate = new Date(tempDate);
                        newDate.setFullYear(year);
                        setTempDate(newDate);
                      }}
                    >
                      <Text
                        style={[
                          styles.datePickerItemText,
                          tempDate.getFullYear() === year && styles.datePickerItemTextSelected,
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            
            <View style={styles.datePickerActions}>
              <TouchableOpacity
                style={[styles.datePickerButton, styles.datePickerCancelButton]}
                onPress={cancelDateSelection}
              >
                <Text style={styles.datePickerCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.datePickerButton, styles.datePickerConfirmButton]}
                onPress={confirmDate}
              >
                <Text style={styles.datePickerConfirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.medium,
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: spacing.large,
  },
  title: {
    fontSize: fonts.size.xxl,
    fontWeight: fonts.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.large,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.large,
  },
  formGroup: {
    marginBottom: spacing.large,
  },
  label: {
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    paddingHorizontal: spacing.medium,
    height: 56,
  },
  textareaContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
  },
  inputIcon: {
    marginRight: spacing.small,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: fonts.size.medium,
    color: colors.textPrimary,
  },
  textarea: {
    flex: 1,
    minHeight: 100,
    fontSize: fonts.size.medium,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    paddingHorizontal: spacing.medium,
    height: 56,
  },
  selectTextContainer: {
    flex: 1,
  },
  selectText: {
    flex: 1,
    fontSize: fonts.size.medium,
    color: colors.textPrimary,
    marginLeft: spacing.small,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.large,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    padding: spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.medium,
    height: 56,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
  },
  submitButton: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  submitButtonIcon: {
    marginRight: spacing.small,
  },
  submitButtonText: {
    color: colors.textLight,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
  },
  
  // Estilos para Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.large,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.large,
    textAlign: 'center',
  },
  optionsList: {
    marginBottom: spacing.large,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  optionItemSelected: {
    backgroundColor: colors.background,
  },
  optionText: {
    fontSize: fonts.size.medium,
    color: colors.textPrimary,
    marginLeft: spacing.medium,
  },
  modalCloseButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.medium,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: colors.textPrimary,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
  },
  
  // Badges
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xs,
    marginRight: spacing.medium,
  },
  statusBadgeText: {
    fontSize: fonts.size.xs,
    color: colors.textLight,
    fontWeight: fonts.weight.medium,
  },
  priorityBadge: {
    borderRadius: 4,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xs,
    marginRight: spacing.medium,
  },
  priorityBadgeText: {
    fontSize: fonts.size.xs,
    color: colors.textLight,
    fontWeight: fonts.weight.medium,
  },
  
  // Date Picker
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.large,
  },
  datePickerColumn: {
    flex: 1,
    marginHorizontal: spacing.small,
  },
  datePickerLabel: {
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.small,
  },
  datePickerScrollView: {
    height: 200,
  },
  datePickerItem: {
    padding: spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  datePickerItemSelected: {
    backgroundColor: colors.primary,
  },
  datePickerItemText: {
    fontSize: fonts.size.medium,
    color: colors.textPrimary,
  },
  datePickerItemTextSelected: {
    color: colors.textLight,
    fontWeight: fonts.weight.semiBold,
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerButton: {
    flex: 1,
    padding: spacing.medium,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerCancelButton: {
    backgroundColor: colors.background,
    marginRight: spacing.medium,
  },
  datePickerCancelButtonText: {
    color: colors.textSecondary,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
  },
  datePickerConfirmButton: {
    backgroundColor: colors.primary,
  },
  datePickerConfirmButtonText: {
    color: colors.textLight,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
  },
  characterCount: {
    fontSize: fonts.size.small,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
}); 