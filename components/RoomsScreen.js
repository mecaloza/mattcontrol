import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import NavigationMenu from "./tools/NavigationMenu";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

var mqtt = require("@taoqf/react-native-mqtt");
var options = {
  protocol: "mqtts",
  clientId: "User1",
  username: "itr-matt",
  password: "o85XfQqMdOIfMnoL",
};
var cont = 0;

export default function RoomsScreen({ navigation }) {
  const [current_val, setcurrent] = useState("");
  const [voltage_val, setvoltage_val] = useState("");

  // Real time graph
  const [current_graph, setcurrent_graph] = useState([0]);
  const [label, setlabel] = useState([0]);

  let currentref = useRef("");
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
  const [total, settotal] = useState("");

  useEffect(() => {
    var client = mqtt.connect("mqtt://itr-matt.cloud.shiftr.io", options);
    client.subscribe("Santafe/#");
    var note;
    client.on("message", function (topic, message) {
      note = message.toString();
      if (topic === "Santafe/Disponibles") {
        settotal(note);
      }
      if (topic === "Santafe/Probadores/N1") {
        if (note === "1") {
          setn1(1);
        } else {
          setn1(0);
        }
      } else if (topic === "Santafe/Probadores/N2") {
        if (note === "1") {
          setn2(1);
        } else {
          setn2(0);
        }
      } else if (topic === "Santafe/Probadores/N3") {
        if (note === "1") {
          setn3(1);
        } else {
          setn3(0);
        }
      } else if (topic === "Santafe/Probadores/N4") {
        if (note === "1") {
          setn4(1);
        } else {
          setn4(0);
        }
      } else if (topic === "Santafe/Probadores/N5") {
        if (note === "1") {
          setn5(1);
        } else {
          setn5(0);
        }
      } else if (topic === "Santafe/Probadores/N6") {
        if (note === "1") {
          setn6(1);
        } else {
          setn6(0);
        }
      } else if (topic === "Santafe/Probadores/N7") {
        if (note === "1") {
          setn7(1);
        } else {
          setn7(0);
        }
      } else if (topic === "Santafe/Probadores/N8") {
        if (note === "1") {
          setn8(1);
        } else {
          setn8(0);
        }
      } else if (topic === "Santafe/Probadores/N9") {
        if (note === "1") {
          setn9(1);
        } else {
          setn9(0);
        }
      } else if (topic === "Santafe/Probadores/N10") {
        if (note === "1") {
          setn10(1);
        } else {
          setn10(0);
        }
      } else if (topic === "Santafe/Probadores/N11") {
        if (note === "1") {
          setn11(1);
        } else {
          setn11(0);
        }
      } else if (topic === "Santafe/Probadores/N12") {
        if (note === "1") {
          setn12(1);
        } else {
          setn12(0);
        }
      } else if (topic === "Santafe/Probadores/N13") {
        if (note === "1") {
          setn13(1);
        } else {
          setn13(0);
        }
      }
    });
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
    >
      <NavigationMenu></NavigationMenu>
      <View style={styles.rooms_container}>
        <View style={styles.inner_container}>
          <View style={styles.container_fitting_room}>
            <View
              style={N1 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></View>
            <View style={styles.hall_way}></View>
            <View
              style={N2 == 1 ? styles.fitting_room_not : styles.fitting_room}
            ></View>
          </View>
          <View style={styles.container_fitting_room}>
            <View style={styles.fitting_room}></View>
            <View style={styles.hall_way}></View>
            <View style={styles.fitting_room}></View>
          </View>
          <View style={styles.container_fitting_room}>
            <View style={styles.fitting_room}></View>
            <View style={styles.hall_way}></View>
            <View style={styles.fitting_room}></View>
          </View>
          <View style={styles.container_fitting_room}>
            <View style={styles.fitting_room}></View>
            <View style={styles.hall_way}></View>
            <View style={styles.fitting_room}></View>
          </View>
          <View style={styles.container_fitting_room}>
            <View style={styles.fitting_room}></View>
            <View style={styles.hall_way}></View>
            <View style={styles.fitting_room}></View>
          </View>
          <View style={styles.container_fitting_room}>
            <View style={styles.fitting_room}></View>
            <View style={styles.hall_way}></View>
            <View style={styles.fitting_room}></View>
          </View>
          <View style={styles.container_fitting_room}>
            <View style={styles.none_fitting_room}></View>
            <View style={styles.hall_way}></View>
            <View style={styles.fitting_room}></View>
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
    height: "14.3%",
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
    height: "10%",
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
});
