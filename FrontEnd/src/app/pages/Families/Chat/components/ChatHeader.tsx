import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { colors, fonts, shadows, spacing } from '@/src/globalCSS';
import { ChatHeaderProps } from '../types';

// Componente de cabeçalho do chat
const ChatHeader = ({ title, groupName, onBack }: ChatHeaderProps) => (
  <>
    <View style={styles.pageTitle}>
      <Text style={styles.pageTitle}>{title} {groupName}</Text>
    </View>
  </>
);

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: fonts.size.xxl,
    fontWeight: fonts.weight.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.medium,
    paddingHorizontal: spacing.medium,
    textAlign: 'center',
},
  groupName: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semiBold as any,
    color: colors.primary,
    marginBottom: spacing.medium,
    textAlign: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    ...shadows.small,
  },
});

export default ChatHeader; 