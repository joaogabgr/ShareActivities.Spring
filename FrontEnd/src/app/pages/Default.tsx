import { useContext } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "@/src/contexts/AuthContext";
import { colors, padding } from "@/src/globalCSS";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faList, faPeopleGroup, faPeopleRoof, faUtensils } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/header/Header";
import Models from "../components/Models/Models";

export default function Default() {    
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.modelsContainer}>
        <Models icon={faPeopleGroup} title="Minha Familia" color="#008000" onPress='/pages/tabs/MyFamily/MyFamily' />
        <Models icon={faList} title="Tarefas a fazer" color="#00FFFF" onPress="/pages/tabs/ToDo/ToDo"/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.gray,
  },

  modelsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    flexWrap: 'wrap',
    paddingLeft: padding*2,
    paddingRight: padding*2,
  },

});
