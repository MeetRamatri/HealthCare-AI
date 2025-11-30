import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./navigation/TabNavigator";
import SignUp from "./screens/SignUp";
import { UserContext } from "./context/UserContext";

import { SafeAreaView, StyleSheet, Platform, StatusBar } from "react-native";

export default function App() {
  const [user, setUser] = useState(null);
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        {user ? (
          <UserContext.Provider value={user ? { ...user, logout: () => setUser(null) } : null}>
            <TabNavigator />
          </UserContext.Provider>
        ) : (
          <SignUp onLoginSuccess={handleLoginSuccess} />
        )}
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "white",
  },
});
