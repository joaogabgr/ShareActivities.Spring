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
  Platform,
} from "react-native";
import Header from "../../../components/header/Header";
import { colors, padding, borderRadius, margin } from "@/src/globalCSS";
import { useRouter, useLocalSearchParams } from "expo-router";
import { links } from "@/src/api/api";
import { ErrorAlertComponent } from "@/src/app/components/Alerts/AlertComponent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronDown, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
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
  const [status, setStatus] = useState<ActivitiesStatus>(ActivitiesStatus.PENDING);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
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
      }
    }
  }, [params.activity]);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !activity || !expirationDate) {
      ErrorAlertComponent(
        "Campos obrigatórios",
        "Por favor, preencha todos os campos, incluindo a data de expiração."
      );
      return;
    }

    // Cria uma nova data e ajusta para o final do dia no fuso horário correto
    const formattedDate = new Date(expirationDate);
    formattedDate.setHours(23, 59, 59, 999);

    const updatedActivity: UpdateActivities = {
      id: activity.id,
      name: title,
      description: description,
      status: status,
      userId: authContext.user?.name || "",
      type: type,
      dateExpire: formattedDate.toISOString(),
      priority: priority,
    };

    try {
      await links.updateActivity(updatedActivity);
      router.replace({
        pathname: "/pages/tabs/ToDo/ToDo",
        params: { refresh: Date.now().toString() }
      });
    } catch (error) {
      ErrorAlertComponent(
        "Erro ao atualizar atividade",
        "Não foi possível atualizar a atividade. Tente novamente mais tarde."
      );
    }
  };

  const openDatePicker = () => {
    setTempDate(expirationDate || new Date());
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
    if (!date) return "";
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Gerar anos para o seletor (ano atual até 5 anos no futuro)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 5; i++) {
      years.push(currentYear + i);
    }
    return years;
  };

  // Gerar dias para o seletor (1-31, ajustado para o mês)
  const generateDays = (month: number, year: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      currentDate.setHours(0, 0, 0, 0);
      
      if (currentDate >= today) {
        days.push(i);
      }
    }
    return days;
  };

  const getStatusLabel = (value: string) => {
    return (
      STATUS_OPTIONS.find((option) => option.value === value)?.label || value
    );
  };

  const getPriorityLabel = (value: string) => {
    return (
      PRIORITY_OPTIONS.find((option) => option.value === value)?.label || value
    );
  };

  if (!activity) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <KeyboardAvoidingContainer>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome da Atividade</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Digite o nome da atividade"
            placeholderTextColor={colors.gray}
          />

          <Text style={styles.label}>Tipo</Text>
          <TextInput
            style={styles.input}
            value={type}
            onChangeText={setType}
            placeholder="Digite o tipo da atividade"
            placeholderTextColor={colors.gray}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Digite a descrição da atividade"
            placeholderTextColor={colors.gray}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Data de Expiração</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={openDatePicker}
          >
            <Text style={styles.dateButtonText}>
              {expirationDate ? formatDisplayDate(expirationDate) : "Selecione uma data"}
            </Text>
            <FontAwesomeIcon
              icon={faCalendarAlt}
              color={colors.white}
              size={16}
            />
          </TouchableOpacity>

          <Text style={styles.label}>Status</Text>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={() => setShowStatusModal(true)}
          >
            <Text style={styles.statusButtonText}>
              {getStatusLabel(status)}
            </Text>
            <FontAwesomeIcon
              icon={faChevronDown}
              color={colors.white}
              size={16}
            />
          </TouchableOpacity>

          <Text style={styles.label}>Prioridade</Text>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={() => setShowPriorityModal(true)}
          >
            <Text style={styles.statusButtonText}>
              {getPriorityLabel(priority)}
            </Text>
            <FontAwesomeIcon
              icon={faChevronDown}
              color={colors.white}
              size={16}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Atualizar Atividade</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingContainer>

      {/* Modal para seleção de data */}
      <Modal
        visible={showDateModal}
        transparent
        animationType="slide"
        onRequestClose={cancelDateSelection}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a Data</Text>
            
            <ScrollView style={styles.datePickerContainer}>
              <View style={styles.datePickerContent}>
                {/* Seletor de Dia */}
                <View style={styles.datePickerColumn}>
                  <Text style={styles.datePickerLabel}>Dia</Text>
                  <ScrollView style={styles.datePickerOptions} showsVerticalScrollIndicator={true}>
                    {generateDays(tempDate.getMonth(), tempDate.getFullYear()).map((day) => (
                      <TouchableOpacity
                        key={`day-${day}`}
                        style={[
                          styles.dateOption,
                          tempDate.getDate() === day && styles.dateOptionSelected,
                        ]}
                        onPress={() => {
                          const newDate = new Date(tempDate);
                          newDate.setDate(day);
                          setTempDate(newDate);
                        }}
                      >
                        <Text
                          style={[
                            styles.dateOptionText,
                            tempDate.getDate() === day && styles.dateOptionTextSelected,
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Seletor de Mês */}
                <View style={styles.datePickerColumn}>
                  <Text style={styles.datePickerLabel}>Mês</Text>
                  <ScrollView style={styles.datePickerOptions} showsVerticalScrollIndicator={true}>
                    {MONTHS.map((month, index) => {
                      const currentDate = new Date();
                      const currentYear = currentDate.getFullYear();
                      const currentMonth = currentDate.getMonth();
                      
                      // Desabilita meses anteriores ao atual no ano corrente
                      if (tempDate.getFullYear() === currentYear && index < currentMonth) {
                        return null;
                      }

                      return (
                        <TouchableOpacity
                          key={`month-${index}`}
                          style={[
                            styles.dateOption,
                            tempDate.getMonth() === index && styles.dateOptionSelected,
                          ]}
                          onPress={() => {
                            const newDate = new Date(tempDate);
                            newDate.setMonth(index);
                            // Ajustar o dia se necessário (ex: 31 de março para 30 de abril)
                            const daysInNewMonth = new Date(newDate.getFullYear(), index + 1, 0).getDate();
                            if (newDate.getDate() > daysInNewMonth) {
                              newDate.setDate(daysInNewMonth);
                            }

                            // Se a nova data for anterior à data atual, ajusta para o primeiro dia disponível
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            if (newDate < today) {
                              newDate.setDate(today.getDate());
                            }

                            setTempDate(newDate);
                          }}
                        >
                          <Text
                            style={[
                              styles.dateOptionText,
                              tempDate.getMonth() === index && styles.dateOptionTextSelected,
                            ]}
                          >
                            {month}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Seletor de Ano */}
                <View style={styles.datePickerColumn}>
                  <Text style={styles.datePickerLabel}>Ano</Text>
                  <ScrollView style={styles.datePickerOptions} showsVerticalScrollIndicator={true}>
                    {generateYears().map((year) => (
                      <TouchableOpacity
                        key={`year-${year}`}
                        style={[
                          styles.dateOption,
                          tempDate.getFullYear() === year && styles.dateOptionSelected,
                        ]}
                        onPress={() => {
                          const newDate = new Date(tempDate);
                          newDate.setFullYear(year);
                          setTempDate(newDate);
                        }}
                      >
                        <Text
                          style={[
                            styles.dateOptionText,
                            tempDate.getFullYear() === year && styles.dateOptionTextSelected,
                          ]}
                        >
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </ScrollView>

            <View style={styles.datePickerActions}>
              <TouchableOpacity
                style={[styles.datePickerButton, styles.datePickerCancelButton]}
                onPress={cancelDateSelection}
              >
                <Text style={styles.datePickerButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.datePickerButton, styles.datePickerConfirmButton]}
                onPress={confirmDate}
              >
                <Text style={styles.datePickerButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para seleção de status */}
      <Modal
        visible={showStatusModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Status</Text>
            {STATUS_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  status.toString() === option.value && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setStatus(option.value as ActivitiesStatus);
                  setShowStatusModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    status.toString() === option.value && styles.modalOptionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Modal para seleção de prioridade */}
      <Modal
        visible={showPriorityModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPriorityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a Prioridade</Text>
            {PRIORITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  priority === option.value && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setPriority(option.value as "HIGH" | "MEDIUM" | "LOW");
                  setShowPriorityModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    priority === option.value && styles.modalOptionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray,
  },
  scrollView: {
    flex: 1,
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
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.darkGray,
    borderRadius: borderRadius,
    padding: padding,
    marginBottom: margin,
  },
  dateButtonText: {
    color: colors.white,
    fontSize: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: colors.white,
    fontSize: 16,
  },
  datePickerContainer: {
    maxHeight: 300,
  },
  datePickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  datePickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  datePickerLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  datePickerOptions: {
    maxHeight: 200,
  },
  dateOption: {
    padding: 8,
    borderRadius: borderRadius,
    marginBottom: 4,
  },
  dateOptionSelected: {
    backgroundColor: colors.orange,
  },
  dateOptionText: {
    color: colors.white,
    fontSize: 14,
    textAlign: "center",
  },
  dateOptionTextSelected: {
    fontWeight: "bold",
  },
  datePickerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: margin,
  },
  datePickerButton: {
    flex: 1,
    padding: padding,
    borderRadius: borderRadius,
    alignItems: "center",
    marginHorizontal: 4,
  },
  datePickerCancelButton: {
    backgroundColor: colors.gray,
  },
  datePickerConfirmButton: {
    backgroundColor: colors.orange,
  },
  datePickerButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
}); 