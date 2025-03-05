import { links } from "@/src/api/api";
import { ErrorAlertComponent } from "@/src/app/components/Alerts/AlertComponent";
import Header from "@/src/app/components/header/Header";
import ToDoComponent from "@/src/app/components/ToDoComponent/ToDoComponent";
import { AuthContext } from "@/src/contexts/AuthContext";
import { colors, padding } from "@/src/globalCSS";
import { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Alert, ScrollView, TouchableOpacity } from "react-native";
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
        return activities.filter(activity => activity.status === status);
    };

    const renderStatusSection = (status: string, title: string) => {
        const statusActivities = getActivitiesByStatus(status);
        if (statusActivities.length === 0) return null;

        return (
            <View style={styles.section}>
                <TouchableOpacity 
                    style={styles.sectionHeader}
                    onPress={() => toggleSection(status as SectionStatus)}
                >
                    <View style={styles.titleContainer}>
                        <Text style={styles.sectionTitle}>{title}</Text>
                        <Text style={styles.countBadge}>({statusActivities.length})</Text>
                    </View>
                    <FontAwesomeIcon 
                        icon={expandedSections[status as SectionStatus] ? faChevronUp : faChevronDown}
                        color={colors.white}
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
        ReadActivities();
    }, [ReadActivities, params.refresh]);

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView style={styles.scrollView}>
                {loading ? (
                    <Text style={styles.loadingText}>Carregando...</Text>
                ) : (
                    <>
                        {renderStatusSection("PENDING", "Pendentes")}
                        {renderStatusSection("IN_PROGRESS", "Em Progresso")}
                        {renderStatusSection("DONE", "Concluídas")}
                    </>
                )}
            </ScrollView>
            <AddActivitiesButton />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        paddingLeft: padding*2,
        paddingRight: padding*2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.darkGray,
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
    },
    countBadge: {
        fontSize: 14,
        color: colors.white,
        opacity: 0.8,
    },
    sectionContent: {
        marginTop: 5,
    },
    loadingText: {
        color: colors.white,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});