import React, { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { NavigationContext } from "@react-navigation/native";
import {
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
  Foundation,
  Ionicons,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";

export default function NavigationMenu() {
  const navigation = useContext(NavigationContext);
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate("home")}>
        <Entypo style={styles.icon} name="home" size={35} color="white" />
      </Pressable>
      <Pressable onPress={() => navigation.navigate("rooms")}>
        <MaterialIcons
          style={styles.icon}
          name="dashboard"
          size={35}
          color="white"
        />
      </Pressable>
      <Pressable onPress={() => navigation.navigate("machines")}>
        <FontAwesome5
          style={styles.icon}
          name="tshirt"
          size={35}
          color="white"
        />
      </Pressable>

      {/* <Pressable onPress={() => navigation.navigate("graph")}>
        <Foundation
          style={styles.icon}
          name="graph-bar"
          size={35}
          color="white"
        />
      </Pressable> */}
      {/* <Pressable onPress={() => navigation.navigate("control")}>
        <Ionicons
          style={styles.icon}
          name="game-controller"
          size={35}
          color="white"
        />
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    height: 80,
    width: "100%",
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "space-around",
    display: "flex",
    flexDirection: "row",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
  },
  icon: {
    marginTop: 10,
  },
});
