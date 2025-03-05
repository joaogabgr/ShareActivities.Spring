import { AuthContext } from "@/src/contexts/AuthContext";
import { colors, padding } from "@/src/globalCSS";
import { faPeopleRoof, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function Header() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    authContext.logout();
  };

  const handleMenu = () => {
    router.replace("/pages/Default");
  }

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleMenu}>
        <FontAwesomeIcon style={styles.icon} icon={faPeopleRoof} size={45} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <FontAwesomeIcon style={styles.icon} icon={faSignOutAlt} size={30} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    backgroundColor: colors.darkGray,
    width: "100%",
    justifyContent: "space-between",
    padding: padding,
    flexDirection: "row",
  },

  icon: {
    color: colors.orange,
  },
});
