import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import NavigationMenu from "./tools/NavigationMenu";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

var mqtt = require("@taoqf/react-native-mqtt");
var options = {
  protocol: "mqtts",
  clientId: "User1",
  username: "itr-matt",
  password: "o85XfQqMdOIfMnoL",
};
var cont = 0;
var client = null;
export default function RoomsScreen({ navigation }) {
  useFocusEffect(
    React.useCallback(() => {
      client = mqtt.connect("mqtt://itr-matt.cloud.shiftr.io", options);
      return () => {
        client.end();
      };
    }, [])
  );
  const [current_val, setcurrent] = useState("");
  const [voltage_val, setvoltage_val] = useState("");

  // Real time graph
  const [current_graph, setcurrent_graph] = useState([0]);
  const [label, setlabel] = useState([0]);

  let currentref = useRef("");
  let current_client = useRef(null);
  current_client.current = client;

  currentref.current = current_val;
  const [N1, setn1] = useState(0);
  const [N2, setn2] = useState(0);
  const [N3, setn3] = useState(0);
  const [N4, setn4] = useState(0);
  const [N5, setn5] = useState(0);
  const [N6, setn6] = useState(0);
  const [N7, setn7] = useState(0);
  const [N8, setn8] = useState(0);
  const [N9, setn9] = useState(0);
  const [N10, setn10] = useState(0);
  const [N11, setn11] = useState(0);
  const [N12, setn12] = useState(0);
  const [N13, setn13] = useState(0);
  const [N14, setn14] = useState(0);
  const [N15, setn15] = useState(0);

  const [total, settotal] = useState("");

  useEffect(() => {
    client.subscribe("Florida/#");

    var note;
    client.on("message", function (topic, message) {
      note = message.toString();
      if (topic === "Florida/Disponibles") {
        settotal(note);
      }
      if (topic === "Florida/Probadores/N1") {
        if (note === "1") {
          setn1(1);
        } else {
          setn1(0);
        }
      } else if (topic === "Florida/Probadores/N2") {
        if (note === "1") {
          setn2(1);
        } else {
          setn2(0);
        }
      } else if (topic === "Florida/Probadores/N3") {
        if (note === "1") {
          setn3(1);
        } else {
          setn3(0);
        }
      } else if (topic === "Florida/Probadores/N4") {
        if (note === "1") {
          setn4(1);
        } else {
          setn4(0);
        }
      } else if (topic === "Florida/Probadores/N5") {
        if (note === "1") {
          setn5(1);
        } else {
          setn5(0);
        }
      } else if (topic === "Florida/Probadores/N6") {
        if (note === "1") {
          setn6(1);
        } else {
          setn6(0);
        }
      } else if (topic === "Florida/Probadores/N7") {
        if (note === "1") {
          setn7(1);
        } else {
          setn7(0);
        }
      } else if (topic === "Florida/Probadores/N8") {
        if (note === "1") {
          setn8(1);
        } else {
          setn8(0);
        }
      } else if (topic === "Florida/Probadores/N9") {
        if (note === "1") {
          setn9(1);
        } else {
          setn9(0);
        }
      } else if (topic === "Florida/Probadores/N10") {
        if (note === "1") {
          setn10(1);
        } else {
          setn10(0);
        }
      } else if (topic === "Florida/Probadores/N11") {
        if (note === "1") {
          setn11(1);
        } else {
          setn11(0);
        }
      } else if (topic === "Florida/Probadores/N12") {
        if (note === "1") {
          setn12(1);
        } else {
          setn12(0);
        }
      } else if (topic === "Florida/Probadores/N13") {
        if (note === "1") {
          setn13(1);
        } else {
          setn13(0);
        }
      } else if (topic === "Florida/Probadores/N14") {
        if (note === "1") {
          setn14(1);
        } else {
          setn14(0);
        }
      } else if (topic === "Florida/Probadores/N15") {
        if (note === "1") {
          setn15(1);
        } else {
          setn15(0);
        }
      }
    });
  }, []);

  const change_prendas = (value, client) => {
    client.publish("controlFLORIDA/numeroprendas/" + value, "ON", {
      qos: 0,
      retain: false,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
    >
      <NavigationMenu></NavigationMenu>
      <View style={styles.rooms_container}>
        <Image
          style={styles.image_heart}
          source={require("../assets/conejo.png")}
        />
        <View style={styles.inner_container}>
          <View style={styles.container_fitting_room}>
            <Pressable
              onPress={() => change_prendas("N10", client)}
              style={N10 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></Pressable>
            <View style={styles.hall_way}></View>
            <Pressable
              onPress={() => change_prendas("N1", client)}
              style={N1 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></Pressable>
          </View>
          <View style={styles.container_fitting_room}>
            <Pressable
              onPress={() => change_prendas("N11", client)}
              style={N11 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></Pressable>
            <View style={styles.hall_way}></View>
            <Pressable
              onPress={() => change_prendas("N2", client)}
              style={N2 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></Pressable>
          </View>
          <View style={styles.container_fitting_room}>
            <Pressable
              onPress={() => change_prendas("N12", client)}
              style={N12 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></Pressable>
            <View style={styles.hall_way}></View>
            <Pressable
              onPress={() => change_prendas("N3", client)}
              style={N3 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></Pressable>
          </View>
          <View style={styles.container_fitting_room}>
            <Pressable
              onPress={() => change_prendas("N13", client)}
              style={N13 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></Pressable>
            <View style={styles.hall_way}></View>
            <Pressable
              onPress={() => change_prendas("N4", client)}
              style={N4 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></Pressable>
          </View>
          <View style={styles.container_fitting_room}>
            <Pressable
              onPress={() => change_prendas("N14", client)}
              style={N14 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></Pressable>
            <View style={styles.hall_way}></View>
            <Pressable
              onPress={() => change_prendas("N5", client)}
              style={N5 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></Pressable>
          </View>
          <View style={styles.container_fitting_room}>
            <Pressable
              onPress={() => change_prendas("N15", client)}
              style={N15 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></Pressable>
            <View style={styles.hall_way}></View>
            <Pressable
              onPress={() => change_prendas("N6", client)}
              style={N6 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></Pressable>
          </View>
          <View style={styles.container_fitting_room}>
            <View style={styles.none_fitting_room}></View>
            <View style={styles.hall_way}></View>
            <Pressable
              onPress={() => change_prendas("N7", client)}
              style={N7 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></Pressable>
          </View>
          <View style={styles.container_fitting_room}>
            <View style={styles.none_fitting_room}></View>
            <View style={styles.hall_way}></View>
            <Pressable
              onPress={() => change_prendas("N8", client)}
              style={N8 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></Pressable>
          </View>
          <View style={styles.container_fitting_room}>
            <View style={styles.none_fitting_room}></View>
            <View style={styles.hall_way}></View>
            <Pressable
              onPress={() => change_prendas("N9", client)}
              style={N9 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></Pressable>
          </View>
        </View>
        <View style={styles.inner_row}>
          <Text style={styles.text_info}>Disponibles:{total}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 30,
    backgroundColor: "black",
  },
  fitting_room: {
    width: "35%",
    backgroundColor: "rgb(0, 160, 67)",
    borderWidth: 2,
    borderColor: "black",
  },
  fitting_room_not: {
    width: "35%",
    backgroundColor: " rgb(160, 0, 0)",
    borderWidth: 2,
    borderColor: "black",
  },
  none_fitting_room: {
    width: " 35%",
    backgroundColor: "rgb(121, 113, 113)",
    border: "none",
  },
  hall_way: {
    width: "30%",
    backgroundColor: "rgb(121, 113, 113)",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  container_fitting_room: {
    width: "100%",
    height: "11.2%",
    display: "flex",
    flexDirection: "row",
  },
  inner_container: {
    width: "70%",
    marginLeft: "30%",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "red",
  },
  inner_row: {
    width: "100%",
    height: "15%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgb(39, 39, 39)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  rooms_container: {
    width: "80%",
    height: "80%",
    backgroundColor: "black",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    marginTop: 100,
  },
  text_info: {
    fontSize: 30,
    color: "white",
  },
  row_card: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 35,
  },
  line_separator: {
    width: "80%",
    height: 2,
    backgroundColor: "white",
  },
  image_heart: {
    width: 100,
    height: 100,
    resizeMode: "stretch",
    position: "absolute",
    right: 210,
    zIndex: 10,
  },
});
