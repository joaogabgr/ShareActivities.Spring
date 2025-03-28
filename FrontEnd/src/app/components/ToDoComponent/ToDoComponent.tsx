import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { ReadActivities } from "@/src/types/Activities/ReadActivities";
import { expireDate, formatDay, formatDayAndHour } from "@/src/utils/formatDayAndHour";
import { Swipeable } from "react-native-gesture-handler";
import { links } from "@/src/api/api";
import { ErrorAlertComponent } from "@/src/app/components/Alerts/AlertComponent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEdit, faTrash, faClock, faUser, faInfoCircle, faCalendarAlt, faFlag } from "@fortawesome/free-solid-svg-icons";

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
          <FontAwesomeIcon icon={faEdit} size={20} color={colors.textLight} />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => props.onDelete(props.id)}
        >
          <FontAwesomeIcon icon={faTrash} size={20} color={colors.textLight} />
          <Text style={styles.actionText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLeftActions = () => {
    const getAvailableStatuses = () => {
      switch (props.status) {
        case "DONE":
          return [
            { label: "Pendente", value: "PENDING", color: colors.statusPending },
            {
              label: "Em Progresso",
              value: "IN_PROGRESS",
              color: colors.statusInProgress,
            },
          ];
        case "IN_PROGRESS":
          return [
            { label: "Pendente", value: "PENDING", color: colors.statusPending },
            { label: "Concluído", value: "DONE", color: colors.statusDone },
          ];
        case "PENDING":
          return [
            {
              label: "Em Progresso",
              value: "IN_PROGRESS",
              color: colors.statusInProgress,
            },
            { label: "Concluído", value: "DONE", color: colors.statusDone },
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
            style={[
              styles.actionButton,
              { backgroundColor: statusOption.color },
            ]}
            onPress={() => handleStatusChange(statusOption.value)}
          >
            <Text style={styles.actionText}>{statusOption.label}</Text>
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
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE":
        return colors.statusDone;
      case "IN_PROGRESS":
        return colors.statusInProgress;
      case "PENDING":
        return colors.statusPending;
      default:
        return colors.primary;
    }
  };

  const getExpirationStatus = () => {
    if (!props.dateExpire) return 'normal';
    
    const now = new Date();
    const expireDate = new Date(props.dateExpire);
    expireDate.setHours(expireDate.getHours() - 3);

    // Se já venceu
    if (now > expireDate) {
      return 'expired';
    }

    // Calcula a diferença em dias
    const diffTime = expireDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Se está a 3 dias ou menos de vencer
    if (diffDays <= 3) {
      return 'warning';
    }

    return 'normal';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return colors.priorityHigh;
      case "MEDIUM":
        return colors.priorityMedium;
      case "LOW":
        return colors.priorityLow;
      default:
        return colors.textSecondary;
    }
  };

  const containerStyle = () => {
    const baseStyle = [styles.container, shadows.small];
    
    // Se a atividade estiver concluída, retorna o estilo base sem borda
    if (props.status === "DONE") {
      return baseStyle;
    }

    const status = getExpirationStatus();
    switch (status) {
      case 'expired':
        return [...baseStyle, styles.containerExpired];
      case 'warning':
        return [...baseStyle, styles.containerWarning];
      default:
        return baseStyle;
    }
  };

  const getPriority = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "Alta";
      case "MEDIUM":
        return "Média";
      case "LOW":
        return "Baixa";
      default:
        return priority;
    }
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      overshootRight={false}
      overshootLeft={false}
    >
      <View style={containerStyle()}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{props.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(props.status) }]}>
              <Text style={styles.statusText}>{getStatus(props.status)}</Text>
            </View>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(props.priority) }]}>
            <Text style={styles.priorityText}>{getPriority(props.priority)}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>{props.description}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <FontAwesomeIcon icon={faUser} size={12} color={colors.textSecondary} />
            <Text style={styles.footerText}>{props.userName}</Text>
          </View>
          
          <View style={styles.footerItem}>
            <FontAwesomeIcon icon={faCalendarAlt} size={12} color={colors.textSecondary} />
            <Text style={styles.footerText}>{formatDayAndHour(props.date)}</Text>
          </View>
          
          {props.dateExpire && props.status !== "DONE" && (
            <View style={styles.footerItem}>
              <FontAwesomeIcon 
                icon={faClock} 
                size={12} 
                color={getExpirationStatus() === 'expired' ? colors.error : 
                       getExpirationStatus() === 'warning' ? colors.accent : 
                       colors.textSecondary} 
              />
              <Text style={[
                styles.footerText,
                getExpirationStatus() === 'expired' ? styles.textExpired : 
                getExpirationStatus() === 'warning' ? styles.textWarning : {}
              ]}>
                {expireDate(props.dateExpire)}
              </Text>
            </View>
          )}

          {props.dayForRecover && (
            <View style={styles.footerItem}>
              <FontAwesomeIcon icon={faFlag} size={12} color={colors.textSecondary} />
              <Text style={styles.footerText}>{formatDay(props.dayForRecover)}</Text>
            </View>
            )
          }
          
          <View style={styles.footerItem}>
            <FontAwesomeIcon icon={faInfoCircle} size={12} color={colors.textSecondary} />
            <Text style={styles.footerText}>{props.type}</Text>
          </View>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.medium,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  containerWarning: {
    borderLeftColor: colors.accent,
  },
  containerExpired: {
    borderLeftColor: colors.error,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semiBold as any,
    color: colors.textPrimary,
    marginRight: spacing.small,
    flex: 1,
  },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  statusText: {
    fontSize: fonts.size.xs,
    color: colors.textLight,
    fontWeight: fonts.weight.medium as any,
  },
  priorityBadge: {
    borderRadius: 12,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xs,
    marginLeft: spacing.small,
  },
  priorityText: {
    fontSize: fonts.size.xs,
    color: colors.textLight,
    fontWeight: fonts.weight.medium as any,
  },
  content: {
    padding: spacing.medium,
  },
  description: {
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'column',
    padding: spacing.medium,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: spacing.medium,
    marginBottom: spacing.small,
  },
  footerText: {
    fontSize: fonts.size.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  textExpired: {
    color: colors.error,
    fontWeight: fonts.weight.medium as any,
  },
  textWarning: {
    color: colors.accent,
    fontWeight: fonts.weight.medium as any,
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: "90%",
    borderRadius: 12,
    marginHorizontal: 1,
  },
  actionText: {
    color: colors.textLight,
    fontSize: fonts.size.small,
    marginTop: spacing.xs,
    fontWeight: fonts.weight.medium as any,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
});
