import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.center}>
      <Ionicons name="person-circle-outline" size={80} color="#2196F3" />
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.text}>Name: John Doe</Text>
      <Text style={styles.text}>Email: john@example.com</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, marginTop: 10, fontWeight: "bold" },
  text: { fontSize: 16, marginTop: 5 },
});
