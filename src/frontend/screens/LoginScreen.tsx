import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import supabase from "../backend/supabase";

const LoginScreen = ({ navigation }: any) => {
  const [showPassword, setShowPassword] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    console.log("error", error);
    navigation.navigate("Home")
    console.log("successful login")
  };

  const passwordFun = () => {
    setShowPassword(!showPassword);
  };
  return (
    <View style={styles.pageContainer}>
      <View style={styles.textInputContainer}>
        <Text style={styles.titleText}>Log in</Text>
        <TextInput
          placeholder="E-mail"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize={"none"}
          style={styles.textInput}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text => setPassword(text))}
          autoCapitalize={"none"}
          secureTextEntry={showPassword}
          style={styles.textInput}
        />
        <TouchableOpacity onPress={passwordFun} style={{ padding: 0 }}>
          <Text>Show Password</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btContainer}>
        <TouchableOpacity
          style={styles.logInBtn}
          onPress={() => logIn()}
        >
          <Text style={styles.logInBtnTxt}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.goBackBtn}
          onPress={() => navigation.navigate("auth")}
        >
          <Text style={styles.logInBtnTxt}>Go back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    padding: 10,
  },
  textInputContainer: {
    width: "100%",
    gap: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  titleText: {
    fontWeight: 900,
    fontSize: 20,
  },
  textInput: {
    borderWidth: 2,
    borderRadius: 10,
    width: "100%",
    borderColor: "lightgreen",
  },
  btContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
    padding: 10,
  },
  logInBtn: {
    backgroundColor: "lightgreen",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  logInBtnTxt: {
    fontWeight: 600,
    fontSize: 15,
  },
  goBackBtn: {
    marginTop: 10,
  },
});

export default LoginScreen;
