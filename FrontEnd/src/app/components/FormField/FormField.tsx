import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { colors, fonts, spacing } from "@/src/globalCSS";
import * as Linking from 'expo-linking';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: IconDefinition;
  required?: boolean;
  maxLength?: number;
  keyboardType?: "default" | "numeric" | "email-address";
  isLinksField?: boolean;
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
  isLinksField = false,
}: FormFieldProps) {
  const [links, setLinks] = useState<string[]>([]);

  // Função para extrair links do texto
  useEffect(() => {
    if (isLinksField && value) {
      // Regex para identificar URLs
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const foundLinks = value.match(urlRegex) || [];
      setLinks(foundLinks);
    }
  }, [value, isLinksField]);

  // Função para abrir o link
  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) => {
      console.error('Erro ao abrir o link:', err);
    });
  };

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
      
      {/* Exibir links detectados se for um campo de links */}
      {isLinksField && links.length > 0 && (
        <View style={styles.linksContainer}>
          <Text style={styles.linksTitle}>Links detectados:</Text>
          <ScrollView style={styles.linksList}>
            {links.map((link, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.linkItem}
                onPress={() => handleOpenLink(link)}
              >
                <Text style={styles.linkText} numberOfLines={1} ellipsizeMode="middle">
                  {link}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
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
  linksContainer: {
    marginTop: spacing.small,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.small,
  },
  linksTitle: {
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  linksList: {
    maxHeight: 100,
  },
  linkItem: {
    backgroundColor: colors.surface,
    borderRadius: 4,
    padding: spacing.xs,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  linkText: {
    fontSize: fonts.size.small,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
