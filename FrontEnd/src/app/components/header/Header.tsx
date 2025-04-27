import { AuthContext } from "@/src/contexts/AuthContext";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { faPeopleRoof, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useRouter } from "expo-router";
import React from "react";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Header() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    authContext.logout();
  };

  const handleMenu = () => {
    router.dismissAll();
    router.replace("/pages/Default");
  }

  return (
    <View style={styles.header}>
      <View style={styles.leftContent}>
        <TouchableOpacity style={styles.iconButton} onPress={handleMenu}>
          <FontAwesomeIcon style={styles.icon} icon={faPeopleRoof} size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Share Activities</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <FontAwesomeIcon style={styles.logoutIcon} icon={faSignOutAlt} size={22} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    ...shadows.medium,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginRight: spacing.medium,
  },
  icon: {
    color: colors.textLight,
  },
  title: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    color: colors.textLight,
  },
  logoutButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.primaryDark,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutIcon: {
    color: colors.textLight,
  }
});