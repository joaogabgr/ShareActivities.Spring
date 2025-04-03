import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronDown, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";

// Meses em português para o seletor de data
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface DatePickerProps {
  date: Date | null;
  onDateChange: (date: Date) => void;
  label?: string;
}

export default function DatePicker({ date, onDateChange, label = "Data" }: DatePickerProps) {
  const [showDateModal, setShowDateModal] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(date || new Date());

  const openDatePicker = () => {
    const today = new Date();
    if (!date || date < today) {
      setTempDate(today);
    } else {
      setTempDate(date);
    }
    setShowDateModal(true);
  };

  const confirmDate = () => {
    onDateChange(tempDate);
    setShowDateModal(false);
  };

  const cancelDateSelection = () => {
    setShowDateModal(false);
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "Selecione uma data";
    return `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const generateDays = (month: number, year: number) => {
    // Pega o último dia do mês
    const lastDay = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const days = [];

    // Se for o mês e ano atual, começa do dia atual
    // Se for um mês/ano anterior, não mostra nenhum dia
    // Se for um mês/ano futuro, mostra todos os dias
    if (
      year < today.getFullYear() ||
      (year === today.getFullYear() && month < today.getMonth())
    ) {
      return [];
    }

    const startDay =
      year === today.getFullYear() && month === today.getMonth()
        ? today.getDate()
        : 1;

    for (let i = startDay; i <= lastDay; i++) {
      days.push(i);
    }
    return days;
  };

  const generateAvailableMonths = (year: number) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Se for o ano atual, só mostra os meses a partir do mês atual
    if (year === currentYear) {
      return MONTHS.slice(currentMonth);
    }
    // Se for um ano futuro, mostra todos os meses
    return MONTHS;
  };

  return (
    <>
      <View style={styles.formGroup}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity style={styles.selectContainer} onPress={openDatePicker}>
          <FontAwesomeIcon
            icon={faCalendarAlt}
            size={20}
            color={colors.primary}
            style={styles.inputIcon}
          />

          <View style={styles.selectTextContainer}>
            <Text style={styles.selectText}>{formatDisplayDate(date)}</Text>
          </View>

          <View style={{ width: 20, alignItems: "flex-end" }}>
            <FontAwesomeIcon
              icon={faChevronDown}
              size={16}
              color={colors.disabled}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal para seleção de data */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDateModal}
        onRequestClose={cancelDateSelection}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, shadows.large]}>
            <Text style={styles.modalTitle}>Selecione a Data</Text>

            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Dia</Text>
                <ScrollView
                  style={styles.datePickerScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {generateDays(tempDate.getMonth(), tempDate.getFullYear()).map(
                    (day) => (
                      <TouchableOpacity
                        key={`day-${day}`}
                        style={[
                          styles.datePickerItem,
                          tempDate.getDate() === day &&
                            styles.datePickerItemSelected,
                        ]}
                        onPress={() => {
                          const newDate = new Date(tempDate);
                          newDate.setDate(day);
                          setTempDate(newDate);
                        }}
                      >
                        <Text
                          style={[
                            styles.datePickerItemText,
                            tempDate.getDate() === day &&
                              styles.datePickerItemTextSelected,
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </ScrollView>
              </View>

              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Mês</Text>
                <ScrollView
                  style={styles.datePickerScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {generateAvailableMonths(tempDate.getFullYear()).map(
                    (month, index) => {
                      const monthIndex =
                        tempDate.getFullYear() === new Date().getFullYear()
                          ? index + new Date().getMonth()
                          : index;
                      return (
                        <TouchableOpacity
                          key={`month-${monthIndex}`}
                          style={[
                            styles.datePickerItem,
                            tempDate.getMonth() === monthIndex &&
                              styles.datePickerItemSelected,
                          ]}
                          onPress={() => {
                            const newDate = new Date(tempDate);
                            newDate.setMonth(monthIndex);
                            // Se o dia atual for maior que o último dia do mês selecionado,
                            // ajusta para o último dia do mês
                            const lastDayOfMonth = new Date(
                              newDate.getFullYear(),
                              monthIndex + 1,
                              0
                            ).getDate();
                            if (newDate.getDate() > lastDayOfMonth) {
                              newDate.setDate(lastDayOfMonth);
                            }
                            setTempDate(newDate);
                          }}
                        >
                          <Text
                            style={[
                              styles.datePickerItemText,
                              tempDate.getMonth() === monthIndex &&
                                styles.datePickerItemTextSelected,
                            ]}
                          >
                            {month}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  )}
                </ScrollView>
              </View>

              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Ano</Text>
                <ScrollView
                  style={styles.datePickerScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {generateYears().map((year) => (
                    <TouchableOpacity
                      key={`year-${year}`}
                      style={[
                        styles.datePickerItem,
                        tempDate.getFullYear() === year &&
                          styles.datePickerItemSelected,
                      ]}
                      onPress={() => {
                        const newDate = new Date(tempDate);
                        newDate.setFullYear(year);
                        setTempDate(newDate);
                      }}
                    >
                      <Text
                        style={[
                          styles.datePickerItemText,
                          tempDate.getFullYear() === year &&
                            styles.datePickerItemTextSelected,
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalCancelButton, shadows.small]}
                onPress={cancelDateSelection}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalConfirmButton, shadows.small]}
                onPress={confirmDate}
              >
                <Text style={styles.modalConfirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
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
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.large,
  },
  datePickerColumn: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: spacing.xs,
  },
  datePickerLabel: {
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.small,
  },
  datePickerScrollView: {
    height: 150,
    width: "100%",
  },
  datePickerItem: {
    paddingVertical: spacing.small,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginVertical: 2,
  },
  datePickerItemSelected: {
    backgroundColor: colors.background,
  },
  datePickerItemText: {
    fontSize: fonts.size.medium,
    color: colors.textPrimary,
  },
  datePickerItemTextSelected: {
    color: colors.primary,
    fontWeight: fonts.weight.bold,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    padding: spacing.medium,
    alignItems: "center",
    marginRight: spacing.small,
  },
  modalCancelButtonText: {
    color: colors.textSecondary,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.medium,
    alignItems: "center",
    marginLeft: spacing.small,
  },
  modalConfirmButtonText: {
    color: colors.textLight,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
  },
});