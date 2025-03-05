import { colors } from "@/src/globalCSS";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useRouter } from "expo-router";
import { View, StyleSheet, TouchableOpacity } from "react-native";

export default function AddActivitiesButton() {
    const router = useRouter();

    const handlePress = () => {
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
        padding: 10,
        borderRadius: 50,
        
    },
});