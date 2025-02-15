import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/frontend/screens/HomeScreen";
import LoginScreen from "./src/frontend/screens/LoginScreen";
import supabase from "./src/frontend/backend/supabase";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import AccountScreen from "./src/frontend/screens/AccountScreen";
import AuthScreen from "./src/frontend/screens/AuthScreen";
import SignUpScreen from "./src/frontend/screens/SignUpScreen";

export default function App() {
  const Stack = createStackNavigator();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {session && session.user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Account" component={AccountScreen} />
          </>
        ) : (
          <>
          <Stack.Screen name="auth" component={AuthScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Account" component={AccountScreen} />
          <Stack.Screen name="signup" component={SignUpScreen} />
          </>
        )}
        
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
