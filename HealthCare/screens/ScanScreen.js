import React, { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
export default function ScanScreen() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = React.useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        setLoading(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: true,
        });

        // Send to backend
        // Note: For Android emulator, localhost might need to be 10.0.2.2.
        // For iOS simulator, localhost is fine.
        // For physical device, need IP address.
        // Assuming simulator/emulator for now.

        // We can send base64 directly or use FormData. 
        // Since backend expects multipart/form-data (multer), we should use FormData.

        const formData = new FormData();
        formData.append('image', {
          uri: photo.uri,
          name: 'scan.jpg',
          type: 'image/jpeg',
        });

        const response = await fetch('https://healthcare-ai-backend-ohsp.onrender.com/analyze-scan', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const result = await response.json();
        setAnalysis(result.analysis);
      } catch (error) {
        console.error("Analysis failed:", error);
        setAnalysis("Failed to analyze image. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {analysis ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Analysis Result:</Text>
            <ScrollView style={styles.scrollView}>
              <Text style={styles.resultText}>{analysis}</Text>
            </ScrollView>
            <Button title="Scan Again" onPress={() => setAnalysis(null)} />
          </View>
        ) : (
          <>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.text}>Flip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.captureButton]} onPress={takePicture}>
                <View style={styles.captureInner} />
              </TouchableOpacity>
              <View style={styles.button} />
            </View>
            {loading && (
              <View style={styles.loadingOverlay}>
                <Text style={styles.loadingText}>Analyzing...</Text>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'black',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  resultContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 20,
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
});
