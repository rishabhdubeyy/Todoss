import { View, Text, StyleSheet, TouchableOpacity,  } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import supabase from "../backend/supabase";

const AccountScreen = ({ navigation }: any) => {
  const backBtn = () => {
    navigation.goBack();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigation.navigate("auth");
  };
  return (
    <View style={styles.pageContainer}>
      <Ionicons name="arrow-back" size={24} color="black" onPress={backBtn} />
      <TouchableOpacity style={styles.signOutBtn}>
        <Text onPress={signOut} style={{fontWeight: 'bold'}}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    paddingTop: 40,
    padding: 10,
  },
  signOutBtn: {
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  }
});

export default AccountScreen;
