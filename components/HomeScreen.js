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
  Image,
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
  const [prendas_change, setprendas_change] = useState(0);
  const [prendas_bol, setprendas_bol] = useState(false);

  const [sending, setsending] = useState(false);
  const [reading, setreading] = useState(false);
  const [total, settotal] = useState("");

  useEffect(() => {
    client.subscribe("Florida/Disponibles");
    var note;
    // delete_storage();

    client.on("message", function (topic, message) {
      console.log("este", note);
      console.log("este", topic);

      note = message.toString();
      if (topic === "Florida/Disponibles") {
        settotal(note);
      }
    });
  }, []);

  useEffect(() => {
    console.log("esta actulizado", total);
  }, [total]);

  async function savemirafare() {
    let mifarePages = [];
    setreading(true);
    console.log("eeee");
    try {
      let reqMifare = await NfcManager.requestTechnology(
        NfcTech.MifareUltralight
      );
      console.log("eeee");
      const tag = await NfcManager.getTag();
      save_record(tag.id);
      setsending(true);
    } catch (ex) {
      console.log("eeee", ex);
      setreading(false);
    } finally {
      NfcManager.cancelTechnologyRequest();
      setreading(false);
    }
    return mifarePages;
  }

  async function readMifare() {
    let mifarePages = [];
    setreading(true);
    try {
      console.log("si esta tratando");
      let reqMifare = await NfcManager.requestTechnology(
        NfcTech.MifareUltralight
      );
      const tag = await NfcManager.getTag();
      read_record(tag.id);
    } catch (ex) {
      console.log("se esta por aca o que", ex);
      setreading(false);
    } finally {
      console.log("se esta por aca o quesdas");
      NfcManager.cancelTechnologyRequest();
      setreading(false);
    }
    console.log("se esta por aca o siiiii");
    return mifarePages;
  }

  const change_prendas = (operator) => {
    setprendas_bol(true);
    console.log("pasee");
    if (operator === "+") {
      setprendas_change((current) => current + 1);
    } else {
      setprendas_change((current) => current - 1);
    }
  };

  const cancel_operation = () => {
    NfcManager.cancelTechnologyRequest();
    setreading(false);
  };

  let textLog = "";
  if (prendas_change >= 1) {
    textLog = "+ " + prendas_change;
  } else if (prendas_change < 0) {
    textLog = prendas_change;
    console.log("sdas", textLog);
  }

  const save_record = async (value) => {
    var jsonValue = await AsyncStorage.getItem("Tarjetas_probadores");
    jsonValue = JSON.parse(jsonValue);
    if (prendas === "" && !prendas_bol) {
      setreading(false);
      setsending(false);
      Alert.alert("Ingresa un valor valido de prendas.");

      return false;
    }
    if (prendas_bol) {
      console.log("entro?");
      var time_item = jsonValue.filter((item) => item.id === value);
      var index = jsonValue.findIndex((item) => item.id === value);
      var num_prendas = 0;
      var num_prendas_change = parseInt(prendas_change);

      if (time_item?.length >= 0) {
        try {
          num_prendas = parseInt(
            time_item[time_item.length - 1]["ingreso_prendas"]
          );
          if (num_prendas + num_prendas_change > 0) {
            setprendas(num_prendas + num_prendas_change);
          } else {
            setprendas(0);
          }
        } catch {
          setprendas("");
        }
        if (num_prendas + num_prendas_change > 0) {
          time_item[time_item.length - 1]["ingreso_prendas"] =
            num_prendas + num_prendas_change;
        } else {
          time_item[time_item.length - 1]["ingreso_prendas"] = 0;
        }

        // time_item[0]["hora_salida"] = hora_val;

        console.log("esto es si");
        jsonValue[index] = time_item[time_item.length - 1];
        await AsyncStorage.setItem(
          "Tarjetas_probadores",
          JSON.stringify(jsonValue)
        );
        setreading(false);
        setsending(false);
        NfcManager.cancelTechnologyRequest();
      }
      setprendas_bol(false);
      setprendas_change(0);
      return false;
    }

    if (jsonValue !== null) {
      var time_item = jsonValue.filter((item) => item.id === value);
      var index = jsonValue.findIndex((item) => item.id === value);
      if (time_item?.length > 0) {
        if (time_item[time_item.length - 1]["fecha_salida"] === "") {
          setreading(false);
          setprendas("");
          setsending(false);
          Alert.alert("Antes de grabar, primero debes leer esta tarjeta.");
          return false;
        }
      }
    }
    var today = new Date();

    var date_hour = new Date();
    date_hour.setHours(date_hour.getHours() - 5);

    console.log("asdsdasdas", date_hour);

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
    NfcManager.cancelTechnologyRequest();
    setreading(false);
    setprendas("");
    setsending(false);
  };

  const delete_storage = async () => {
    console.log("si se borro");
    await AsyncStorage.removeItem("Tarjetas_probadores");
  };

  const clear_fill_storage = async (json) => {
    console.log("si se borro");

    await AsyncStorage.setItem("Tarjetas_probadores", JSON.stringify(json));
  };

  const read_record = async (value) => {
    // delete_storage();
    if (prendas_bol) {
      Alert.alert("Primero debes grabar la tarjeta.");
      return false;
    }
    var jsonValue = await AsyncStorage.getItem("Tarjetas_probadores");
    jsonValue = JSON.parse(jsonValue);

    // console.log("asdas", jsonValue);
    if (jsonValue != null && value !== "") {
      var time_item = jsonValue.filter((item) => item.id === value);
      var index = jsonValue.findIndex((item) => item.id === value);
      // console.log("este es el index", index);
      if (time_item?.length >= 0) {
        var date_end = new Date();
        date_end.setHours(date_end.getHours() - 5);
        var hour_date = new Date().getHours();
        var min = new Date().getMinutes();
        var hora_val = String(hour_date) + ":" + String(min).padStart(2, "0");
        console.log("esto es antes", time_item[time_item.length - 1]);
        try {
          setprendas(time_item[time_item.length - 1]["ingreso_prendas"]);
        } catch {
          setprendas("");
        }

        time_item[time_item.length - 1]["prendas_devueltas"] = prendas_keep;
        // time_item[0]["hora_salida"] = hora_val;
        time_item[time_item.length - 1]["fecha_salida"] = date_end;

        // console.log("esto es despues", time_item);
        jsonValue[index] = time_item[time_item.length - 1];

        var send_data = jsonValue.filter((item) => item.fecha_salida !== "");
        var save_data = jsonValue.filter((item) => item.fecha_salida === "");

        console.log("est es lo guardado", jsonValue);
        await AsyncStorage.setItem(
          "Tarjetas_probadores",
          JSON.stringify(jsonValue)
        );
        setreading(false);
        setsending(false);
      }
    }
    console.log("esto es lo que se madna", send_data);
    console.log("esto es lo que se guaarda", save_data);

    fetch(`https://data.arkia.pro/api/services/app/Iot/Received`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: send_data,
        type: "registro tarjeta",
      }),
    }).then((response) => {
      console.log("esta es la", response.status);
      if (response.status === 200) {
        clear_fill_storage(save_data);
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

        <View style={styles.container_disponibles_logo}>
          <Pressable
            style={styles.container_disponibles}
            onPress={() => delete_storage()}
          >
            <Text style={styles.text_info_disponibles_number}>{total}</Text>
          </Pressable>
          <Image
            style={styles.image_heart}
            source={require("../assets/matt_conejo.png")}
          />
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
          <TouchableOpacity onPress={() => cancel_operation()}>
            <Text style={styles.text_info}>Acerca la tarjeta</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.container_number_actions}>
            <Pressable style={styles.button_form_number}>
              <Text
                style={styles.title_button_number}
                onPress={() => change_prendas("-")}
              >
                -
              </Text>
            </Pressable>
            <TextInput
              autoFocus={true}
              keyboardType="numeric"
              style={styles.input_form}
              onChangeText={setprendas}
              value={prendas_bol ? textLog.toString() : prendas.toString()}
              placeholder=""
            ></TextInput>
            <Pressable style={styles.button_form_number}>
              <Text
                style={styles.title_button_number}
                onPress={() => change_prendas("+")}
              >
                +
              </Text>
            </Pressable>
          </View>
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
      {/* <Pressable
        style={styles.icon_settig}
        onPress={() => navigation.navigate("prendas")}
      >
        <Ionicons name="settings" size={30} color="white" />
      </Pressable> */}
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
    marginTop: 90,
  },
  title_button: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
  title_button_number: {
    fontSize: 30,
    color: "white",
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
    width: "30%",
    height: 60,
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 20,
    fontSize: 40,
    textAlign: "center",
  },
  container_number_actions: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
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
  button_form_number: {
    width: 60,
    height: 60,
    backgroundColor: "#D3D3D1",
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
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

  image_heart: {
    width: 100,
    height: 100,
    resizeMode: "stretch",
    position: "absolute",
    right: 100,
  },
  container_disponibles_logo: {
    display: "flex",
    flexDirection: "row",
  },
});
