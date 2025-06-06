import { api, links } from "@/src/api/api";
import { ErrorAlertComponent } from "@/src/app/components/Alerts/AlertComponent";
import Header from "@/src/app/components/header/Header";
import ToDoComponent from "@/src/app/components/ToDoComponent/ToDoComponent";
import { AuthContext } from "@/src/contexts/AuthContext";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { useCallback, useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faChevronDown,
  faChevronUp,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import AddActivitiesButton from "@/src/app/components/AddActivitiesButton/AddActivitiesButton";
import { ReadActivities } from "@/src/types/Activities/ReadActivities";
import React from "react";
import ToDoGraphs from "@/src/app/components/ToDoGraphs/ToDoGraphs";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";

type SectionStatus = "PENDING" | "IN_PROGRESS" | "DONE";

type ExpandedSections = {
  [key in SectionStatus]: boolean;
};

export default function ToDo() {
  const [activities, setActivities] = useState<ReadActivities[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    PENDING: true,
    IN_PROGRESS: true,
    DONE: true,
  });
  const [listening, setListening] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecordingPrepared, setIsRecordingPrepared] =
    useState<boolean>(false);

  const authContext = useContext(AuthContext);
  const router = useRouter();
  const params = useLocalSearchParams();
  const familyId = params.familyId as string;
  const familyName = params.familyName as string;
  const isGroupView = !!familyId;

  // Limpar gravação ao desmontar componente
  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, [recording]);

  const cleanupRecording = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
      } catch {
        // Ignorar erros
      }
      setRecording(null);
      setIsRecordingPrepared(false);
    }
    setListening(false);
  };

  async function startRecording() {
    try {
      // --- CLEANUP PREVIOUS RECORDING IF EXISTS ---
      if (recording) {
        try {
          await recording.stopAndUnloadAsync();
        } catch (cleanupErr) {
          // Ignore errors during cleanup
        }
        setRecording(null);
        setIsRecordingPrepared(false);
        // Wait a bit to let system release resources
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão negada");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await newRecording.startAsync();

      setRecording(newRecording);
      setIsRecordingPrepared(true);
      setListening(true);
      console.log("Gravação iniciada");
    } catch (err) {
      console.error("Erro ao iniciar gravação:", err);
    }
  }

  const stopRecording = async () => {
    try {
      if (!recording || !isRecordingPrepared) {
        console.log("Nenhuma gravação ativa para parar");
        return null;
      }

      setListening(false);

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Áudio gravado em:", uri);

      setRecording(null);
      setIsRecordingPrepared(false);

      if (uri) {
        console.log("Iniciando transcrição...");
        const transcription = await transcribeAudio(uri);
        if (transcription) {
          setSpokenText(transcription);
          console.log("Transcrição:", transcription);
        } else {
          console.log("Nenhuma transcrição retornada.");
        }
      }

      return uri;
    } catch (err) {
      console.error("Erro ao parar gravação:", err);
      await cleanupRecording();
      return null;
    }
  };

  const transcribeAudio = async (uri: string) => {
    try {
      console.log("Lendo arquivo para base64...");
      const fileBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log("Arquivo lido, tamanho do base64:", fileBase64.length);

      const body = {
        config: {
          encoding: "WEBM_OPUS", // Atenção, pode dar erro se não for PCM
          sampleRateHertz: 48000, // ou 16000, dependendo do seu áudio
          languageCode: "pt-BR",
        },
        audio: {
          content: fileBase64,
        },
      };

      const API_KEY = "AIzaSyBm6KRNaN4q7mdhaTLunwCa0BmdyRSSz9M";

      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Erro na API:", response.status, response.statusText, errorResponse);
        return null;
      }

      const data = await response.json();
      const transcription = data.results?.[0]?.alternatives?.[0]?.transcript;

      const geminiResponse = await api.post("/activities/create/gemini", {
        text: transcription,
      });
      
      const geminiModel = typeof geminiResponse.data.model === 'string' ? JSON.parse(geminiResponse.data.model) : geminiResponse.data.model;
      const geminiText = geminiModel?.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log("Gemini text:", geminiText);

      // Função para extrair JSON de um texto possivelmente dentro de bloco de código
      function extractJsonFromText(text: string): any {
        if (!text) return null;
        // Remove blocos ```json ... ``` ou ``` ... ```
        const jsonMatch = text.match(/```(?:json)?([\s\S]*?)```/i);
        const jsonString = jsonMatch ? jsonMatch[1] : text;
        try {
          return JSON.parse(jsonString);
        } catch {
          // Tenta encontrar o primeiro objeto JSON válido no texto
          const curlyMatch = text.match(/\{[\s\S]*\}/);
          if (curlyMatch) {
            try {
              return JSON.parse(curlyMatch[0]);
            } catch {}
          }
        }
        return null;
      }

      const activityData = extractJsonFromText(geminiText);
      if (activityData) {
        // Preenche description com name caso não venha
        if (!activityData.description && activityData.name) {
          activityData.description = activityData.name;
        }
        // Corrige dateExpire no formato MM/DD para string ISO local
        if (activityData.dateExpire && /^\d{1,2}\/\d{1,2}$/.test(activityData.dateExpire)) {
          const [month, day] = activityData.dateExpire.split('/').map(Number);
          const now = new Date();
          let year = now.getFullYear();
          // Se a data já passou este ano, assume o próximo ano
          const expireDate = new Date(year, month - 1, day, 12, 0, 0, 0); // 12h para evitar problemas de fuso
          if (expireDate < now) year++;
          const correctedDate = new Date(year, month - 1, day, 12, 0, 0, 0);
          activityData.dateExpire = correctedDate.toISOString();
        }
        // Redireciona para o form de criar atividade, passando os dados
        router.push({
          pathname: "/pages/Activities/FormAddActivities/FormAddActivities",
          params: {
            ...activityData,
            familyId: isGroupView ? familyId : undefined,
            familyName: isGroupView ? familyName : undefined,
          },
        });
      }
      return transcription || null;
    } catch (error) {
      console.error("Erro na transcrição:", error);
      return null;
    }
  };

  const handleMicrophonePress = async () => {
    if (listening) {
      console.log("Parando gravação...");
      await stopRecording();
    } else {
      console.log("Iniciando gravação...");
      await startRecording();
    }
  };

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (isGroupView) {
        // Usar a rota de grupo se estivermos visualizando tarefas de um grupo
        response = await links.readGroupActivities(familyId);
      } else {
        // Usar a rota normal para tarefas pessoais
        response = await links.readActivities(authContext.user?.name || "");
      }
      setActivities(response.data.model);
    } catch (error) {
      ErrorAlertComponent("Erro", "Não foi possível carregar as atividades.");
    } finally {
      setLoading(false);
    }
  }, [authContext.user?.name, isGroupView, familyId]);

  const toggleSection = (status: SectionStatus) => {
    setExpandedSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const handleDelete = async (id: string) => {
    if (!authContext.isAuthenticated) {
      router.replace("/pages/auth/Login");
      return;
    }

    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta atividade?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              await links.deleteActivity(id);
              setActivities(
                activities.filter((activity) => activity.id !== id)
              );
            } catch (error) {}
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleEdit = (id: string) => {
    if (!authContext.isAuthenticated) {
      router.replace("/pages/auth/Login");
      return;
    }

    Alert.alert(
      "Confirmar edição",
      "Tem certeza que deseja editar esta atividade?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Editar",
          onPress: async () => {
            const activityToEdit = activities.find(
              (activity) => activity.id === id
            );
            if (activityToEdit) {
              // Se estamos em modo de visualização de grupo, adiciona o ID e nome da família
              const params: any = {
                activity: JSON.stringify(activityToEdit),
              };

              if (isGroupView) {
                params.familyId = familyId;
                params.familyName = familyName;
              }

              router.push({
                pathname:
                  "/pages/Activities/FormEditActivities/FormEditActivities",
                params,
              });
            }
          },
          style: "default",
        },
      ]
    );
  };

  const getActivitiesByStatus = (status: string) => {
    const statusActivities = activities.filter(
      (activity) => activity.status === status
    );

    // Ordenar por prioridade (HIGH > MEDIUM > LOW) e depois por data de expiração
    return statusActivities.sort((a, b) => {
      // Primeiro ordena por prioridade
      const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      const priorityDiff =
        (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) -
        (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);

      // Se a prioridade for igual, ordena por data de expiração
      if (priorityDiff === 0) {
        const dateA = new Date(a.dateExpire);
        const dateB = new Date(b.dateExpire);
        return dateA.getTime() - dateB.getTime();
      }

      return priorityDiff;
    });
  };

  const getSectionBackgroundColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return colors.statusPending;
      case "IN_PROGRESS":
        return colors.statusInProgress;
      case "DONE":
        return colors.statusDone;
      default:
        return colors.primary;
    }
  };

  const renderStatusSection = (status: string, title: string) => {
    const statusActivities = getActivitiesByStatus(status);
    if (statusActivities.length === 0) return null;

    const backgroundColor = getSectionBackgroundColor(status);

    return (
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.sectionHeader, { backgroundColor }, shadows.medium]}
          onPress={() => toggleSection(status as SectionStatus)}
          activeOpacity={0.8}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{statusActivities.length}</Text>
            </View>
          </View>
          <FontAwesomeIcon
            icon={
              expandedSections[status as SectionStatus]
                ? faChevronUp
                : faChevronDown
            }
            color={colors.textLight}
            size={16}
          />
        </TouchableOpacity>
        {expandedSections[status as SectionStatus] && (
          <View style={styles.sectionContent}>
            {statusActivities.map((activity) => (
              <ToDoComponent
                key={activity.id}
                {...activity}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onStatusChange={fetchActivities}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const handleViewMore = () => {
    router.push({
      pathname: "/pages/Activities/ToDoDetails/ToDoDetails",
      params: {
        activities: JSON.stringify(activities),
      },
    });
  };

  // --- ANIMAÇÃO DE PULSO PARA O MICROFONE ---
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    if (listening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.18,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [listening]);

  useFocusEffect(
    useCallback(() => {
      if (authContext.isAuthenticated) {
        fetchActivities();
      }
    }, [fetchActivities, authContext.isAuthenticated])
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentContainer}>
        {isGroupView ? (
          <Text style={styles.pageTitle}>Tarefas do Grupo - {familyName}</Text>
        ) : (
          <Text style={styles.pageTitle}>Minhas Tarefas</Text>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando atividades...</Text>
          </View>
        ) : activities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma atividade encontrada.</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão + para adicionar uma nova atividade.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            <ToDoGraphs activities={activities} onViewMore={handleViewMore} />
            {renderStatusSection("PENDING", "Pendentes")}
            {renderStatusSection("IN_PROGRESS", "Em Progresso")}
            {renderStatusSection("DONE", "Concluídas")}
          </ScrollView>
        )}
      </View>

      <AddActivitiesButton
        familyId={isGroupView ? familyId : undefined}
        familyName={isGroupView ? familyName : undefined}
      />

      <Animated.View
        style={[
          styles.microphoneButtonWrapper,
          listening && { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.microphoneButton,
            listening && styles.listeningButton,
            listening && styles.microphoneButtonActive,
          ]}
          onPress={handleMicrophonePress}
          activeOpacity={0.7}
        >
          <FontAwesomeIcon
            icon={faMicrophone}
            color={listening ? colors.primary : colors.textLight}
            size={28}
            style={listening ? { backgroundColor: 'white', borderRadius: 20, padding: 6 } : {}}
          />
        </TouchableOpacity>
        {listening && (
          <>
            <Text style={styles.listeningTextBelow}>Gravando... Fale agora!</Text>
            <Text style={styles.tapToStopText}>Toque para parar</Text>
          </>
        )}
      </Animated.View>
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.small,
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
  pageTitle: {
    fontSize: fonts.size.xxl,
    fontWeight: fonts.weight.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.medium,
    paddingHorizontal: spacing.medium,
    textAlign: "center",
  },
  groupTitle: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold as any,
    color: colors.textPrimary,
  },
  groupName: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semiBold as any,
    color: colors.primary,
    marginBottom: spacing.medium,
    textAlign: "center",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.medium,
    borderRadius: 10,
    marginBottom: spacing.small,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semiBold as any,
    color: colors.textLight,
  },
  countBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.large,
  },
  emptyText: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.medium as any,
    color: colors.textPrimary,
    marginBottom: spacing.small,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
    textAlign: "center",
  },
  microphoneButtonWrapper: {
    position: "absolute",
    right: 20,
    bottom: 100,
    alignItems: "center",
    zIndex: 10,
  },
  microphoneButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.medium,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  microphoneButtonActive: {
    backgroundColor: colors.statusInProgress,
    borderWidth: 3,
    borderColor: colors.primary,
    shadowColor: colors.statusInProgress,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  listeningButton: {
    backgroundColor: colors.statusInProgress,
  },
  tapToStopText: {
    marginTop: 8,
    color: colors.statusInProgress,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.bold as any,
    textAlign: 'center',
    textShadowColor: 'white',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.2,
  },
  listeningTextBelow: {
    marginTop: 10,
    color: colors.statusInProgress,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.bold as any,
    textAlign: 'center',
    textShadowColor: 'white',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.2,
  },
  listeningIndicator: {
    position: "absolute",
    top: -40,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    borderRadius: 16,
    ...shadows.small,
  },
  listeningText: {
    color: colors.textPrimary,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium as any,
  },
  transcriptionContainer: {
    marginTop: spacing.medium,
    padding: spacing.medium,
    borderRadius: 10,
    backgroundColor: colors.surface,
    ...shadows.small,
  },
  transcriptionLabel: {
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold as any,
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },
  transcriptionText: {
    fontSize: fonts.size.large,
    color: colors.textPrimary,
  },
});
