import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '@/src/globalCSS';

// Componente de estado vazio
const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>Ainda não há mensagens.</Text>
    <Text style={styles.emptySubtext}>Seja o primeiro a enviar uma mensagem!</Text>
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.large,
  },
  emptyText: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.medium as any,
    color: colors.textPrimary,
    marginBottom: spacing.small,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default EmptyState; 