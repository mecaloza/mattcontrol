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
  ActivityIndicator,
} from "react-native";
import NavigationMenu from "./tools/NavigationMenu";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";

var mqtt = require("@taoqf/react-native-mqtt");
var options = {
  protocol: "mqtts",
  clientId: "User1",
  username: "itr-matt",
  password: "o85XfQqMdOIfMnoL",
};

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
  // var client = mqtt.connect("mqtt://itr-matt.cloud.shiftr.io", options);
  var client = null;
  useFocusEffect(
    React.useCallback(() => {
      console.log("Screen was focused");
      client = mqtt.connect("mqtt://itr-matt.cloud.shiftr.io", options);

      return () => {
        console.log("Screen was unfocused");
        client.end();
        // Useful for cleanup functions
      };
    }, [])
  );

  const [prendas, setprendas] = useState("");
  const [sending, setsending] = useState(false);
  const [reading, setreading] = useState(false);

  const [total, settotal] = useState("");

  useEffect(() => {
    client.subscribe("Santafe/#");

    var note;
    client.on("message", function (topic, message) {
      note = message.toString();
      if (topic === "Santafe/Disponibles") {
        settotal(note);
      }
    });
  }, []);

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
      setsending(true);
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
    setreading(true);
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
    var options_inner = {
      protocol: "mqtts",
      clientId: "User1_save",
      username: "itr-matt",
      password: "o85XfQqMdOIfMnoL",
    };
    var rfi_id = value;
    var client_save = mqtt.connect(
      "mqtt://itr-matt.cloud.shiftr.io",
      options_inner
    );
    client_save.on("connect", function () {
      client_save.subscribe("Santafe/#", function (err) {
        if (!err) {
          setsending(false);

          client_save.publish("Santafe/" + rfi_id, prendas.toString(), {
            qos: 0,
            retain: true,
          });
          client_save.end();
          setprendas("");
        }
      });
    });
  };

  const read_record = (value) => {
    var options_inner = {
      protocol: "mqtts",
      clientId: "User1_read",
      username: "itr-matt",
      password: "o85XfQqMdOIfMnoL",
    };
    var rfi_id = value;
    var client_read = mqtt.connect(
      "mqtt://itr-matt.cloud.shiftr.io",
      options_inner
    );
    var rfi_id = value;
    client_read.subscribe("Santafe/" + rfi_id);
    client_read.on("message", function (topic, message) {
      setprendas(message.toString());
      client_read.end();
      setreading(false);
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
    >
      <NavigationMenu></NavigationMenu>
      <View style={styles.card_info}>
        <View style={styles.container_disponibles}>
          <Text style={styles.text_info_disponibles}>Disponibles:</Text>
          <Text style={styles.text_info_disponibles_number}>{total}</Text>
        </View>

        <Text style={styles.text_info}>Ingreso Prendas</Text>
        <View style={styles.line_separator}></View>
        {sending ? (
          <ActivityIndicator
            animating={true}
            size={50}
            style={{ opacity: 1, marginTop: 20 }}
            color="white"
          ></ActivityIndicator>
        ) : reading ? (
          <Text style={styles.text_info}>Acerca la tarjeta</Text>
        ) : (
          <TextInput
            autoFocus={true}
            keyboardType="numeric"
            style={styles.input_form}
            onChangeText={setprendas}
            value={prendas.toString()}
            placeholder=""
          ></TextInput>
        )}

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
  container_disponibles: {
    display: "flex",
    flexDirection: "row",
    width: "80%",
    height: 100,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#D3D3D1",
    borderRadius: 15,
    marginBottom: 30,
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

  text_info_disponibles: {
    fontSize: 35,
    color: "white",
    fontWeight: "bold",
  },
  text_info_disponibles_number: {
    fontSize: 35,
    color: "white",
    fontWeight: "bold",
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
  line_separator_disponibles: {
    width: "80%",
    height: 2,
    backgroundColor: "white",
    marginBottom: 30,
  },
  input_form: {
    width: "70%",
    height: 60,
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 20,
    fontSize: 40,
    textAlign: "center",
  },
  button_form: {
    width: "40%",
    height: 50,
    backgroundColor: "#D3D3D1",
    marginTop: 20,
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
