import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Markdown from 'react-native-markdown-display';
import markdownStyles from './ChatbotStyles';
import { UserContext } from "../context/UserContext";

export default function ChatbotScreen() {
  const user = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "https://healthcare-ai-backend-ohsp.onrender.com";

  useEffect(() => {
    const fetchHistory = async () => {
      const token = user?.token;
      if (!user?.id || !token) return;
      try {
        const response = await fetch(`${API_URL}/chat/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();
        const history = json.chatHistory || [];

        if (!Array.isArray(history) || history.length === 0) {
          setMessages([
            { id: "1", text: "Hello! I am Medi Bot 🤖. How can I help you today?", sender: "bot" },
          ]);
        } else {
          const mapped = history.map((h, idx) => ({ id: h._id ?? idx.toString(), text: h.message, sender: h.role === 'user' ? 'user' : 'bot' }));
          setMessages(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
        setMessages([
          { id: "1", text: "Hello! I am Medi Bot 🤖. How can I help you today?", sender: "bot" },
        ]);
      }
    };

    fetchHistory();
  }, [user])

  const sendMessage = async () => {
    if (input.trim().length === 0) return;

    setIsLoading(true);
    const messageToSend = input
    const userMessage = { id: Date.now().toString(), text: messageToSend, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const token = user?.token;
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ message: messageToSend }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = {
        id: data.id || Date.now().toString() + 'b',
        text: data.reply || data.replyText || 'No reply',
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        id: Date.now().toString() + 'e',
        text: "Sorry, a connection or authentication error occurred. Please try again.",
        sender: "bot"
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.sender === "user" ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Markdown
              style={markdownStyles}
            >
              {item.text}
            </Markdown>
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
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={20} color="#fff" />
          )}
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

