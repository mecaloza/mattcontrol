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
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  var client = null;
  useFocusEffect(
    React.useCallback(() => {
      client = mqtt.connect("mqtt://itr-matt.cloud.shiftr.io", options);
      return () => {
        client.end();
      };
    }, [])
  );
  const [prendas, setprendas] = useState("");
  const [prendas_keep, setprendas_keep] = useState("");

  const [sending, setsending] = useState(false);
  const [reading, setreading] = useState(false);
  const [total, settotal] = useState("");

  useEffect(() => {
    client.subscribe("Santafe/Disponibles");
    var note;
    // delete_storage();

    client.on("message", function (topic, message) {
      note = message.toString();
      if (topic === "Santafe/Disponibles") {
        settotal(note);
      }
    });
  }, []);

  async function savemirafare() {
    let mifarePages = [];
    setreading(true);
    try {
      let reqMifare = await NfcManager.requestTechnology(
        NfcTech.MifareUltralight
      );
      const tag = await NfcManager.getTag();
      save_record(tag.id);
      setsending(true);
    } catch (ex) {
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
    return mifarePages;
  }

  async function readMifare() {
    let mifarePages = [];
    setreading(true);
    try {
      let reqMifare = await NfcManager.requestTechnology(
        NfcTech.MifareUltralight
      );
      const tag = await NfcManager.getTag();
      read_record(tag.id);
    } catch (ex) {
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
    return mifarePages;
  }

  const save_record = async (value) => {
    var jsonValue = await AsyncStorage.getItem("Tarjetas_probadores");
    var today = new Date();
    var date_hour = new Date();

    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    var hour_date = new Date().getHours();
    var min = new Date().getMinutes();
    var hora_val = String(hour_date) + ":" + String(min).padStart(2, "0");
    var data_agregate = {};
    data_agregate["id"] = value;
    data_agregate["fecha_ingreso"] = date_hour;
    data_agregate["ingreso_prendas"] = prendas;
    // data_agregate["hora_ingreso"] = hora_val;
    data_agregate["prendas_devueltas"] = "";
    // data_agregate["hora_salida"] = "";
    data_agregate["fecha_salida"] = "";

    if (jsonValue == null) {
      jsonValue = [];
    } else {
      jsonValue = JSON.parse(jsonValue);
    }
    if (jsonValue[0] === undefined) {
      jsonValue[0] = data_agregate;
    } else {
      jsonValue.push(data_agregate);
    }
    console.log("json", jsonValue);
    await AsyncStorage.setItem(
      "Tarjetas_probadores",
      JSON.stringify(jsonValue)
    );
    setreading(false);
    setprendas("");
    setsending(false);
  };

  const delete_storage = async () => {
    await AsyncStorage.removeItem("Tarjetas_probadores");
  };

  const read_record = async (value) => {
    var jsonValue = await AsyncStorage.getItem("Tarjetas_probadores");
    jsonValue = JSON.parse(jsonValue);
    // console.log("asdas", jsonValue);
    if (jsonValue != null && value !== "") {
      var time_item = jsonValue.filter((item) => item.id === value);
      var index = jsonValue.findIndex((item) => item.id === value);
      // console.log("este es el index", index);
      if (time_item?.length >= 0) {
        var date_end = new Date();
        var hour_date = new Date().getHours();
        var min = new Date().getMinutes();
        var hora_val = String(hour_date) + ":" + String(min).padStart(2, "0");
        // console.log("esto es antes", time_item);
        setprendas(time_item[0]["ingreso_prendas"]);
        time_item[0]["prendas_devueltas"] = prendas_keep;
        // time_item[0]["hora_salida"] = hora_val;
        time_item[0]["fecha_salida"] = date_end;

        // console.log("esto es despues", time_item);
        jsonValue[index] = time_item[0];
        await AsyncStorage.setItem(
          "Tarjetas_probadores",
          JSON.stringify(jsonValue)
        );
        setreading(false);
        setsending(false);
      }
    }
    fetch(`https://webhook.site/20460468-f6e6-40e6-a211-baa93e4149ad`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: jsonValue,
        type: "registro tarjeta",
      }),
    }).then((response) => {
      console.log("esta es la", response.status);
      if (response.status === 200) {
        delete_storage();
        return false;
      } else {
        console.log("errro");
        return false;
      }
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
      keyboardShouldPersistTaps="always"
    >
      <NavigationMenu></NavigationMenu>
      <View style={styles.card_info}>
        <Text style={styles.text_info_disponibles}>Probadores disponibles</Text>
        <View style={styles.container_disponibles}>
          <Text style={styles.text_info_disponibles_number}>{total}</Text>
        </View>

        <Text style={styles.text_info_disponibles}>Ingreso Prendas</Text>
        {/* <View style={styles.line_separator}></View> */}
        {sending ? (
          <ActivityIndicator
            animating={true}
            size={50}
            style={{ opacity: 1, marginTop: 20 }}
            color="white"
          ></ActivityIndicator>
        ) : reading ? (
          <TouchableOpacity onPress={() => setreading(false)}>
            <Text style={styles.text_info}>Acerca la tarjeta</Text>
          </TouchableOpacity>
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
      <Pressable
        style={styles.icon_settig}
        onPress={() => navigation.navigate("prendas")}
      >
        <Ionicons name="settings" size={30} color="white" />
      </Pressable>
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
    flexDirection: "column",
    width: "40%",
    height: 70,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#D3D3D1",
    borderRadius: 15,
    marginBottom: 30,
    marginTop: 10,
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
    fontSize: 27,
    color: "white",
    fontWeight: "bold",
  },
  text_info_disponibles_number: {
    fontSize: 50,
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
  icon_settig: {
    position: "absolute",
    right: "90%",
    top: 200,
  },

  row_button: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
});
