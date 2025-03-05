import { colors } from "@/src/globalCSS";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Models(props: any) {
    const router = useRouter();

    const handlePress = () => {
        router.push(props.onPress);
    }

    
    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <FontAwesomeIcon icon={props.icon} size={50} color={props.color} />
            <Text style={styles.text}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.darkGray,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        width: '100%',
        borderRadius: 10,
        flexDirection: 'row',
        marginBottom: 10,
        

    },

    text: {
        fontSize: 20,
        color: colors.white,
        marginTop: 10,
    }
});