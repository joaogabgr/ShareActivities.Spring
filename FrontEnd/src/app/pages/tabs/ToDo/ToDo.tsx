import { links } from "@/src/api/api";
import { ErrorAlertComponent } from "@/src/app/components/Alerts/AlertComponent";
import Header from "@/src/app/components/header/Header";
import ToDoComponent from "@/src/app/components/ToDoComponent/ToDoComponent";
import { AuthContext } from "@/src/contexts/AuthContext";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { useCallback, useContext, useState, useEffect } from "react";
import { View, StyleSheet, Text, Alert, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faChevronDown, faChevronUp, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import AddActivitiesButton from "@/src/app/components/AddActivitiesButton/AddActivitiesButton";
import { ReadActivities } from "@/src/types/Activities/ReadActivities";
import React from "react";
import ToDoGraphs from '@/src/app/components/ToDoGraphs/ToDoGraphs';
import * as Speech from 'expo-speech';

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
        DONE: true
    });
    const [listening, setListening] = useState<boolean>(false);
    const [spokenText, setSpokenText] = useState<string>("");
    const authContext = useContext(AuthContext);
    const router = useRouter();
    const params = useLocalSearchParams();
    const familyId = params.familyId as string;
    const familyName = params.familyName as string;
    const isGroupView = !!familyId;

    const fetchActivities = useCallback(async () => {
        setLoading(true);
        try {
            let response;
            if (isGroupView) {
                // Usar a rota de grupo se estivermos visualizando tarefas de um grupo
                response = await links.readGroupActivities(familyId);
            } else {
                // Usar a rota normal para tarefas pessoais
                response = await links.readActivities(authContext.user?.name || '');
            }
            setActivities(response.data.model);
        } catch (error) {
            ErrorAlertComponent('Erro', 'Não foi possível carregar as atividades.');
        } finally {
            setLoading(false);
        }
    }, [authContext.user?.name, isGroupView, familyId]);

    // Simulação do reconhecimento de voz usando Speech API integrada
    const startVoiceRecognition = () => {
        try {
            setListening(true);
            
            // Simulação do reconhecimento de voz
            // Em um caso real, você usaria uma API de Speech-to-Text
            setTimeout(() => {
                const simulatedText = "Comprar leite na quinta-feira";
                processRecognizedText(simulatedText);
                setListening(false);
            }, 2000);
            
            // Indicação sonora de que o reconhecimento começou
            Speech.speak("Ouvindo...", {
                language: 'pt-BR',
                pitch: 1.0,
                rate: 0.8
            });
            
        } catch (error) {
            console.error("Erro ao iniciar reconhecimento de voz:", error);
            setListening(false);
            ErrorAlertComponent('Erro', 'Não foi possível iniciar o reconhecimento de voz');
        }
    };
    
    const processRecognizedText = (text: string) => {
        setSpokenText(text);
        console.log("Texto reconhecido:", text);
        
        // Exibe o texto que foi realmente reconhecido
        Alert.alert(
            "Texto reconhecido", 
            text,
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Criar atividade",
                    onPress: () => createActivityFromVoice(text),
                }
            ]
        );
    };
    
    const createActivityFromVoice = (text: string) => {
        // Aqui você enviaria o texto para o backend
        console.log("Enviando para o backend:", text);
        
        // Exemplo de dados para criar uma atividade
        const voiceData = {
            description: text,
            familyId: isGroupView ? familyId : undefined,
            // Outros dados padrão, como status inicial (PENDING), prioridade, etc.
        };
        
        // Implementação futura: criar atividade baseada no texto reconhecido
        // await links.createActivity(voiceData);
        // fetchActivities();
        
        // Confirmação audível
        Speech.speak("Atividade criada com sucesso", {
            language: 'pt-BR',
            pitch: 1.0,
            rate: 0.8
        });
        
        Alert.alert("Atividade criada", "Uma nova atividade foi criada a partir do seu comando de voz.");
    };

    const toggleSection = (status: SectionStatus) => {
        setExpandedSections(prev => ({
            ...prev,
            [status]: !prev[status]
        }));
    };

    const handleDelete = async (id: string) => {
        if (!authContext.isAuthenticated) {
            router.replace('/pages/auth/Login');
            return;
        }

        Alert.alert(
            "Confirmar exclusão",
            "Tem certeza que deseja excluir esta atividade?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    onPress: async () => {
                        try {
                            await links.deleteActivity(id);
                            setActivities(activities.filter(activity => activity.id !== id));
                        } catch (error) {
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleEdit = (id: string) => {
        if (!authContext.isAuthenticated) {
            router.replace('/pages/auth/Login');
            return;
        }

        Alert.alert(
            "Confirmar edição",
            "Tem certeza que deseja editar esta atividade?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Editar",
                    onPress: async () => {
                        const activityToEdit = activities.find(activity => activity.id === id);
                        if (activityToEdit) {
                            // Se estamos em modo de visualização de grupo, adiciona o ID e nome da família
                            const params: any = { 
                                activity: JSON.stringify(activityToEdit) 
                            };
                            
                            if (isGroupView) {
                                params.familyId = familyId;
                                params.familyName = familyName;
                            }
                            
                            router.push({
                                pathname: "/pages/Activities/FormEditActivities/FormEditActivities",
                                params
                            });
                        }
                    },
                    style: "default"
                }
            ]
        );
    }

    const getActivitiesByStatus = (status: string) => {
        const statusActivities = activities.filter(activity => activity.status === status);
        
        // Ordenar por prioridade (HIGH > MEDIUM > LOW) e depois por data de expiração
        return statusActivities.sort((a, b) => {
            // Primeiro ordena por prioridade
            const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
            const priorityDiff = (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
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
        switch(status) {
            case 'PENDING': return colors.statusPending;
            case 'IN_PROGRESS': return colors.statusInProgress;
            case 'DONE': return colors.statusDone;
            default: return colors.primary;
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
                        icon={expandedSections[status as SectionStatus] ? faChevronUp : faChevronDown}
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
                activities: JSON.stringify(activities)
            }
        });
    };

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
                        <Text style={styles.emptySubtext}>Toque no botão + para adicionar uma nova atividade.</Text>
                    </View>
                ) : (
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                        <ToDoGraphs activities={activities} onViewMore={handleViewMore} />
                        {renderStatusSection("PENDING", "Pendentes")}
                        {renderStatusSection("IN_PROGRESS", "Em Progresso")}
                        {renderStatusSection("DONE", "Concluídas")}
                    </ScrollView>
                )}
            </View>
            
            <TouchableOpacity 
                style={[styles.microphoneButton, listening && styles.listeningButton]} 
                onPress={startVoiceRecognition}
                disabled={listening}
            >
                <FontAwesomeIcon 
                    icon={faMicrophone} 
                    color={colors.textLight} 
                    size={22} 
                />
                {listening && (
                    <View style={styles.listeningIndicator}>
                        <Text style={styles.listeningText}>Ouvindo...</Text>
                    </View>
                )}
            </TouchableOpacity>
            
            <AddActivitiesButton 
                familyId={isGroupView ? familyId : undefined} 
                familyName={isGroupView ? familyName : undefined}
            />
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.small,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.surface,
        ...shadows.small,
    },
    pageTitle: {
        fontSize: fonts.size.xxl,
        fontWeight: fonts.weight.bold as any,
        color: colors.textPrimary,
        marginBottom: spacing.medium,
        paddingHorizontal: spacing.medium,
    textAlign: 'center',

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
        textAlign: 'center',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: spacing.medium,
        fontSize: fonts.size.medium,
        color: colors.textSecondary,
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
    microphoneButton: {
        position: 'absolute',
        right: 20,
        bottom: 100, // Posicionar acima do botão de adicionar
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.medium,
    },
    listeningButton: {
        backgroundColor: colors.statusInProgress,
    },
    listeningIndicator: {
        position: 'absolute',
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
});