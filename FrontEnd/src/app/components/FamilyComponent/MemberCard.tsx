import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { FamilyMemberResponse } from "@/src/types/Family/Family";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserShield, faUser, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Swipeable } from "react-native-gesture-handler";

interface MemberCardProps {
  member: FamilyMemberResponse;
  isUserAdmin: boolean;
  onDelete?: (id: string) => void;
}

export default function MemberCard({ member, isUserAdmin, onDelete }: MemberCardProps) {
  const handleDelete = () => {
    if (onDelete && !member.isAdmin) {
      Alert.alert(
        "Remover Membro",
        `Tem certeza que deseja remover ${member.userName} do grupo?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Remover",
            style: "destructive",
            onPress: () => {
              onDelete(member.userId);
            },
          },
        ]
      );
    }
  };

  const renderRightActions = () => {
    if (!isUserAdmin || member.isAdmin) return null;
    
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <FontAwesomeIcon icon={faTrash} size={20} color={colors.textLight} />
          <Text style={styles.actionText}>Remover</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
      enabled={isUserAdmin && !member.isAdmin}
    >
      <View style={styles.container}>
        <View style={styles.memberInfo}>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon 
              icon={member.isAdmin ? faUserShield : faUser} 
              size={18} 
              color={member.isAdmin ? colors.primary : colors.textSecondary} 
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.nameText}>{member.userName}</Text>
            <Text style={styles.emailText}>{member.userEmail}</Text>
            <Text style={styles.roleText}>
              {member.isAdmin ? 'Administrador' : 'Membro'}
            </Text>
          </View>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.medium,
    marginBottom: spacing.small,
    ...shadows.small,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.medium,
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emailText: {
    fontSize: fonts.size.small,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  roleText: {
    fontSize: fonts.size.xs,
    color: colors.textSecondary,
    fontStyle: "italic",
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
  deleteButton: {
    backgroundColor: colors.error,
  }
}); 