import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
  } from "react-native";
  import React, { useState } from "react";
  import supabase from "../backend/supabase";
  
  const SignUpScreen = ({ navigation }: any) => {
    const [showPassword, setShowPassword] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
  
    const signUp = async () => {
      setLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      setLoading(false);
      navigation.navigate("Home");
      console.log("successfull sign up");
    };
  
    const passwordFun = () => {
      setShowPassword(!showPassword);
    };
    return (
      <View style={styles.pageContainer}>
        <View style={styles.textInputContainer}>
          <Text style={styles.titleText}>Create account</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize={"none"}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            autoCapitalize={"none"}
            secureTextEntry={showPassword}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={passwordFun} style={{ padding: 0 }}>
            <Text>Show Password</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.btContainer}>
          <TouchableOpacity style={styles.signUpBtn} onPress={() => signUp()}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.signUpBtnTxt}>Sign up</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.goBackBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.signUpBtnTxt}>Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    pageContainer: {
      paddingTop: 50,
      padding: 10,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    textInputContainer: {
      width: "100%",
      gap: 10,
      padding: 20,
      alignItems: "center",
      justifyContent: "flex-end",
      flex: 1,
    },
    btContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end",
      width: "100%",
      padding: 10,
    },
  
    textInput: {
      borderWidth: 2,
      borderRadius: 10,
      width: '100%',
      borderColor: "lightgreen",
      height: 50,
      padding: 10,
    },
  
    titleText: {
      fontWeight: 900,
      fontSize: 20,
    },
    signUpBtn: {
      backgroundColor: "lightgreen",
      padding: 12,
      borderRadius: 10,
      width: "100%",
      alignItems: "center",
    },
    signUpBtnTxt: {
      fontWeight: 600,
      fontSize: 15,
    },
    goBackBtn: {
      marginTop: 10,
    },
  });
  
  export default SignUpScreen;
  