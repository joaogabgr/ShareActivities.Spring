import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { PieChart, LineChart, BarChart } from 'react-native-chart-kit';
import { colors, fonts, shadows, spacing } from '@/src/globalCSS';
import { ReadActivities } from '@/src/types/Activities/ReadActivities';
import Header from '@/src/app/components/header/Header';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ToDoDetails: React.FC = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const activities: ReadActivities[] = JSON.parse(params.activities as string);

    // Calcular estatísticas
    const totalActivities = activities.length;
    const pendingActivities = activities.filter(a => a.status === 'PENDING').length;
    const inProgressActivities = activities.filter(a => a.status === 'IN_PROGRESS').length;
    const doneActivities = activities.filter(a => a.status === 'DONE').length;

    // Dados para o gráfico de pizza
    const pieData = [
        {
            name: 'Pendentes',
            population: pendingActivities,
            color: colors.statusPending,
            legendFontColor: colors.textPrimary,
            legendFontSize: 12
        },
        {
            name: 'Em Progresso',
            population: inProgressActivities,
            color: colors.statusInProgress,
            legendFontColor: colors.textPrimary,
            legendFontSize: 12
        },
        {
            name: 'Concluídas',
            population: doneActivities,
            color: colors.statusDone,
            legendFontColor: colors.textPrimary,
            legendFontSize: 12
        }
    ];

    // Dados para o gráfico de barras (por prioridade)
    const priorityData = {
        labels: ['Baixa', 'Média', 'Alta'],
        datasets: [{
            data: [
                Math.round(activities.filter(a => a.priority === 'LOW').length),   // Arredondando o valor
                Math.round(activities.filter(a => a.priority === 'MEDIUM').length), // Arredondando o valor
                Math.round(activities.filter(a => a.priority === 'HIGH').length)    // Arredondando o valor
            ]
        }]
    };


    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <FontAwesomeIcon icon={faArrowLeft} color={colors.textPrimary} size={20} />
                </TouchableOpacity>
                <Text style={styles.title}>Estatísticas Detalhadas</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Distribuição por Status</Text>
                        <PieChart
                            data={pieData}
                            width={300}
                            height={200}
                            chartConfig={{
                                backgroundColor: colors.background,
                                backgroundGradientFrom: colors.background,
                                backgroundGradientTo: colors.background,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                        />
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Distribuição por Prioridade</Text>
                        <BarChart
                            data={priorityData}
                            width={300}
                            height={200}
                            chartConfig={{
                                backgroundColor: colors.background,
                                backgroundGradientFrom: colors.background,
                                backgroundGradientTo: colors.background,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                decimalPlaces: 0, // Garantir que não apareçam casas decimais no gráfico
                            }}
                            verticalLabelRotation={30}
                            yAxisLabel=""
                            yAxisSuffix=""
                            yAxisInterval={1}  // Garantir que a escala do eixo Y use apenas inteiros
                        />

                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statTitle}>Total de Atividades</Text>
                            <Text style={styles.statValue}>{totalActivities}</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statTitle}>Taxa de Conclusão</Text>
                            <Text style={styles.statValue}>
                                {((doneActivities / totalActivities) * 100).toFixed(1)}%
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: spacing.medium,
    },
    title: {
        fontSize: fonts.size.xxl,
        fontWeight: 'bold',
        color: colors.textPrimary,
        flex: 1,
        textAlign: 'center',
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 10,
        padding: spacing.medium,
        marginBottom: spacing.medium,
        ...shadows.medium,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: fonts.size.large,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: spacing.medium,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.medium,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 10,
        padding: spacing.medium,
        marginHorizontal: spacing.small,
        alignItems: 'center',
        ...shadows.small,
    },
    statTitle: {
        fontSize: fonts.size.medium,
        color: colors.textSecondary,
        marginBottom: spacing.small,
    },
    statValue: {
        fontSize: fonts.size.xxl,
        fontWeight: 'bold',
        color: colors.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.medium,
        marginBottom: spacing.medium,
        marginTop: spacing.medium,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.surface,
        ...shadows.small,
        marginRight: spacing.medium,
    },
});

export default ToDoDetails; 