import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello! I am Medi Bot 🤖. How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const sendMessage = () => {
    if (input.trim().length === 0) return;
    const userMessage = { id: Date.now().toString(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setTimeout(() => {
      const botMessage = {
        id: Date.now().toString(),
        text: "Abhi backend banaya nhi hai, thoda wait karo... 😅",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);

    setInput("");w
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.sender === "user" ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text style={{ color: "#fff" }}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2", padding: 10 },
  message: { padding: 12, marginVertical: 5, borderRadius: 10, maxWidth: "80%" },
  userMessage: { backgroundColor: "#4CAF50", alignSelf: "flex-end" },
  botMessage: { backgroundColor: "#2196F3", alignSelf: "flex-start" },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    margin: 5,
  },
  input: { flex: 1, paddingHorizontal: 10 },
  sendButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 20 },
});
