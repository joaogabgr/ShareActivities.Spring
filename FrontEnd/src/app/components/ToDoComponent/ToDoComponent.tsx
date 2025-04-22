import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { ReadActivities } from "@/src/types/Activities/ReadActivities";
import { expireDate, formatDay, formatDayAndHour } from "@/src/utils/formatDayAndHour";
import { Swipeable } from "react-native-gesture-handler";
import { links } from "@/src/api/api";
import { ErrorAlertComponent } from "@/src/app/components/Alerts/AlertComponent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { 
  faEdit, 
  faTrash, 
  faClock, 
  faUser, 
  faInfoCircle, 
  faCalendarAlt, 
  faFlag, 
  faMapMarkerAlt, 
  faRulerHorizontal, 
  faExclamationTriangle,
  faImage,
  faFile,
  faLink,
  faPaperclip,
  faTimes,
  faExternalLinkAlt,
  faDownload,
  faCalendarPlus,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { useLocation } from "@/src/contexts/LocationContext";
import { calcularDistancia, extrairCoordenadas, formatarDistancia } from "@/src/utils/distanceUtils";
import * as Calendar from 'expo-calendar';

interface ToDoComponentProps extends ReadActivities {
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onStatusChange: () => void;
  familyName?: string;
}

export default function ToDoComponent(props: ToDoComponentProps) {
  const { localizacaoUsuario, atualizarLocalizacao } = useLocation();
  const [distancia, setDistancia] = useState<number | null>(null);
  const [proximidade, setProximidade] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarPermission, setCalendarPermission] = useState<boolean>(false);

  // Calcula a distância quando a localização do usuário muda ou quando o componente é montado
  useEffect(() => {
    calcularDistanciaAtividade();
  }, [localizacaoUsuario, props.latLog]);

  // Efeito para mostrar alerta quando está próximo
  useEffect(() => {
    if (proximidade && props.status !== 'DONE') {
      Alert.alert(
        "Você está próximo!",
        `Você está a menos de 100m da atividade: ${props.name}`,
        [{ text: "OK", onPress: () => {} }]
      );
    }
  }, [proximidade, props.name]);

  useEffect(() => {
    checkCalendarPermission();
  }, []);

  const checkCalendarPermission = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    setCalendarPermission(status === 'granted');
  };

  const vincularAoCalendario = async () => {
    try {
      if (!calendarPermission) {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão necessária', 'Por favor, permita o acesso ao calendário para vincular a atividade.');
          return;
        }
        setCalendarPermission(true);
      }

      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      
      const detalhesEvento = [
        // Informações básicas
        '📋 Informações da Atividade:',
        `• Nome: ${props.name}`,
        `• Tipo: ${props.type}`,
        `• Status: ${getStatus(props.status)}`,
        `• Prioridade: ${getPriority(props.priority)}`,
        props.familyName ? `• Grupo: ${props.familyName}` : '',
        
        // Descrição
        '\n📝 Descrição:',
        props.description || 'Sem descrição',
        
        // Localização
        props.location ? '\n📍 Localização:' : '',
        props.location ? `• ${props.location}` : '',
        
        // Notas
        props.notes ? '\n📌 Notas:' : '',
        props.notes ? `• ${props.notes}` : '',
        
        // Anexos
        '\n📎 Anexos:',
        props.photoUrl ? `• Foto: ${props.photoUrl}` : '',
        props.documentUrl ? `• Documento: ${props.documentName || 'Documento'} - ${props.documentUrl}` : '',
        props.linkUrl ? `• Link: ${props.linkUrl}` : '',
        (!props.photoUrl && !props.documentUrl && !props.linkUrl) ? '• Nenhum anexo' : '',
      ].filter(Boolean).join('\n');

      // Usar a data de expiração como data de início se existir
      const startDate = props.dateExpire ? new Date(props.dateExpire) : new Date(props.dateCreated);
      if (isNaN(startDate.getTime())) {
        throw new Error('Data de início inválida');
      }

      // Calcular a data de término (1 hora depois da data de início)
      const endDate = new Date(startDate.getTime() + 3600000);

      // Configurar a repetição se houver data de recuperação
      let recurrenceRule;
      if (props.dayForRecover) {
        const recoverDate = new Date(props.dayForRecover);
        if (!isNaN(recoverDate.getTime())) {
          // Calcular o número de dias entre a data de início e a data de recuperação
          const diffTime = recoverDate.getTime() - startDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays > 0) {
            recurrenceRule = {
              frequency: Calendar.Frequency.DAILY,
              interval: diffDays,
              endDate: recoverDate,
            };
          }
        }
      }

      const evento = {
        title: props.name,
        startDate: startDate,
        endDate: endDate,
        notes: detalhesEvento,
        location: props.location,
        alarms: [{ relativeOffset: -60 }], // Alarme 1 hora antes
        recurrenceRule: recurrenceRule,
      };

      const eventoId = await Calendar.createEventAsync(defaultCalendar.id, evento);
      
      Alert.alert(
        'Sucesso',
        'Atividade vinculada ao calendário com sucesso!' + (recurrenceRule ? '' : ''),
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erro ao vincular ao calendário:', error);
      Alert.alert(
        'Erro',
        'Não foi possível vincular a atividade ao calendário. Por favor, verifique se as datas estão corretas e tente novamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const calcularDistanciaAtividade = () => {
    if (!localizacaoUsuario || !props.latLog) {
      setDistancia(null);
      return;
    }

    const coordenadas = extrairCoordenadas(props.latLog);
    if (!coordenadas) {
      setDistancia(null);
      return;
    }

    const [lat, lng] = coordenadas;
    const distanciaCalculada = calcularDistancia(
      localizacaoUsuario.latitude,
      localizacaoUsuario.longitude,
      lat,
      lng
    );

    setDistancia(distanciaCalculada);
    
    // Verifica se está a menos de 100 metros
    setProximidade(distanciaCalculada < 100);
  };

  const renderRightActions = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => props.onEdit(props.id)}
        >
          <FontAwesomeIcon icon={faEdit} size={20} color={colors.textLight} />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => props.onDelete(props.id)}
        >
          <FontAwesomeIcon icon={faTrash} size={20} color={colors.textLight} />
          <Text style={styles.actionText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLeftActions = () => {
    const getAvailableStatuses = () => {
      switch (props.status) {
        case "DONE":
          return [
            { label: "Pendente", value: "PENDING", color: colors.statusPending },
            {
              label: "Em Progresso",
              value: "IN_PROGRESS",
              color: colors.statusInProgress,
            },
          ];
        case "IN_PROGRESS":
          return [
            { label: "Pendente", value: "PENDING", color: colors.statusPending },
            { label: "Concluído", value: "DONE", color: colors.statusDone },
          ];
        case "PENDING":
          return [
            {
              label: "Em Progresso",
              value: "IN_PROGRESS",
              color: colors.statusInProgress,
            },
            { label: "Concluído", value: "DONE", color: colors.statusDone },
          ];
        default:
          return [];
      }
    };

    const handleStatusChange = async (newStatus: string) => {
      try {
        await links.updateActivityStatus(props.id, newStatus);
        props.onStatusChange();
      } catch (error) {
      }
    };

    return (
      <View style={{ flexDirection: "row" }}>
        {getAvailableStatuses().map((statusOption) => (
          <TouchableOpacity
            key={statusOption.value}
            style={[
              styles.actionButton,
              { backgroundColor: statusOption.color },
            ]}
            onPress={() => handleStatusChange(statusOption.value)}
          >
            <Text style={styles.actionText}>{statusOption.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getStatus = (status: string) => {
    switch (status) {
      case "DONE":
        return "Concluído";
      case "IN_PROGRESS":
        return "Em Progresso";
      case "PENDING":
        return "Pendente";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE":
        return colors.statusDone;
      case "IN_PROGRESS":
        return colors.statusInProgress;
      case "PENDING":
        return colors.statusPending;
      default:
        return colors.primary;
    }
  };

  const getExpirationStatus = () => {
    if (!props.dateExpire) return 'normal';
    
    const now = new Date();
    const expireDate = new Date(props.dateExpire);
    expireDate.setHours(expireDate.getHours());

    // Se já venceu
    if (now > expireDate) {
      return 'expired';
    }

    // Calcula a diferença em dias
    const diffTime = expireDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Se está a 3 dias ou menos de vencer
    if (diffDays <= 3) {
      return 'warning';
    }

    return 'normal';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return colors.priorityHigh;
      case "MEDIUM":
        return colors.priorityMedium;
      case "LOW":
        return colors.priorityLow;
      default:
        return colors.textSecondary;
    }
  };

  const containerStyle = () => {
    const baseStyle = [styles.container, shadows.small];
    
    // Se estiver próximo, adiciona a borda de proximidade
    if (proximidade && props.status !== 'DONE') {
      return [...baseStyle, styles.containerProximo];
    }
    
    // Se a atividade estiver concluída, retorna o estilo base sem borda
    if (props.status === "DONE") {
      return baseStyle;
    }

    const status = getExpirationStatus();
    switch (status) {
      case 'expired':
        return [...baseStyle, styles.containerExpired];
      case 'warning':
        return [...baseStyle, styles.containerWarning];
      default:
        return baseStyle;
    }
  };

  const getPriority = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "Alta";
      case "MEDIUM":
        return "Média";
      case "LOW":
        return "Baixa";
      default:
        return priority;
    }
  };

  // Verifica se há anexos disponíveis
  const hasAttachments = props.photoUrl || props.documentUrl || props.linkUrl;

  // Função para abrir URL
  const openUrl = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) => {
        Alert.alert("Erro", "Não foi possível abrir o link: " + err.message);
      });
    }
  };

  return (
    <>
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        overshootRight={false}
        overshootLeft={false}
      >
        <View style={containerStyle()}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{props.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(props.status) }]}>
                <Text style={styles.statusText}>{getStatus(props.status)}</Text>
              </View>
              
              {/* Indicador de proximidade */}
              {proximidade && props.status !== 'DONE' && (
                <View style={styles.proximidadeBadge}>
                  <FontAwesomeIcon icon={faExclamationTriangle} size={10} color={colors.textLight} />
                  <Text style={styles.proximidadeText}>Próximo</Text>
                </View>
              )}
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(props.priority) }]}>
              <Text style={styles.priorityText}>{getPriority(props.priority)}</Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.description}>{props.description}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerItem}>
              <FontAwesomeIcon icon={faUser} size={12} color={colors.textSecondary} />
              <Text style={styles.footerText}>{props.userName}</Text>
            </View>
            
            <View style={styles.footerItem}>
              <FontAwesomeIcon icon={faCalendarAlt} size={12} color={colors.textSecondary} />
              <Text style={styles.footerText}>{formatDayAndHour(props.dateCreated)}</Text>
            </View>
            
            {props.dateExpire && props.status !== "DONE" && (
              <View style={styles.footerItem}>
                <FontAwesomeIcon 
                  icon={faClock} 
                  size={12} 
                  color={getExpirationStatus() === 'expired' ? colors.error : 
                         getExpirationStatus() === 'warning' ? colors.accent : 
                         colors.textSecondary} 
                />
                <Text style={[
                  styles.footerText,
                  getExpirationStatus() === 'expired' ? styles.textExpired : 
                  getExpirationStatus() === 'warning' ? styles.textWarning : {}
                ]}>
                  {expireDate(props.dateExpire)}
                </Text>
              </View>
            )}

            {props.dayForRecover && (
              <View style={styles.footerItem}>
                <FontAwesomeIcon icon={faFlag} size={12} color={colors.textSecondary} />
                <Text style={styles.footerText}>{formatDay(props.dayForRecover)}</Text>
              </View>
              )
            }

            {props.location && (
              <View style={styles.footerItem}>
                <FontAwesomeIcon icon={faMapMarkerAlt} size={12} color={colors.textSecondary} />
                <Text style={styles.footerText}>{props.location}</Text>
              </View>
              )
            }
            
            {/* Mostrar distância se disponível */}
            {distancia !== null && (
              <View style={styles.footerItem}>
                <FontAwesomeIcon 
                  icon={faRulerHorizontal} 
                  size={12} 
                  color={proximidade ? colors.accent : colors.textSecondary} 
                />
                <Text style={[
                  styles.footerText,
                  proximidade ? styles.textWarning : {}
                ]}>
                  Distância: {formatarDistancia(distancia)}
                </Text>
              </View>
            )}

            {props.notes && (
              <View style={styles.footerItem}>
                <FontAwesomeIcon icon={faInfoCircle} size={12} color={colors.textSecondary} />
                <Text style={styles.footerText}>{props.notes}</Text>
              </View>
              )
            }
            
            <View style={styles.footerItem}>
              <FontAwesomeIcon icon={faInfoCircle} size={12} color={colors.textSecondary} />
              <Text style={styles.footerText}>{props.type}</Text>
            </View>

            {/* Botão para vincular ao calendário */}
            <TouchableOpacity 
              style={styles.calendarButton}
              onPress={vincularAoCalendario}
            >
              <FontAwesomeIcon icon={faCalendarPlus} size={14} color={colors.primary} />
              <Text style={styles.calendarButtonText}>Vincular ao Calendário</Text>
            </TouchableOpacity>

            {/* Botão para abrir modal se houver anexos */}
            {hasAttachments && (
              <TouchableOpacity 
                style={styles.attachmentsButton}
                onPress={() => setModalVisible(true)}
              >
                <FontAwesomeIcon icon={faPaperclip} size={14} color={colors.primary} />
                <Text style={styles.attachmentsButtonText}>Ver anexos</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Swipeable>

      {/* Modal de Anexos */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Anexos da Atividade</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesomeIcon icon={faTimes} size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Foto */}
              {props.photoUrl && (
                <View style={styles.attachmentItem}>
                  <View style={styles.attachmentHeader}>
                    <FontAwesomeIcon icon={faImage} size={18} color={colors.primary} />
                    <Text style={styles.attachmentLabel}>
                      {"Imagem da atividade"}
                    </Text>
                  </View>
                  <View style={styles.photoContainer}>
                    <Image
                      source={{ uri: props.photoUrl }}
                      style={styles.attachmentPhoto}
                      resizeMode="cover"
                    />
                  </View>
                  <TouchableOpacity 
                    style={styles.attachmentAction}
                    onPress={() => openUrl(props.photoUrl || "")}
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} size={14} color={colors.primary} />
                    <Text style={styles.attachmentActionText}>Abrir imagem</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Documento */}
              {props.documentUrl && (
                <View style={styles.attachmentItem}>
                  <View style={styles.attachmentHeader}>
                    <FontAwesomeIcon icon={faFile} size={18} color={colors.primary} />
                    <Text style={styles.attachmentLabel}>
                      {"Documento da atividade"}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.documentButton}
                    onPress={() => openUrl(props.documentUrl || "")}
                  >
                    <FontAwesomeIcon icon={faDownload} size={16} color={colors.primary} />
                    <Text style={styles.documentText}>Abrir documento</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Link */}
              {props.linkUrl && (
                <View style={styles.attachmentItem}>
                  <View style={styles.attachmentHeader}>
                    <FontAwesomeIcon icon={faLink} size={18} color={colors.primary} />
                    <Text style={styles.attachmentLabel}>Link da atividade</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={() => openUrl(props.linkUrl || "")}
                  >
                    <Text style={styles.linkText} numberOfLines={1} ellipsizeMode="middle">
                      {props.linkUrl}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Mensagem se não houver anexos */}
              {!props.photoUrl && !props.documentUrl && !props.linkUrl && (
                <Text style={styles.noAttachmentsText}>
                  Esta atividade não possui anexos.
                </Text>
              )}
            </ScrollView>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.medium,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  containerWarning: {
    borderLeftColor: colors.accent,
  },
  containerExpired: {
    borderLeftColor: colors.error,
  },
  containerProximo: {
    borderLeftColor: colors.primary,
    borderLeftWidth: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semiBold as any,
    color: colors.textPrimary,
    marginRight: spacing.small,
    flex: 1,
  },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  statusText: {
    fontSize: fonts.size.xs,
    color: colors.textLight,
    fontWeight: fonts.weight.medium as any,
  },
  proximidadeBadge: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
  },
  proximidadeText: {
    fontSize: fonts.size.xs,
    color: colors.textLight,
    fontWeight: fonts.weight.medium as any,
    marginLeft: 4,
  },
  priorityBadge: {
    borderRadius: 12,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xs,
    marginLeft: spacing.small,
  },
  priorityText: {
    fontSize: fonts.size.xs,
    color: colors.textLight,
    fontWeight: fonts.weight.medium as any,
  },
  content: {
    padding: spacing.medium,
  },
  description: {
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'column',
    padding: spacing.medium,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: spacing.medium,
    marginBottom: spacing.small,
  },
  footerText: {
    fontSize: fonts.size.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  textExpired: {
    color: colors.error,
    fontWeight: fonts.weight.medium as any,
  },
  textWarning: {
    color: colors.accent,
    fontWeight: fonts.weight.medium as any,
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: "90%",
    borderRadius: 12,
    marginHorizontal: 1,
  },
  actionText: {
    color: colors.textLight,
    fontSize: fonts.size.small,
    marginTop: spacing.xs,
    fontWeight: fonts.weight.medium as any,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  refreshButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  refreshButtonText: {
    fontSize: fonts.size.xs,
    color: colors.primary,
    fontWeight: fonts.weight.medium as any,
  },
  attachmentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.small,
    padding: spacing.small,
    backgroundColor: colors.surface,
    borderRadius: 8,
    alignSelf: 'flex-start',
    ...shadows.small,
  },
  attachmentsButtonText: {
    fontSize: fonts.size.small,
    color: colors.primary,
    fontWeight: fonts.weight.medium as any,
    marginLeft: spacing.xs,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    ...shadows.medium,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.primary,
  },
  modalTitle: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semiBold as any,
    color: colors.textLight,
  },
  modalBody: {
    padding: spacing.medium,
    maxHeight: 500,
  },
  closeButton: {
    margin: spacing.medium,
    padding: spacing.medium,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.medium as any,
    color: colors.textLight,
  },
  // Anexos
  attachmentItem: {
    marginBottom: spacing.medium,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    padding: spacing.small,
    backgroundColor: colors.background,
  },
  attachmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.small,
  },
  attachmentLabel: {
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium as any,
    color: colors.textPrimary,
    marginLeft: spacing.small,
  },
  photoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: spacing.small,
  },
  attachmentPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 4,
  },
  attachmentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.small,
    backgroundColor: colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  attachmentActionText: {
    fontSize: fonts.size.small,
    color: colors.primary,
    marginLeft: spacing.small,
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.small,
    backgroundColor: colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  documentText: {
    fontSize: fonts.size.small,
    color: colors.primary,
    marginLeft: spacing.small,
  },
  linkButton: {
    padding: spacing.small,
    backgroundColor: colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  linkText: {
    fontSize: fonts.size.small,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  noAttachmentsText: {
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.large,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.small,
    padding: spacing.small,
    backgroundColor: colors.surface,
    borderRadius: 8,
    alignSelf: 'flex-start',
    ...shadows.small,
  },
  calendarButtonText: {
    fontSize: fonts.size.small,
    color: colors.primary,
    fontWeight: fonts.weight.medium as any,
    marginLeft: spacing.xs,
  },
});
