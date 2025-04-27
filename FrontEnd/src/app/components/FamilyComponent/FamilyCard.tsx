import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { Family } from "@/src/types/Family/Family";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEdit, faUserGroup, faMessage, faListCheck, faUserPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Swipeable } from "react-native-gesture-handler";
import { links } from "@/src/api/api";

interface FamilyCardProps extends Family {
  onEdit?: (id: string) => void;
  onViewTasks?: (id: string) => void;
  onChat?: (id: string) => void;
  onInvite?: (id: string, name: string) => void;
  onDelete?: (id: string) => void;
  onViewMembers?: (id: string, name: string) => void;
}

export default function FamilyCard(props: FamilyCardProps) {
  const handleViewTasks = () => {
    if (props.onViewTasks) {
      props.onViewTasks(props.id);
    }
  };

  const handleChat = () => {
    if (props.onChat) {
      props.onChat(props.id);
    }
  };

  const handleEdit = () => {
    if (props.onEdit) {
      props.onEdit(props.id);
    }
  };

  const handleInvite = () => {
    if (props.onInvite) {
      props.onInvite(props.id, props.name);
    }
  };
  
  const handleViewMembers = () => {
    if (props.onViewMembers) {
      props.onViewMembers(props.id, props.name);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Excluir Grupo",
      `Tem certeza que deseja excluir o grupo "${props.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            (async () => {
              try {
                const response = await links.deleteFamily(props.id);
                if (props.onDelete) {
                  props.onDelete(props.id);
                }
              } catch (error) {
                console.error("Erro ao deletar família:", error);
                Alert.alert(
                  "Erro",
                  "Não foi possível excluir o grupo. Tente novamente."
                );
              }
            })();
          },
        },
      ]
    );
  };

  const renderRightActions = () => {
    if (!props.isOwner) return null;
    
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEdit}
        >
          <FontAwesomeIcon icon={faEdit} size={20} color={colors.textLight} />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
          onPress={handleInvite}
        >
          <FontAwesomeIcon icon={faUserPlus} size={20} color={colors.textLight} />
          <Text style={styles.actionText}>Convidar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={confirmDelete}
        >
          <FontAwesomeIcon icon={faTrash} size={20} color={colors.textLight} />
          <Text style={styles.actionText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
      enabled={props.isOwner}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{props.name}</Text>
            {props.description && (
              <Text style={styles.description}>{props.description}</Text>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.actionButtonFixed}
            onPress={handleViewTasks}
          >
            <FontAwesomeIcon icon={faListCheck} size={16} color={colors.primary} />
            <Text style={styles.actionButtonFixedText}>Tarefas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButtonFixed}
            onPress={handleViewMembers}
          >
            <FontAwesomeIcon icon={faUserGroup} size={16} color={colors.primary} />
            <Text style={styles.actionButtonFixedText}>Membros</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButtonFixed}
            onPress={handleChat}
          >
            <FontAwesomeIcon icon={faMessage} size={16} color={colors.primary} />
            <Text style={styles.actionButtonFixedText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: spacing.medium,
    ...shadows.small,
  },
  header: {
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  titleContainer: {
    marginBottom: spacing.small,
  },
  title: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semiBold as any,
    color: colors.textPrimary,
  },
  description: {
    fontSize: fonts.size.small,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.medium,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.small,
  },
  infoText: {
    fontSize: fonts.size.small,
    color: colors.textSecondary,
    marginLeft: spacing.small,
  },
  ownerText: {
    fontSize: fonts.size.small,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  footer: {
    flexDirection: "row",
    padding: spacing.small,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.background,
  },
  actionButtonFixed: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.small,
  },
  actionButtonFixedText: {
    fontSize: fonts.size.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
  }
}); 