import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { colors, fonts, spacing } from "@/src/globalCSS";

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: IconDefinition;
  required?: boolean;
  maxLength?: number;
  keyboardType?: "default" | "numeric" | "email-address";
}

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  required = false,
  maxLength = 255,
  keyboardType = "default",
}: FormFieldProps) {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>
        {label} {required && "*"}
      </Text>
      <View style={styles.inputContainer}>
        <FontAwesomeIcon icon={icon} size={20} color={colors.primary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, value.length > 0 ? styles.inputWithText : styles.inputEmpty]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={colors.disabled}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline
        />
      </View>
    </View>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    paddingHorizontal: spacing.medium,
    backgroundColor: colors.surface,
    minHeight: 56,
    maxHeight: 200,
  },
  inputIcon: {
    marginTop: 18,
    marginRight: spacing.small,
  },
  input: {
    flex: 1,
    fontSize: fonts.size.medium,
    color: colors.textPrimary,
    paddingVertical: 10,
    minHeight: 56,
    maxHeight: 200,
    textAlignVertical: "top",
  },
  inputEmpty: {
    paddingTop: 16,
  },
  inputWithText: {
    paddingTop: 10,
  },
});
