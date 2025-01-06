import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, Alert } from "react-native";
import DeviceInfo from 'react-native-device-info';
import axios from "axios";
import config from "../config";

const { width } = Dimensions.get("window");

const baseUrl = config.backendUrl;

const RegisterAsCoupleScreen = ({ navigation }) => {
  const [ownCode, setOwnCode] = useState("");
  const [partnerCode, setPartnerCode] = useState("");

  useEffect(() => {
    // Fetch your code from the database
    const fetchOwnCode = async () => {
      try {
        const deviceID = await DeviceInfo.getUniqueId();
        console.log("DeviceID:", deviceID);
        const coupleRegisterIDResponse = await axios.get(`${baseUrl}/auth/getCoupleRegisterID`, { params: { ID: deviceID } });
        console.log("Your code:", coupleRegisterIDResponse.data);
        setOwnCode(coupleRegisterIDResponse.data);
      } catch (error) {
        console.error("Error fetching your code:", error);
      }
    };
    fetchOwnCode();
  }, []);

  const handleConnect = async () => {
    if (!partnerCode) {
      Alert.alert("Error", "Please enter your partner's code.");
      return;
    }

    try {
      const deviceID = await DeviceInfo.getUniqueId();
      const user = await axios.get(`${baseUrl}/auth/getUser`, { params: { ID: deviceID } });
      
      if (user.data.length === 0) {
        Alert.alert("Error", "It's wrong code.");
      }

      console.log(partnerCode);

      const coupleID = await axios.patch(`${baseUrl}/auth/updateCouple`, { ID: deviceID, coupleRegisterID: partnerCode });

      console.log(coupleID);

      if (coupleID) {
        Alert.alert("Success", "You are now connected as a couple!", [
          { text: "OK", onPress: () => navigation.navigate("Transition") },
        ]);
      } else {
        Alert.alert("Error", "Failed to connect.");
      }
    } catch (error) {
      console.error("Error connecting with partner:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/img/registerBackground.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.appTitle}>Couple Connect</Text>

        <View style={styles.leftDoor}>
          <Text style={styles.label}>Your Code</Text>
          <Text style={styles.doorText}>{ownCode || "Loading..."}</Text>
        </View>

        <View style={styles.rightDoor}>
          <Text style={styles.label}>Partner's Code</Text>
          <TextInput
            style={styles.doorInput}
            placeholder="Enter"
            placeholderTextColor="#BFAF9F"
            value={partnerCode}
            onChangeText={setPartnerCode}
          />
        </View>

        <View style={styles.centerButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleConnect}>
            <Text style={styles.buttonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // 기존 스타일 코드
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appTitle: {
    position: "absolute",
    top: "10%",
    fontSize: 28,
    color: "#6C4A4A",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "serif",
  },
  leftDoor: {
    position: "absolute",
    left: "10%",
    top: "45%",
    transform: [{ translateY: -50 }],
    width: width * 0.35,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 10,
  },
  rightDoor: {
    position: "absolute",
    right: "10%",
    top: "45%",
    transform: [{ translateY: -50 }],
    width: width * 0.35,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 10,
  },
  label: {
    fontSize: 16,
    color: "#6C4A4A",
    fontWeight: "bold",
    marginBottom: 5,
  },
  doorText: {
    fontSize: 22,
    color: "#6C4A4A",
    fontWeight: "bold",
    textAlign: "center",
  },
  doorInput: {
    width: "90%",
    height: 50,
    backgroundColor: "#FFF5EB",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#6C4A4A",
    borderWidth: 1,
    borderColor: "#D8C3A5",
    textAlign: "center",
  },
  centerButtonContainer: {
    position: "absolute",
    bottom: "15%",
    width: "60%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#C3A692",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RegisterAsCoupleScreen;
