import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
} from "react-native";
import Header from "../../../components/header/Header";
import { colors, padding, borderRadius, margin } from "@/src/globalCSS";
import { useRouter } from "expo-router";
import { links } from "@/src/api/api";
import { ErrorAlertComponent } from "@/src/app/components/Alerts/AlertComponent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { CreateActivities } from "@/src/types/Activities/CreateActivities";
import { AuthContext } from "@/src/contexts/AuthContext";

const STATUS_OPTIONS = [
  { label: "Pendente", value: "PENDING" },
  { label: "Em Progresso", value: "IN_PROGRESS" },
  { label: "Concluído", value: "DONE" },
] as const;

export default function FormAddActivities() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const authContext = useContext(AuthContext);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      ErrorAlertComponent(
        "Campos obrigatórios",
        "Por favor, preencha todos os campos antes de salvar."
      );
      return;
    }

    const Activities: CreateActivities = {
      name: title,
      description: description,
      status: status,
      userId: authContext.user?.name || "",
    };

    try {
      await links.createActivity(Activities);
      router.push({
        pathname: "/pages/tabs/ToDo/ToDo",
        params: { refresh: Date.now().toString() }
      });
    } catch (error) {
      ErrorAlertComponent(
        "Erro ao criar atividade",
        "Não foi possível criar a atividade. Tente novamente mais tarde."
      );
    }
  };

  const getStatusLabel = (value: string) => {
    return (
      STATUS_OPTIONS.find((option) => option.value === value)?.label || value
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome da Atividade</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Digite o nome da atividade"
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

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Salvar Atividade</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
                  status === option.value && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setStatus(option.value);
                  setShowStatusModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    status === option.value && styles.modalOptionTextSelected,
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
