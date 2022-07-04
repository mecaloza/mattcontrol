import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  ScrollView,
  TextInput,
  Keyboard,
  Alert,
  TouchableOpacity,
} from "react-native";
import NavigationMenu from "./tools/NavigationMenu";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NfcManager, { NfcTech } from "react-native-nfc-manager";

const screenWidth = Dimensions.get("window").width;

var mqtt = require("@taoqf/react-native-mqtt");
var options = {
  protocol: "mqtts",
  clientId: "User1",
  username: "itr-matt",
  password: "o85XfQqMdOIfMnoL",
};
var cont = 0;

export default function HomeScreen({ navigation }) {
  const [prendas, setprendas] = useState("");
  const [keybor_touch, setkeybor_touch] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // useEffect(() => {
  //   var client = mqtt.connect("mqtt://smart.cloud.shiftr.io", options);
  //   client.subscribe("Termofijadora01/fase1/#");
  //   var note;

  //   client.on("message", function (topic, message) {
  //     note = message.toString();

  //     if (topic === "Termofijadora01/fase1/corriente") {
  //       console.log("corriente", note);
  //       cont = cont + 1;
  //       setlabel((label) => [...label, cont]);
  //       setcurrent_graph((current_graph) => [...current_graph, note]);

  //       setcurrent(note);
  //     } else if (topic === "Termofijadora01/fase1/voltaje") {
  //       setvoltage_val(note);
  //       console.log("voltaje", note);
  //     }
  //     if (currentref.current === "") {
  //       // client.end();
  //     }
  //   });
  // }, []);

  async function savemirafare() {
    let mifarePages = [];

    try {
      // STEP 1
      let reqMifare = await NfcManager.requestTechnology(
        NfcTech.MifareUltralight
      );
      const tag = await NfcManager.getTag();
      // Alert.alert("id", tag.id);
      save_record(tag.id);
      const readLength = 60;
      const mifarePagesRead = await Promise.all(
        [...Array(readLength).keys()].map(async (_, i) => {
          const pages = await NfcManager.mifareUltralightHandlerAndroid // STEP 2
            .mifareUltralightReadPages(i * 4); // STEP 3
          mifarePages.push(pages);
        })
      );

      // Alert.alert("esta es la segunda", mifarePagesRead);
    } catch (ex) {
      // Alert.alert(ex);
    } finally {
      // STEP 4
      NfcManager.cancelTechnologyRequest();
    }

    return mifarePages;
  }

  async function readMifare() {
    let mifarePages = [];

    try {
      // STEP 1
      let reqMifare = await NfcManager.requestTechnology(
        NfcTech.MifareUltralight
      );
      const tag = await NfcManager.getTag();
      // Alert.alert("id", tag.id);
      read_record(tag.id);
      const readLength = 60;
      const mifarePagesRead = await Promise.all(
        [...Array(readLength).keys()].map(async (_, i) => {
          const pages = await NfcManager.mifareUltralightHandlerAndroid // STEP 2
            .mifareUltralightReadPages(i * 4); // STEP 3
          mifarePages.push(pages);
        })
      );

      // Alert.alert("esta es la segunda", mifarePagesRead);
    } catch (ex) {
      // Alert.alert(ex);
    } finally {
      // STEP 4
      NfcManager.cancelTechnologyRequest();
    }

    return mifarePages;
  }

  const save_record = (value) => {
    var client = mqtt.connect("mqtt://itr-matt.cloud.shiftr.io", options);
    var rfi_id = value;
    client.on("connect", function () {
      client.subscribe("Santafe/#", function (err) {
        if (!err) {
          client.publish("Santafe/" + rfi_id, prendas.toString(), {
            qos: 0,
            retain: true,
          });
        }
      });
    });
  };

  const read_record = (value) => {
    var client = mqtt.connect("mqtt://itr-matt.cloud.shiftr.io", options);
    var rfi_id = value;
    client.subscribe("Santafe/" + rfi_id);
    client.on("message", function (topic, message) {
      setprendas(message.toString());
      client.end();
    });
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
    >
      <NavigationMenu></NavigationMenu>
      <View style={styles.card_info}>
        <Text style={styles.text_info}>Prendas</Text>
        <View style={styles.line_separator}></View>
        <TextInput
          autoFocus={true}
          keyboardType="numeric"
          style={styles.input_form}
          onChangeText={setprendas}
          value={prendas.toString()}
          placeholder="Ingrese el numero de prendas"
        ></TextInput>
        <View style={styles.row_button}>
          <TouchableOpacity style={styles.button_form} onPress={savemirafare}>
            <Text style={styles.title_button}>GRABAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button_form} onPress={readMifare}>
            <Text style={styles.title_button}>LEER</Text>
          </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  card_info: {
    width: "100%",
    height: 300,
    backgroundColor: "black",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    marginTop: 100,
  },
  title_button: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
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
  input_form: {
    width: "70%",
    height: 30,
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 20,
  },
  button_form: {
    width: "40%",
    height: 50,
    backgroundColor: "#D3D3D1",
    marginTop: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },

  row_button: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
});
