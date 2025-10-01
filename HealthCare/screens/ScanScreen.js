import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ScanScreen() {
  return (
    <SafeAreaView style={styles.center}>
      <Ionicons name="scan" size={80} color="#4CAF50" />
      <Text style={styles.title}>Scan X-Rays & Prescriptions</Text>
      <Text style={styles.text}>Feature coming soon...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, marginTop: 10, fontWeight: "bold" },
  text: { fontSize: 16, marginTop: 5 },
});
