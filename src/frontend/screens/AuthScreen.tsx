import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const AuthScreen = ({ navigation }: any) => {
  return (
    <View style={styles.pageContainer}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Text style={styles.headerText}>Todos 🎃</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={{ justifyContent: 'flex-end', flex: 1}}>
          <TouchableOpacity
            style={styles.signUpBtn}
            onPress={() => navigation.navigate("signup")}
          >
            <Text style={styles.signUpBtnTxt}>Create an account</Text>
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={styles.signInBtn}
              onPress={() => navigation.navigate("Login")}
            >
              <Text>Already have an account?</Text>
              <Text style={styles.signInBtnTxt}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    padding: 15,
  },

  headerText: {
    fontSize: 40,
    fontWeight: 900,
    alignSelf: "center",
    justifyContent: "center",
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
