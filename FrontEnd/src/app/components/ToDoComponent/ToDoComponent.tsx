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
  Animated,
  Easing,
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
  faBell,
  faBellSlash,
  faLocationDot,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "@/src/contexts/LocationContext";
import { calcularDistancia, extrairCoordenadas, formatarDistancia } from "@/src/utils/distanceUtils";
import * as Calendar from 'expo-calendar';
import { AuthContext } from "@/src/contexts/AuthContext";

interface ToDoComponentProps extends ReadActivities {
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onStatusChange: () => void;
  familyName?: string;
  familyId?: string; // Adicionado para uso em atividades de grupo
}

export default function ToDoComponent(props: ToDoComponentProps) {
  const { localizacaoUsuario, atualizarLocalizacao } = useLocation();
  const [distancia, setDistancia] = useState<number | null>(null);
  const [proximidade, setProximidade] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarPermission, setCalendarPermission] = useState<boolean>(false);
  const authContext = useContext(AuthContext);

  // Função auxiliar para converter o warning para booleano
  const isWarningEnabled = () => {
    // Se undefined, retorna false
    if (props.warning === undefined) return false;
    
    // Se for string "false", retorna false
    if (props.warning === "false") return false;
    
    // Se for boolean false, retorna false
    if (props.warning === false) return false;
    
    // Em qualquer outro caso (true, "true", ou qualquer outro valor), retorna true
    return true;
  };

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

      let calendarId;
      if (Platform.OS === 'android') {
        // Buscar um calendário local ou criar um se não existir
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const localCalendar = calendars.find(
          (cal) => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER && cal.allowsModifications
        );
        if (localCalendar) {
          calendarId = localCalendar.id;
        } else {
          // Busca um source válido
          let source = calendars.find(cal => cal.source && cal.source.isLocalAccount)?.source;
          if (!source && calendars.length > 0) {
            source = calendars[0].source;
          }
          const newCalendar = await Calendar.createCalendarAsync({
            title: 'ShareActivities',
            color: '#2196F3',
            entityType: Calendar.EntityTypes.EVENT,
            source: source,
            name: 'ShareActivities',
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
          });
          calendarId = newCalendar;
        }
      } else {
        // iOS: usa o calendário padrão
        const defaultCalendar = await Calendar.getDefaultCalendarAsync();
        calendarId = defaultCalendar.id;
      }

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

      // Usar a data de criação como data de início
      const startDate = new Date(props.dateCreated);
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
              // Usar a data de expiração como data limite se existir
              endDate: props.dateExpire ? new Date(props.dateExpire) : undefined
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

      await Calendar.createEventAsync(calendarId, evento);
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

  // --- MELHORIA UX SWIPE BUTTONS ---
  const SwipeActionButton = ({ style, onPress, icon, text, color }: any) => {
    const [pressed, setPressed] = React.useState(false);
    const scale = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      setPressed(true);
      Animated.timing(scale, {
        toValue: 0.93,
        duration: 90,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }).start();
    };
    const handlePressOut = () => {
      setPressed(false);
      Animated.timing(scale, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }).start();
    };

    return (
      <Animated.View style={{
        transform: [{ scale }],
        width: '100%',
      }}>
        <TouchableOpacity
          style={[
            styles.swipeActionButton,
            { backgroundColor: color },
            style,
            pressed && { opacity: 0.85 },
          ]}
          onPress={onPress}
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <FontAwesomeIcon icon={icon} size={32} color={colors.textLight} style={{ marginBottom: 2 }} />
          <Text style={styles.swipeActionText}>{text}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderRightActions = () => (
    <View style={styles.swipeActionsContainer}>
      <SwipeActionButton
        style={{}}
        color={colors.primary}
        icon={faEdit}
        text="Editar"
        onPress={() => props.onEdit(props.id)}
      />
      <SwipeActionButton
        style={{}}
        color={colors.error}
        icon={faTrash}
        text="Excluir"
        onPress={() => props.onDelete(props.id)}
      />
    </View>
  );

  // Verifica se é uma atividade de grupo
  const isGroupActivity = !!props.familyName || !!props.familyId;
  // Verifica se está concluída e não confirmada
  const canShowConfirmButton = isGroupActivity && props.status === 'DONE' && !props.confirmed;
  // Verifica se já está confirmada
  const isConfirmed = !!props.confirmed;

  // Função para confirmar conclusão
  const handleConfirmDone = async () => {
    try {
      if (!authContext.user?.name) {
        ErrorAlertComponent('Erro', 'Usuário não autenticado.');
        return;
      }
      await links.confirmGroupDone(props.id, authContext.user.name);
      // Atualiza o status local para refletir a confirmação imediatamente
      if (props.onStatusChange) props.onStatusChange();
      setShowConfirmButton(false); // Esconde o botão imediatamente
      setConfirmedLocal(true); // Esconde os swipes imediatamente
    } catch (error) {
      ErrorAlertComponent('Erro', 'Não foi possível confirmar a conclusão.');
    }
  };

  // Estado local para esconder botões após confirmação
  const [showConfirmButton, setShowConfirmButton] = useState(canShowConfirmButton);
  const [confirmedLocal, setConfirmedLocal] = useState(isConfirmed);

  useEffect(() => {
    setShowConfirmButton(canShowConfirmButton);
    setConfirmedLocal(isConfirmed);
  }, [canShowConfirmButton, isConfirmed]);

  const renderLeftActions = () => {
    const getAvailableStatuses = () => {
      switch (props.status) {
        case "DONE":
          return [
            { label: "Pendente", value: "PENDING", color: colors.statusPending, icon: faExclamationTriangle },
            { label: "Em Progresso", value: "IN_PROGRESS", color: colors.statusInProgress, icon: faClock },
          ];
        case "IN_PROGRESS":
          return [
            { label: "Pendente", value: "PENDING", color: colors.statusPending, icon: faExclamationTriangle },
            { label: "Concluído", value: "DONE", color: colors.statusDone, icon: faCheck },
          ];
        case "PENDING":
          return [
            { label: "Em Progresso", value: "IN_PROGRESS", color: colors.statusInProgress, icon: faClock },
            { label: "Concluído", value: "DONE", color: colors.statusDone, icon: faCheck },
          ];
        default:
          return [];
      }
    };

    const handleStatusChange = async (newStatus: string) => {
      try {
        await links.updateActivityStatus(props.id, newStatus);
        props.onStatusChange();
      } catch (error) {}
    };

    // Bloqueia alteração de status se já estiver confirmada
    if (isGroupActivity && props.status === 'DONE' && confirmedLocal) {
      return null;
    }

    return (
      <View style={styles.swipeActionsContainer}>
        {getAvailableStatuses().map((statusOption) => (
          <SwipeActionButton
            key={statusOption.value}
            style={{}}
            color={statusOption.color}
            icon={statusOption.icon}
            text={statusOption.label}
            onPress={() => handleStatusChange(statusOption.value)}
          />
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
              
              {/* Indicador de proximidade - apenas ícone */}
              {proximidade && props.status !== 'DONE' && (
                <View style={[styles.iconBadge, { backgroundColor: colors.primary }]}>
                  <FontAwesomeIcon icon={faLocationDot} size={12} color={colors.textLight} />
                </View>
              )}
              
              {/* Indicador de notificações - apenas ícone */}
              {props.warning !== undefined && (
                <View style={[styles.iconBadge, { 
                  backgroundColor: isWarningEnabled() ? colors.primary : colors.textSecondary 
                }]}>
                  <FontAwesomeIcon 
                    icon={isWarningEnabled() ? faBell : faBellSlash} 
                    size={12} 
                    color={colors.textLight} 
                  />
                </View>
              )}
              
              {/* Indicador de prioridade - apenas ícone */}
              <View style={[styles.iconBadge, { backgroundColor: getPriorityColor(props.priority) }]}>
                <Text style={styles.priorityText}>{getPriority(getPriority(props.priority))}</Text>
              </View>
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
            
            {/* Tipo da atividade */}
            <View style={styles.footerItem}>
              <FontAwesomeIcon icon={faInfoCircle} size={12} color={colors.textSecondary} />
              <Text style={styles.footerText}>{props.type}</Text>
            </View>
            
            {/* Status de notificações */}
            {props.warning !== undefined && (
              <View style={styles.footerItem}>
                <FontAwesomeIcon 
                  icon={isWarningEnabled() ? faBell : faBellSlash} 
                  size={12} 
                  color={isWarningEnabled() ? colors.primary : colors.textSecondary} 
                />
                <Text style={[
                  styles.footerText, 
                  isWarningEnabled() ? { color: colors.primary } : {}
                ]}>
                  {isWarningEnabled() ? "Notificações ativadas" : "Notificações desativadas"}
                </Text>
              </View>
            )}

            {/* Botão para vincular ao calendário */}
            {props.status !== "DONE" && (
              <TouchableOpacity 
                style={styles.calendarButton}
                onPress={vincularAoCalendario}
              >
                <FontAwesomeIcon icon={faCalendarPlus} size={14} color={colors.primary} />
                <Text style={styles.calendarButtonText}>Vincular ao Calendário</Text>
              </TouchableOpacity>
            )}

            {/* Botão de confirmação para atividades de grupo concluídas e não confirmadas */}
            {showConfirmButton && (
              <TouchableOpacity
                style={[styles.calendarButton, { backgroundColor: colors.primary, marginTop: 8 }]}
                onPress={handleConfirmDone}
              >
                <FontAwesomeIcon icon={faCheck} size={14} color={colors.textLight} />
                <Text style={[styles.calendarButtonText, { color: colors.textLight }]}>Confirmar conclusão</Text>
              </TouchableOpacity>
            )}

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
  iconBadge: {
    borderRadius: 4,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.small,
    maxWidth: 200, // valor máximo que você quer permitir
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
  // --- MELHORIA UX SWIPE BUTTONS ---
  swipeActionsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 4,
    minWidth: 90,
  },
  swipeActionButton: {
    width: 90,
    height: 70,
    marginVertical: 8,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
      },
      default: {},
    }),
  },
  swipeActionText: {
    color: colors.textLight,
    fontSize: fonts.size.xs,
    marginTop: 2,
    fontWeight: fonts.weight.medium as any,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
