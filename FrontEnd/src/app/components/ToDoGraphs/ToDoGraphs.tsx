import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors, fonts, shadows, spacing } from '@/src/globalCSS';
import { ReadActivities } from '@/src/types/Activities/ReadActivities';

interface ToDoGraphsProps {
    activities: ReadActivities[];
    onViewMore: () => void;
}

const ToDoGraphs: React.FC<ToDoGraphsProps> = ({ activities, onViewMore }) => {
    // Calcular estatísticas
    const totalActivities = activities.length;
    const pendingActivities = activities.filter(a => a.status === 'PENDING').length;
    const inProgressActivities = activities.filter(a => a.status === 'IN_PROGRESS').length;
    const doneActivities = activities.filter(a => a.status === 'DONE').length;

    const pendingPercentage = totalActivities > 0 ? (pendingActivities / totalActivities) * 100 : 0;
    const inProgressPercentage = totalActivities > 0 ? (inProgressActivities / totalActivities) * 100 : 0;
    const donePercentage = totalActivities > 0 ? (doneActivities / totalActivities) * 100 : 0;

    // Dados para o gráfico de pizza
    const pieData = [
        {
            name: '',
            population: pendingActivities,
            color: colors.statusPending,
        },
        {
            name: '',
            population: inProgressActivities,
            color: colors.statusInProgress,
        },
        {
            name: '',
            population: doneActivities,
            color: colors.statusDone,
        }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.graphsContainer}>
                <View style={styles.graphCard}>
                    <Text style={styles.graphTitle}>Não Concluídas</Text>
                    <Text style={styles.percentageText}>
                        {((pendingActivities + inProgressActivities) / totalActivities * 100).toFixed(1)}%
                    </Text>
                </View>

                <View style={styles.graphCard}>
                    <Text style={styles.graphTitle}>Status</Text>
                    <View style={styles.pieChartContainer}>
                        <PieChart
                            data={pieData}
                            width={80}
                            height={80}
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
                            hasLegend={false}
                        />
                    </View>
                </View>

                <View style={styles.graphCard}>
                    <Text style={styles.graphTitle}>Concluídas</Text>
                    <Text style={styles.percentageText}>
                        {(donePercentage).toFixed(1)}%
                    </Text>
                </View>
            </View>

            <TouchableOpacity style={styles.viewMoreButton} onPress={onViewMore}>
                <Text style={styles.viewMoreText}>Ver mais informações</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.small,
    },
    graphsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.small,
        paddingHorizontal: spacing.small,
    },
    graphCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: spacing.small,
        marginHorizontal: spacing.xs,
        alignItems: 'center',
        ...shadows.small,
    },
    pieChartContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: -10,
    },
    graphTitle: {
        fontSize: fonts.size.xs,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    percentageText: {
        fontSize: fonts.size.large,
        fontWeight: 'bold',
        color: colors.primary,
        marginTop: spacing.xs,
    },
    viewMoreButton: {
        backgroundColor: colors.primary,
        padding: spacing.small,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: spacing.small,
        marginTop: spacing.xs,
        ...shadows.small,
    },
    viewMoreText: {
        color: colors.textLight,
        fontSize: fonts.size.small,
        fontWeight: 'bold',
    },
});

export default ToDoGraphs; 