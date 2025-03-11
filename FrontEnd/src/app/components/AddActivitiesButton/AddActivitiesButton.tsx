import { colors } from "@/src/globalCSS";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useRouter } from "expo-router";
import { View, StyleSheet, TouchableOpacity } from "react-native";
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
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <FontAwesomeIcon icon={faPlus} size={30} color={colors.orange} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: colors.darkGray,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});