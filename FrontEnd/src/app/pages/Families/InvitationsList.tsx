import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, fonts, shadows, spacing } from '@/src/globalCSS';
import { useRouter } from 'expo-router';
import { links } from '@/src/api/api';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCheck, faXmark, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ErrorAlertComponent, SuccessAlertComponent } from '@/src/app/components/Alerts/AlertComponent';
import { AuthContext } from '@/src/contexts/AuthContext';
import { InvitationResponse, InvitationsResponseData } from '@/src/types/Family/Family';
import Header from "@/src/app/components/header/Header";

export default function InvitationsList() {
  const [invitations, setInvitations] = useState<InvitationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  
  const router = useRouter();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const userEmail = authContext.user?.name;
      
      if (!userEmail) {
        ErrorAlertComponent('Erro', 'Usuário não autenticado');
        router.push('/pages/auth/Login');
        return;
      }
      
      const response = await links.getInvitationsReceived(userEmail);
      const data = response.data as InvitationsResponseData;
      setInvitations(data.model || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = (invitation: InvitationResponse) => {
    Alert.alert(
      'Aceitar convite',
      `Deseja aceitar o convite para o grupo ${invitation.family.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Aceitar', 
          onPress: () => respondToInvitation(invitation.id, true),
        }
      ]
    );
  };

  const handleReject = (invitation: InvitationResponse) => {
    Alert.alert(
      'Recusar convite',
      `Deseja recusar o convite para o grupo ${invitation.family.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Recusar', 
          style: 'destructive',
          onPress: () => respondToInvitation(invitation.id, false),
        }
      ]
    );
  };

  const respondToInvitation = async (invitationId: string, accept: boolean) => {
    try {
      setResponding(true);
      if (accept) {
        await links.acceptInvitation(invitationId);
      } else {
        await links.deleteInvitation(invitationId);
      }
      
      // Atualizar a lista de convites
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      
      SuccessAlertComponent(
        accept ? 'Convite aceito' : 'Convite recusado',
        accept ? 'Você agora é membro do grupo!' : 'Convite recusado com sucesso'
      );

      // Se aceitou o convite, atualizar a lista de grupos
      if (accept) {
        // Aguardar um pouco antes de redirecionar para a página de grupos
        setTimeout(() => {
          router.push('/pages/tabs/MyFamily/MyFamily');
        }, 1000);
      }
    } catch (error) {
    } finally {
      setResponding(false);
    }
  };
  
  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.contentContainer}>
          <Text style={styles.pageTitle}>Convites Recebidos</Text>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando convites...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentContainer}>
        <Text style={styles.pageTitle}>Convites Recebidos</Text>
        
        {invitations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesomeIcon icon={faEnvelope} size={50} color={colors.textSecondary} style={styles.emptyIcon} />
            <Text style={styles.emptyText}>Nenhum convite pendente</Text>
            <Text style={styles.emptySubtext}>Quando alguém te convidar para um grupo, o convite aparecerá aqui</Text>
          </View>
        ) : (
          <FlatList
            data={invitations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.invitationCard}>
                <View style={styles.invitationHeader}>
                  <Text style={styles.groupName}>{item.family.name}</Text>
                </View>
                
                <View style={styles.invitationDetails}>
                  <Text style={styles.invitedByText}>
                    Convidado por: <Text style={styles.invitedByName}>{item.user.name}</Text>
                  </Text>
                  <Text style={styles.emailText}>
                    Email: <Text style={styles.emailValue}>{item.user.email}</Text>
                  </Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleAccept(item)}
                    disabled={responding}
                  >
                    {responding ? (
                      <ActivityIndicator size="small" color={colors.textLight} />
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheck} size={14} color={colors.textLight} />
                        <Text style={styles.actionButtonText}>Aceitar</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleReject(item)}
                    disabled={responding}
                  >
                    {responding ? (
                      <ActivityIndicator size="small" color={colors.textLight} />
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faXmark} size={14} color={colors.textLight} />
                        <Text style={styles.actionButtonText}>Recusar</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
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
  pageTitle: {
    fontSize: fonts.size.xxl,
    fontWeight: fonts.weight.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.medium,
    paddingHorizontal: spacing.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.small,
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.large,
  },
  emptyIcon: {
    marginBottom: spacing.medium,
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
  listContent: {
    paddingBottom: spacing.large,
  },
  invitationCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    ...shadows.medium,
  },
  invitationHeader: {
    marginBottom: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingBottom: spacing.small,
  },
  groupName: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.bold as any,
    color: colors.textPrimary,
  },
  invitationDetails: {
    marginBottom: spacing.medium,
  },
  invitedByText: {
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
    marginBottom: spacing.small,
  },
  invitedByName: {
    fontWeight: fonts.weight.semiBold as any,
    color: colors.textPrimary,
  },
  emailText: {
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
  },
  emailValue: {
    fontWeight: fonts.weight.semiBold as any,
    color: colors.textPrimary,
  },
  dateText: {
    fontSize: fonts.size.small,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  acceptButton: {
    backgroundColor: colors.statusDone,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.textLight,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.medium as any,
    marginLeft: spacing.small,
  },
}); 