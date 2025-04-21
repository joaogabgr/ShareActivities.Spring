import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
} from "react-native";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { FamilyMemberResponse, FamilyMembersResponseData, InviteMemberRequest } from "@/src/types/Family/Family";
import { links } from "@/src/api/api";
import { ErrorAlertComponent, SuccessAlertComponent } from "@/src/app/components/Alerts/AlertComponent";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faEnvelope, faUserPlus, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "@/src/contexts/AuthContext";
import MemberCard from "@/src/app/components/FamilyComponent/MemberCard";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/src/app/components/header/Header";

// Tipos para organizar membros em seções
type SectionType = "ADMIN" | "MEMBERS";

type ExpandedSections = {
  [key in SectionType]: boolean;
};

export default function Members() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [members, setMembers] = useState<FamilyMemberResponse[]>([]);
  const [adminMembers, setAdminMembers] = useState<FamilyMemberResponse[]>([]);
  const [regularMembers, setRegularMembers] = useState<FamilyMemberResponse[]>([]);
  const [emailToInvite, setEmailToInvite] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    ADMIN: true,
    MEMBERS: true
  });
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    loadUserEmailAndFetchMembers();
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchMembers();
    }
  }, [userEmail]);

  const loadUserEmailAndFetchMembers = async () => {
    try {
      const email = authContext.user?.name;
      if (email) {
        setUserEmail(email);
      } else {
        router.replace("/pages/auth/Login");
      }
    } catch (error) {
      console.error("Erro ao carregar email do usuário:", error);
    }
  };

  const fetchMembers = useCallback(async () => {
    if (!userEmail || !id) return;
    
    try {
      setLoading(true);
      const response = await links.getFamilyMembers(id as string);
      
      if (response.data && response.data.model) {
        const allMembers = response.data.model;
        setMembers(allMembers);
        
        // Separar os membros entre admins e membros regulares
        const admins = allMembers.filter((member: { isAdmin: any; }) => member.isAdmin);
        const regular = allMembers.filter((member: { isAdmin: any; }) => !member.isAdmin);
        
        setAdminMembers(admins);
        setRegularMembers(regular);
        
        // Verificar se o usuário atual é administrador
        const currentUser = allMembers.find(
          (member: FamilyMemberResponse) => member.userEmail === userEmail
        );
        
        // Atualizando explicitamente o status de administrador do usuário atual
        const isAdmin = currentUser?.isAdmin || false;
        setIsUserAdmin(isAdmin);
      } else {
        setMembers([]);
        setAdminMembers([]);
        setRegularMembers([]);
        setIsUserAdmin(false);
      }
    } catch (error) {
      console.error("Erro ao buscar membros:", error);
      ErrorAlertComponent("Erro", "Não foi possível carregar os membros do grupo");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userEmail, id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMembers();
  };

  const toggleSection = (section: SectionType) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSectionBackgroundColor = (type: SectionType) => {
    return type === "ADMIN" ? colors.primary : colors.statusInProgress;
  };

  const renderSectionHeader = (type: SectionType, title: string, count: number) => {
    const backgroundColor = getSectionBackgroundColor(type);
    
    return (
      <TouchableOpacity
        style={[
          styles.sectionHeader, 
          { backgroundColor },
          shadows.medium
        ]}
        onPress={() => toggleSection(type)}
        activeOpacity={0.8}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        </View>
        <FontAwesomeIcon
          icon={expandedSections[type] ? faChevronUp : faChevronDown}
          color={colors.textLight}
          size={16}
        />
      </TouchableOpacity>
    );
  };

  const handleInvite = async () => {
    if (!emailToInvite.trim()) {
      ErrorAlertComponent(
        "Email inválido",
        "Por favor, informe um email válido para convidar."
      );
      return;
    }

    try {
      setInviting(true);
      await links.inviteNewMember({
        familyId: id as string,
        userEmail: userEmail,
        invitedEmail: emailToInvite
      });
      
      // Limpar o campo de email
      setEmailToInvite("");
      
      SuccessAlertComponent(
        "Convite enviado",
        "O convite foi enviado com sucesso!"
      );
      
      fetchMembers();
    } catch (error) {
      ErrorAlertComponent(
        "Erro ao convidar",
        "Não foi possível enviar o convite. Verifique o email e tente novamente."
      );
    } finally {
      setInviting(false);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    const member = members.find(m => m.userId === memberId);
    if (!member) return;
    
    // O alerta agora está no componente MemberCard
    confirmDeleteMember(memberId, member.userEmail);
  };

  const confirmDeleteMember = async (memberId: string, memberEmail: string) => {
    try {
      // Utilizando a rota deleteFamilyMember que requer o ID da família, email do admin e email do membro a ser removido
      await links.deleteFamilyMember(id as string, userEmail, memberEmail);
      
      SuccessAlertComponent(
        "Membro removido",
        "O membro foi removido do grupo com sucesso!"
      );
      
      // Atualiza a lista de membros após remover
      fetchMembers();
    } catch (error) {
      ErrorAlertComponent(
        "Erro ao remover",
        "Não foi possível remover o membro do grupo."
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <View style={styles.contentContainer}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando membros...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const hasMembers = members.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.contentContainer}>
        <View style={styles.pageTitle}>
          <Text style={styles.pageTitle}>Membros do Grupo - {name as string}</Text>
        </View>

        {isUserAdmin && (
          <View style={styles.inviteContainer}>
            <Text style={styles.inviteTitle}>Convidar Novo Membro</Text>
            <View style={styles.inviteInputContainer}>
              <FontAwesomeIcon icon={faEnvelope} size={16} color={colors.textSecondary} />
              <TextInput
                style={styles.inviteInput}
                placeholder="Digite o email do usuário"
                value={emailToInvite}
                onChangeText={setEmailToInvite}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              style={[
                styles.inviteButton,
                (!emailToInvite.trim() || inviting) && styles.disabledButton
              ]}
              onPress={handleInvite}
              disabled={inviting || !emailToInvite.trim()}
            >
              {inviting ? (
                <ActivityIndicator size="small" color={colors.textLight} />
              ) : (
                <>
                  <FontAwesomeIcon icon={faUserPlus} size={16} color={colors.textLight} />
                  <Text style={styles.inviteButtonText}>Enviar Convite</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {!hasMembers ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Não há membros neste grupo.
            </Text>
            {isUserAdmin && (
              <Text style={styles.emptySubtext}>
                Use o formulário acima para convidar novos membros.
              </Text>
            )}
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          >
            {adminMembers.length > 0 && (
              <View style={styles.section}>
                {renderSectionHeader("ADMIN", "Administradores", adminMembers.length)}
                
                {expandedSections.ADMIN && (
                  <View style={styles.sectionContent}>
                    {adminMembers.map((member) => (
                      <MemberCard
                        key={member.userId}
                        member={member}
                        isUserAdmin={isUserAdmin}
                        onDelete={handleDeleteMember}
                      />
                    ))}
                  </View>
                )}
              </View>
            )}

            {regularMembers.length > 0 && (
              <View style={styles.section}>
                {renderSectionHeader("MEMBERS", "Membros", regularMembers.length)}
                
                {expandedSections.MEMBERS && (
                  <View style={styles.sectionContent}>
                    {regularMembers.map((member) => (
                      <MemberCard
                        key={member.userId}
                        member={member}
                        isUserAdmin={isUserAdmin}
                        onDelete={handleDeleteMember}
                      />
                    ))}
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
    padding: spacing.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.medium,
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.small,
  },
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
    textAlign: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
    ...shadows.small,
  },
  inviteContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    ...shadows.small,
  },
  inviteTitle: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semiBold as any,
    color: colors.textPrimary,
    marginBottom: spacing.medium,
  },
  inviteInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.medium,
    marginBottom: spacing.medium,
  },
  inviteInput: {
    flex: 1,
    fontSize: fonts.size.medium,
    color: colors.textPrimary,
    marginLeft: spacing.small,
  },
  inviteButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.medium,
  },
  disabledButton: {
    opacity: 0.7,
  },
  inviteButtonText: {
    color: colors.textLight,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.medium as any,
    marginLeft: spacing.small,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.large,
  },
  section: {
    marginBottom: spacing.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.medium,
    borderRadius: 10,
    marginBottom: spacing.small,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semiBold as any,
    color: colors.textLight,
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.small,
  },
  countText: {
    color: colors.textLight,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.bold as any,
  },
  sectionContent: {
    paddingHorizontal: spacing.small,
  },
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