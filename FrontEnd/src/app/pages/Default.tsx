import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { faList, faPeopleGroup, faTasks, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/header/Header";
import Models from "../components/Models/Models";
import React from "react";

export default function Default() {    
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Bem-vindo ao Share Activities</Text>
          <Text style={styles.welcomeSubtitle}>Compartilhe e gerencie atividades com sua família</Text>
        </View>

        <View style={styles.modelsContainer}>
          <Models 
            icon={faPeopleGroup} 
            title="Meus Grupos" 
            color={colors.primary}
            description="Veja seus grupos de atividades e compartilhe com seus amigos" 
            onPress='/pages/tabs/MyFamily/MyFamily' 
          />
          
          <Models 
            icon={faList} 
            title="Tarefas a fazer" 
            color={colors.secondary} 
            description="Veja e gerencie todas as tarefas pendentes, em progresso e concluídas"
            onPress="/pages/tabs/ToDo/ToDo"
          />

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.large,
  },
  welcomeSection: {
    marginBottom: spacing.large,
  },
  welcomeTitle: {
    fontSize: fonts.size.xxl,
    fontWeight: fonts.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },
  welcomeSubtitle: {
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
  },
  modelsContainer: {
    width: "100%",
  },
});
