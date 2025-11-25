import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./navigation/TabNavigator";
import SignUp from "./screens/SignUp";
import { UserContext } from "./context/UserContext";

export default function App() {
  const [user, setUser] = useState(null);
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <NavigationContainer>
      {user ? (
        <UserContext.Provider value={user ? { ...user, logout: () => setUser(null) } : null}>
          <TabNavigator />
        </UserContext.Provider>
      ) : (
        <SignUp onLoginSuccess={handleLoginSuccess} />
      )}
    </NavigationContainer>
  );
}
