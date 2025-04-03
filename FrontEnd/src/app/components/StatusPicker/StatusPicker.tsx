import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronDown, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";

const STATUS_OPTIONS = [
  { label: "Pendente", value: "PENDING" },
  { label: "Em Progresso", value: "IN_PROGRESS" },
  { label: "Concluído", value: "DONE" },
] as const;

interface StatusPickerProps {
  status: string;
  onStatusChange: (status: string) => void;
  label?: string;
}

export default function StatusPicker({
  status,
  onStatusChange,
  label = "Status",
}: StatusPickerProps) {
  const [showStatusModal, setShowStatusModal] = useState(false);

  const getStatusLabel = (value: string) => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : value;
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

  return (
    <>
      <View style={styles.formGroup}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={styles.selectContainer}
          onPress={() => setShowStatusModal(true)}
        >
          <FontAwesomeIcon
            icon={faListCheck}
            size={20}
            color={colors.primary}
            style={styles.inputIcon}
          />
          <View style={styles.selectTextContainer}>
            <Text style={styles.selectText}>{getStatusLabel(status)}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(status) },
            ]}
          >
            <Text style={styles.statusBadgeText}>{getStatusLabel(status)}</Text>
          </View>
          <FontAwesomeIcon
            icon={faChevronDown}
            size={16}
            color={colors.disabled}
          />
        </TouchableOpacity>
      </View>

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
                    status === option.value && styles.optionItemSelected,
                  ]}
                  onPress={() => {
                    onStatusChange(option.value);
                    setShowStatusModal(false);
                  }}
                >
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(option.value) },
                    ]}
                  >
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
    </>
  );
}

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: spacing.medium,
  },
  label: {
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    paddingHorizontal: spacing.medium,
    height: 56,
    backgroundColor: colors.surface,
  },
  inputIcon: {
    marginRight: spacing.small,
  },
  selectTextContainer: {
    flex: 1,
    paddingVertical: spacing.small,
  },
  selectText: {
    fontSize: fonts.size.medium,
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: spacing.small,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: spacing.small,
  },
  statusBadgeText: {
    color: colors.textLight,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.semiBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.medium,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.large,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.large,
    textAlign: "center",
  },
  optionsList: {
    marginBottom: spacing.large,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    padding: spacing.medium,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: colors.textSecondary,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
  },
});