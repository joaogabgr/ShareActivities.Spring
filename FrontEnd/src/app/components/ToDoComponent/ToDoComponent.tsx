import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { borderRadius, colors, margin, padding } from "@/src/globalCSS";
import { ReadActivities } from "@/src/types/Activities/ReadActivities";
import { formatDayAndHour } from "@/src/utils/formatDayAndHour";
import { Swipeable } from "react-native-gesture-handler";
import { links } from "@/src/api/api";
import { ErrorAlertComponent } from "@/src/app/components/Alerts/AlertComponent";

interface ToDoComponentProps extends ReadActivities {
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onStatusChange: () => void;
}

export default function ToDoComponent(props: ToDoComponentProps) {
  const renderRightActions = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => props.onEdit(props.id)}
        >
          <Text style={styles.deleteText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => props.onDelete(props.id)}
        >
          <Text style={styles.deleteText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLeftActions = () => {
    const getAvailableStatuses = () => {
      switch (props.status) {
        case "DONE":
          return [
            { label: "Pendente", value: "PENDING", color: colors.lightGray },
            { label: "Em Progresso", value: "IN_PROGRESS", color: colors.orange }
          ];
        case "IN_PROGRESS":
          return [
            { label: "Pendente", value: "PENDING", color: colors.lightGray },
            { label: "Concluído", value: "DONE", color: colors.green }
          ];
        case "PENDING":
          return [
            { label: "Em Progresso", value: "IN_PROGRESS", color: colors.orange },
            { label: "Concluído", value: "DONE", color: colors.green }
          ];
        default:
          return [];
      }
    };

    const handleStatusChange = async (newStatus: string) => {
      try {
        await links.updateActivityStatus(props.id, newStatus);
        props.onStatusChange();
      } catch (error) {
        ErrorAlertComponent(
          "Erro ao atualizar status",
          "Não foi possível atualizar o status da atividade. Tente novamente mais tarde."
        );
      }
    };

    return (
      <View style={{ flexDirection: "row" }}>
        {getAvailableStatuses().map((statusOption) => (
          <TouchableOpacity
            key={statusOption.value}
            style={[styles.actionButton, { backgroundColor: statusOption.color }]}
            onPress={() => handleStatusChange(statusOption.value)}
          >
            <Text style={styles.deleteText}>{statusOption.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getStatus = (status: string) => {
    switch (status) {
      case "DONE":
        return "Concluído";
      case "IN_PROGRESS":
        return "Em Progresso";
      case "PENDING":
        return "Pendente";
    }
  };

  return (
    <Swipeable 
      renderRightActions={renderRightActions} 
      renderLeftActions={renderLeftActions}
      overshootRight={false}
      overshootLeft={false}
    >
      <View style={styles.container}>
        <Text style={styles.textSmall}>Nome da atividade:</Text>
        <Text style={styles.text} key="name">
          {props.name}
        </Text>
        <Text style={styles.textSmall}>Descrição da atividade:</Text>
        <Text style={styles.text} key="description">
          {props.description}
        </Text>
        <Text style={styles.textSmall}>Status da atividade:</Text>
        <Text style={styles.text} key="status">
          {getStatus(props.status)}
        </Text>
        <Text style={styles.textSmall}>Criado por:</Text>
        <Text style={[styles.text, styles.textSmall]} key="userName">
          {props.userName}
        </Text>
        <Text
          style={[styles.text, styles.textSmall, styles.lastChild]}
          key="date"
        >
          {formatDayAndHour(props.date)}
        </Text>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkGray,
    padding: padding,
    width: '100%',
    marginTop: 0,
    marginBottom: 10,
    borderRadius: borderRadius,
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: "89%",
    marginVertical: margin,
    marginHorizontal: margin,
    borderRadius: borderRadius,
  },
  deleteButton: {
    backgroundColor: colors.red,
  },
  editButton: {
    backgroundColor: colors.green,
    marginLeft: margin,
  },
  deleteText: {
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    color: colors.white,
    fontSize: 16,
    marginBottom: margin,
  },
  textSmall: {
    color: colors.white,
    fontSize: 12,
  },
  lastChild: {
    marginBottom: 0,
  },
});
