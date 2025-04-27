import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, fonts, shadows, spacing } from '@/src/globalCSS';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { links } from '@/src/api/api';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faEnvelope, faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ErrorAlertComponent, SuccessAlertComponent } from '@/src/app/components/Alerts/AlertComponent';
import { AuthContext } from '@/src/contexts/AuthContext';
import { InvitationResponse, InvitationsResponseData } from '@/src/types/Family/Family';

export default function InviteMembers() {
  const [email, setEmail] = useState('');
  const [pendingInvitations, setPendingInvitations] = useState<InvitationResponse[]>([]);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const params = useLocalSearchParams();
  const familyId = params.id as string;
  const familyName = params.name as string;
  
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (!familyId) {
      ErrorAlertComponent('Erro', 'ID do grupo não encontrado');
      router.back();
      return;
    }
    
    loadData();
  }, [familyId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar convites pendentes
      const invitationsResponse = await links.getFamilyInvitationsSent(familyId);
      const data = invitationsResponse.data as InvitationsResponseData;
      setPendingInvitations(data.model || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!email.trim()) {
      ErrorAlertComponent('Erro', 'Digite um email válido');
      return;
    }

    try {
      setInviteLoading(true);
      
      await links.inviteNewMember({
        familyId,
        userEmail: authContext.user?.name || '',
        invitedEmail: email
      });
      
      // Atualizar a lista de convites pendentes
      const response = await links.getFamilyInvitationsSent(familyId);
      const data = response.data as InvitationsResponseData;
      setPendingInvitations(data.model || []);
      
      // Limpar o campo de email
      setEmail('');
      
      SuccessAlertComponent(
        'Convite enviado',
        `Convite enviado para ${email} com sucesso!`
      );
    } catch (error) {
    } finally {
      setInviteLoading(false);
    }
  };

  const handleCancelInvitation = (invitation: InvitationResponse) => {
    Alert.alert(
      'Cancelar convite',
      `Tem certeza que deseja cancelar o convite para ${invitation.invitedUser.email}?`,
      [
        { text: 'Não', style: 'cancel' },
        { 
          text: 'Sim', 
          style: 'destructive',
          onPress: async () => {
            try {
              await links.deleteInvitation(invitation.id);
              
              // Atualizar a lista de convites pendentes
              setPendingInvitations(pendingInvitations.filter(inv => inv.id !== invitation.id));
              
              SuccessAlertComponent(
                'Convite cancelado',
                'O convite foi cancelado com sucesso'
              );
            } catch (error) {
            }
          }
        }
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Convidar Membros</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Convidar Membros</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.groupName}>{familyName}</Text>
        
        <View style={styles.inviteSection}>
          <Text style={styles.sectionTitle}>Convidar para o grupo</Text>
          <View style={styles.emailContainer}>
            <FontAwesomeIcon icon={faEnvelope} size={16} color={colors.textSecondary} />
            <TextInput
              style={styles.emailInput}
              placeholder="Digite o email do usuário"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.inviteButton}
            onPress={handleInvite}
            disabled={inviteLoading || !email.trim()}
          >
            {inviteLoading ? (
              <ActivityIndicator size="small" color={colors.textLight} />
            ) : (
              <>
                <FontAwesomeIcon icon={faUserPlus} size={16} color={colors.textLight} />
                <Text style={styles.inviteButtonText}>Enviar Convite</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.invitationsSection}>
          <Text style={styles.sectionTitle}>Convites Pendentes</Text>
          
          {pendingInvitations.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum convite pendente</Text>
          ) : (
            <FlatList
              data={pendingInvitations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.invitationItem}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.invitedUser.name}</Text>
                    <Text style={styles.userEmail}>{item.invitedUser.email}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelInvitation(item)}
                  >
                    <FontAwesomeIcon icon={faXmark} size={12} color={colors.error} />
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semiBold as any,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: spacing.medium,
  },
  groupName: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.medium,
  },
  inviteSection: {
    marginBottom: spacing.large,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.medium,
    ...shadows.small,
  },
  sectionTitle: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semiBold as any,
    color: colors.textPrimary,
    marginBottom: spacing.medium,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.medium,
    marginBottom: spacing.medium,
  },
  emailInput: {
    flex: 1,
    fontSize: fonts.size.medium,
    color: colors.textPrimary,
    marginLeft: spacing.small,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.medium,
  },
  inviteButtonText: {
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.medium as any,
    color: colors.textLight,
    marginLeft: spacing.small,
  },
  invitationsSection: {
    flex: 1,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.medium as any,
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: fonts.size.small,
    color: colors.textSecondary,
  },
  invitationDate: {
    fontSize: fonts.size.xs,
    color: colors.textSecondary,
  },
  invitationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.medium,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: spacing.small,
    ...shadows.small,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: fonts.size.small,
    color: colors.error,
    marginLeft: spacing.xs,
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
  emptyText: {
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.large,
  },
}); 