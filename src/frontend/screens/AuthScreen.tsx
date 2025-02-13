import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const AuthScreen = ({ navigation }: any) => {
  return (
    <View style={styles.pageContainer}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text style={styles.headerText}>Todos 🎃</Text>
      </View>
      <TouchableOpacity
        style={styles.signUpBtn}
        onPress={() => navigation.navigate("signup")}
      >
        <Text style={styles.signUpBtnTxt}>Create an account</Text>
      </TouchableOpacity>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity style={styles.signInBtn} onPress={() => navigation.navigate("Login")}>
          <Text>Already have an account?</Text>
          <Text style={styles.signInBtnTxt}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    paddingTop: 40,
    flex: 1,
    padding: 15,
  },

  headerText: {
    marginTop: 330,
    fontSize: 40,
    fontWeight: 900,
  },

  signUpBtn: {
    backgroundColor: "lightgreen",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 380,
  },
  signUpBtnTxt: {
    fontWeight: 600,
    fontSize: 15,
  },
  signInBtn: {
    marginTop: 10,
    flexDirection: "row",
    gap: 5,
  },
  signInBtnTxt: {
    color: "green",
  },
});

export default AuthScreen;
