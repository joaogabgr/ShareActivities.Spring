import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ModelsProps {
    icon: any;
    title: string;
    color: string;
    onPress: string;
    description?: string;
}

export default function Models({ icon, title, color, onPress, description }: ModelsProps) {
    const router = useRouter();

    const handlePress = () => {
        router.push(onPress);
    }

    return (
        <TouchableOpacity 
            style={[styles.container, shadows.medium]} 
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.contentWrapper}>
                <View style={[styles.iconContainer, { backgroundColor: color }]}>
                    <FontAwesomeIcon icon={icon} size={30} color={colors.textLight} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    {description && (
                        <Text style={styles.description}>{description}</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        padding: spacing.medium,
        borderRadius: 16,
        marginBottom: spacing.medium,
        width: '100%',
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.medium,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: fonts.size.large,
        fontWeight: fonts.weight.semiBold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    description: {
        fontSize: fonts.size.small,
        color: colors.textSecondary,
    }
});