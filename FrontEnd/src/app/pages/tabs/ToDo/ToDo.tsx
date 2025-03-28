import { links } from "@/src/api/api";
import { ErrorAlertComponent } from "@/src/app/components/Alerts/AlertComponent";
import Header from "@/src/app/components/header/Header";
import ToDoComponent from "@/src/app/components/ToDoComponent/ToDoComponent";
import { AuthContext } from "@/src/contexts/AuthContext";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AddActivitiesButton from "@/src/app/components/AddActivitiesButton/AddActivitiesButton";
import { ReadActivities } from "@/src/types/Activities/ReadActivities";

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
    const authContext = useContext(AuthContext);
    const router = useRouter();
    const params = useLocalSearchParams();

    // useEffect(() => {
    //     const checkUser = async () => {
    //         const response = await links.checkUserHaveFamily(authContext.user?.name || '');
    //         if (response.data.model === false) {
    //             Alert.alert(
    //                 "Família não encontrada",
    //                 "Você não possui uma família cadastrada. Deseja criar uma agora?",
    //                 [
    //                     {
    //                         text: "Cancelar",
    //                         onPress: () => router.replace("/pages/Default"),
    //                         style: "default"
    //                     },
    //                     {
    //                         text: "Criar",
    //                         onPress: () => router.push("/pages/Family/FormAddFamily/FormAddFamily"),
    //                         style: "default"
    //                     }
    //                 ]
    //             )
    //         }
    //     }

    //     checkUser();
    // } , []);

    const ReadActivities = useCallback(async () => {
        setLoading(true);
        try {
            const response = await links.readActivities(authContext.user?.name || '');
            setActivities(response.data.model);
        } catch (error) {
            console.error(error);
            ErrorAlertComponent(
                "Erro ao carregar atividades",
                "Não foi possível carregar as atividades. Tente novamente mais tarde."
            );
        } finally {
            setLoading(false);
        }
    }, [authContext.user?.name]);

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
                            ErrorAlertComponent("Erro ao excluir atividade", "Não foi possível excluir a atividade, tente novamente mais tarde.");
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
                            router.push({
                                pathname: "/pages/Activities/FormEditActivities/FormEditActivities",
                                params: { activity: JSON.stringify(activityToEdit) }
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
                                onStatusChange={ReadActivities}
                            />
                        ))}
                    </View>
                )}
            </View>
        );
    };

    useEffect(() => {
        if (authContext.isAuthenticated) {
            ReadActivities();
        }
    }, [ReadActivities, params.refresh, authContext.isAuthenticated]);

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <View style={styles.contentContainer}>
                <Text style={styles.pageTitle}>Minhas Tarefas</Text>
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
                        {renderStatusSection("PENDING", "Pendentes")}
                        {renderStatusSection("IN_PROGRESS", "Em Progresso")}
                        {renderStatusSection("DONE", "Concluídas")}
                    </ScrollView>
                )}
            </View>
            <AddActivitiesButton />
        </SafeAreaView>
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
});