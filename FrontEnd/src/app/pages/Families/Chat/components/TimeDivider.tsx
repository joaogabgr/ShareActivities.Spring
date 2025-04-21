import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '@/src/globalCSS';
import { TimeDividerProps } from '../types';

// Componente de divisor de tempo
const TimeDivider = ({ date }: TimeDividerProps) => {
  // Verificar se a data é de hoje
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  let formattedDate;
  
  if (date.toDateString() === today.toDateString()) {
    formattedDate = 'Hoje';
  } else if (date.toDateString() === yesterday.toDateString()) {
    formattedDate = 'Ontem';
  } else {
    // Formatar a data para mostrar apenas o dia
    formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: '2-digit'
    });
  }
  
  return (
    <View style={styles.timeDivider}>
      <View style={styles.timeDividerLine} />
      <Text style={styles.timeDividerText}>{formattedDate}</Text>
      <View style={styles.timeDividerLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  timeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.medium,
    marginHorizontal: spacing.large,
  },
  timeDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  timeDividerText: {
    marginHorizontal: spacing.medium,
    fontSize: fonts.size.xs,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.small,
  },
});

export default TimeDivider; 