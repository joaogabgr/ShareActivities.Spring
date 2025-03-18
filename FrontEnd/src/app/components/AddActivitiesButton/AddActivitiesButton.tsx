import { colors, shadows } from "@/src/globalCSS";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { AuthContext } from "@/src/contexts/AuthContext";

export default function AddActivitiesButton() {
    const router = useRouter();
    const authContext = useContext(AuthContext);

    const handlePress = () => {
        if (!authContext.isAuthenticated) {
            router.replace('/pages/auth/Login');
            return;
        }
        router.push('/pages/Activities/FormAddActivities/FormAddActivities');
    }

    return (
        <TouchableOpacity 
            style={styles.container} 
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <FontAwesomeIcon 
                icon={faPlus} 
                size={24} 
                color={colors.textLight} 
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.large,
    },
});