import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
  Alert,
  Button,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { BarCodeScanner, Camera } from "expo-barcode-scanner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationMenu from "./tools/NavigationMenu";

// Pre-step, call this before any NFC operations

export default function RecordScreen({ navigation }) {
  const [loading, setloading] = useState(false);

  const [value_entry, setvalue_entry] = useState("");
  const timeout = useRef(null);
  const textInputRef = useRef({});
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cam_reader, setreader] = useState(false);
  const [keybor_touch, setkeybor_touch] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  const save_record = async (code, status) => {
    var jsonValue = await AsyncStorage.getItem("Prendas_probadas");
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    var hour_date = new Date().getHours();
    var min = new Date().getMinutes();
    var hora_val = String(hour_date) + ":" + String(min).padStart(2, "0");
    var data_agregate = {};
    data_agregate["codigo"] = code;
    data_agregate["fecha"] = today;
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
    await AsyncStorage.setItem("Prendas_probadas", JSON.stringify(jsonValue));
    setvalue_entry("");
    setScanned(false);
  };

  const onChangeHandler = (value) => {
    clearTimeout(timeout.current);
    setvalue_entry(value);
    timeout.current = setTimeout(() => {
      save_record(value);
    }, 1000);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    console.log("data", data);
    setScanned(true);
    setreader(false);
    onChangeHandler(data);
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

  useFocusEffect(
    React.useCallback(() => {
      setvalue_entry("");

      setScanned(false);
      setreader(false);
      askForCameraPermission();

      if (textInputRef.current?.focus) {
        textInputRef.current.focus();
      }
    }, [])
  );
  return (
    <View style={styles.container}>
      <NavigationMenu></NavigationMenu>
      {loading ? (
        <View style={styles.container_loading}>
          <ActivityIndicator
            animating={true}
            size={300}
            style={{ opacity: 1 }}
            color="white"
          ></ActivityIndicator>
        </View>
      ) : (
        <>
          <Pressable
            style={styles.icon_settig}
            onPress={() => navigation.navigate("data")}
          >
            <Ionicons name="settings" size={30} color="white" />
          </Pressable>
          <Text style={styles.text_info}>Escanear Items</Text>

          {cam_reader ? (
            <View style={styles.barcodebox}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{ height: 400, width: 400 }}
              />
            </View>
          ) : (
            <TextInput
              showSoftInputOnFocus={keybor_touch ? true : false}
              autoFocus={true}
              style={styles.input_form}
              onChangeText={
                isKeyboardVisible ? setvalue_entry : onChangeHandler
              }
              value={value_entry}
              placeholder={"Ingresar código"}
              ref={textInputRef}
              onPressIn={() => setkeybor_touch(!keybor_touch)}
              onSubmitEditing={() => save_record(value_entry)}
            ></TextInput>
          )}
        </>
      )}
      <Pressable
        style={styles.button_form}
        onPress={() =>
          hasPermission === null
            ? askForCameraPermission()
            : setreader(!cam_reader)
        }
      >
        <Entypo name="camera" size={24} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container_loading: {
    display: "flex",
    with: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    display: "flex",
    backgroundColor: "black",
    flex: 1,
    alignItems: "center",
  },
  container_image: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    width: 200,
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "black",
  },
  image: {
    width: 230,
    height: 180,
    borderRadius: 20,
    marginRight: 1,
    marginTop: 20,
  },
  text_info: {
    fontSize: 35,
    color: "white",
    fontWeight: "bold",
    marginTop: 100,
  },
  input_form: {
    width: "90%",
    height: 30,
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 30,
  },
  button_form: {
    width: 50,
    height: 50,
    backgroundColor: "#D3D3D1",
    marginTop: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  title_button: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
  },

  icon_settig: {
    position: "absolute",
    right: "45%",
    bottom: 10,
  },
  icon_delete: {
    position: "absolute",
    left: 15,
    top: 30,
  },
});
