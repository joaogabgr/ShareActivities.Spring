import React, { useState, useContext, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { links } from "@/src/api/api";
import { ErrorAlertComponent, SuccessAlertComponent } from "@/src/app/components/Alerts/AlertComponent";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronDown, faChevronUp, faPlus, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import FamilyCard from "@/src/app/components/FamilyComponent/FamilyCard";
import { AuthContext } from "@/src/contexts/AuthContext";
import { Family as FamilyType } from "@/src/types/Family/Family";
import Header from "@/src/app/components/header/Header";

interface ApiFamily {
  family: {
    id: string;
    name: string;
    description: string;
  };
  isAdmin: boolean;
}

type SectionType = "OWNED" | "MEMBER";

type ExpandedSections = {
  [key in SectionType]: boolean;
};

export default function Families() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [ownedFamilies, setOwnedFamilies] = useState<ApiFamily[]>([]);
  const [memberFamilies, setMemberFamilies] = useState<ApiFamily[]>([]);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    OWNED: true,
    MEMBER: true
  });
  const [dataLoaded, setDataLoaded] = useState(false);
  const updatedProcessed = useRef(false);
  
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const params = useLocalSearchParams();

  const loadUserData = async () => {
    try {
      const email = authContext.user?.name;
      if (email) {
        setUserEmail(email);
        await fetchFamilies(email);
        setDataLoaded(true);
      } else {
        ErrorAlertComponent("Sessão expirada", "Por favor, faça login novamente.");
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!dataLoaded) {
        loadUserData();
      }

      // Verifica se precisa atualizar os dados baseado no parâmetro da rota
      const shouldUpdate = params.updated === "true";
      if (shouldUpdate && userEmail && !updatedProcessed.current) {
        console.log("Atualizando famílias...");
        updatedProcessed.current = true;
        fetchFamilies(userEmail);
      } else if (params.updated === "false") {
        updatedProcessed.current = false;
      }

      return () => {
        // Cleanup function
        updatedProcessed.current = false;
      };
    }, [dataLoaded, params.updated, userEmail])
  );

  const fetchFamilies = async (email: string) => {
    try {
      setLoading(true);
      const response = await links.getListFamilies(email);
      const families: ApiFamily[] = response.data.model;

      // Separar as famílias entre as que o usuário é dono e as que é apenas membro
      const owned = families.filter((family: ApiFamily) => family.isAdmin);
      const member = families.filter((family: ApiFamily) => !family.isAdmin);

      setOwnedFamilies(owned);
      setMemberFamilies(member);
    } catch (error) {
      console.error("Erro ao buscar famílias:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleSection = (section: SectionType) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Função para converter ApiFamily para o formato compatível com FamilyCard
  const mapToFamilyCard = (apiFamily: ApiFamily): FamilyType => {
    return {
      id: apiFamily.family.id,
      name: apiFamily.family.name,
      description: apiFamily.family.description,
      isOwner: apiFamily.isAdmin,
    };
  };

  const handleRefresh = () => {
    setRefreshing(true);
    if (userEmail) {
      fetchFamilies(userEmail);
    } else {
      setRefreshing(false);
    }
  };

  // Função para remover uma família após sua exclusão
  const handleDeleteFamily = (id: string) => {
    // Atualiza o estado local removendo a família excluída
    setOwnedFamilies(prevFamilies => 
      prevFamilies.filter(family => family.family.id !== id)
    );
    
    // Exibe mensagem de sucesso
    SuccessAlertComponent('Sucesso', 'Grupo excluído com sucesso!');
  };

  const handleCreateFamily = () => {
    router.push({
      pathname: "/pages/Families/CreateFamily", 
      params: { needsUpdate: "true" }
    });
  };

  const handleEditFamily = (id: string) => {
    router.push({
      pathname: "/pages/Families/EditFamily",
      params: { id, needsUpdate: "true" }
    });
  };

  const handleViewTasks = (id: string) => {
    const family = [...ownedFamilies, ...memberFamilies].find(f => f.family.id === id);
    if (family) {
      router.push({
        pathname: "/pages/tabs/ToDo/ToDo",
        params: { 
          familyId: id,
          familyName: family.family.name
        }
      });
    }
  };

  const handleInviteMembers = (id: string, name: string) => {
    router.push({
      pathname: "/pages/Families/InviteMembers",
      params: { id, name, refresh: "false" }
    });
  };

  const handleViewMembers = (id: string, name: string) => {
    router.push({
      pathname: "/pages/Families/Members",
      params: { id, name, refresh: "false" }
    });
  };

  const handleChat = (id: string) => {
    const family = [...ownedFamilies, ...memberFamilies].find(f => f.family.id === id);
    if (family) {
      router.push({
        pathname: "/pages/Families/Chat",
        params: { id, name: family.family.name, refresh: "false" }
      });
    }
  };

  const getSectionBackgroundColor = (type: SectionType) => {
    return type === "OWNED" ? colors.primary : colors.statusInProgress;
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

  const navigateToInvitations = () => {
    router.push({
      pathname: '/pages/Families/InvitationsList',
      params: { refresh: "false" }
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Meus Grupos</Text>
            <TouchableOpacity 
              style={styles.invitationsButton}
              onPress={navigateToInvitations}
            >
              <FontAwesomeIcon icon={faEnvelope} size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando grupos...</Text>
          </View>
        </View>
      </View>
    );
  }

  const hasGroups = ownedFamilies.length > 0 || memberFamilies.length > 0;

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Meus Grupos</Text>
          <TouchableOpacity 
            style={styles.invitationsButton}
            onPress={navigateToInvitations}
          >
            <FontAwesomeIcon icon={faEnvelope} size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {!hasGroups ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Você não participa de nenhum grupo ainda.
            </Text>
            <Text style={styles.emptySubtext}>
              Toque no botão + para criar um novo grupo.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          >
            {ownedFamilies.length > 0 && (
              <View style={styles.section}>
                {renderSectionHeader("OWNED", "Meus Grupos", ownedFamilies.length)}
                
                {expandedSections.OWNED && (
                  <View style={styles.sectionContent}>
                    {ownedFamilies.map((family) => (
                      <FamilyCard
                        key={family.family.id}
                        {...mapToFamilyCard(family)}
                        onEdit={handleEditFamily}
                        onViewTasks={handleViewTasks}
                        onChat={handleChat}
                        onInvite={handleInviteMembers}
                        onViewMembers={handleViewMembers}
                        onDelete={handleDeleteFamily}
                      />
                    ))}
                  </View>
                )}
              </View>
            )}

            {memberFamilies.length > 0 && (
              <View style={styles.section}>
                {renderSectionHeader("MEMBER", "Grupos que Participo", memberFamilies.length)}
                
                {expandedSections.MEMBER && (
                  <View style={styles.sectionContent}>
                    {memberFamilies.map((family) => (
                      <FamilyCard
                        key={family.family.id}
                        {...mapToFamilyCard(family)}
                        onViewTasks={handleViewTasks}
                        onChat={handleChat}
                        onViewMembers={handleViewMembers}
                      />
                    ))}
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Botão flutuante de adicionar */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleCreateFamily}
        activeOpacity={0.8}
      >
        <FontAwesomeIcon icon={faPlus} size={24} color={colors.textLight} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  pageTitle: {
    fontSize: fonts.size.xxl,
    fontWeight: fonts.weight.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.medium,
    paddingHorizontal: spacing.medium,
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
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
  },
  invitationsButton: {
    padding: spacing.small,
    borderRadius: 50,
    backgroundColor: colors.surface,
    ...shadows.small,
  },
}); 