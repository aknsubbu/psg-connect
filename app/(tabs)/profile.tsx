import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
  BackHandler,
} from "react-native";
import {
  Avatar,
  Card,
  Title,
  Text,
  useTheme,
  Divider,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useStudentData } from "@/hooks/useStudentData";
import AsyncStorage from "@react-native-async-storage/async-storage";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface StudentData {
  "Personal Information": {
    Name: string;
    "Roll Number": string;
    Batch: string;
    Programme: string;
    "Resident Status": string;
  };
  "Family Information": {
    "Father's Name": string;
  };
  "Contact Information": {
    "Student Mobile": string;
    "Student Email": string;
    "Parent Mobile": string;
    "Parent Email": string;
  };
  Address: string;
}

const MAX_LOGIN_ATTEMPTS = 15;

const ProfileScreen: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { data, isLoading, error, isLoggedIn, login, refreshData, logout } =
    useStudentData();
  const colorScheme = useColorScheme();
  const paperTheme = useTheme();

  const isDarkMode = colorScheme === "dark";

  const colors = {
    background: isDarkMode ? "#121212" : "#f5f5f5",
    card: isDarkMode ? "#1e1e1e" : "#ffffff",
    text: isDarkMode ? "#e0e0e0" : "#333333",
    subText: isDarkMode ? "#b0b0b0" : "#666666",
    divider: isDarkMode ? "#333333" : "#e0e0e0",
    error: isDarkMode ? "#cf6679" : "#b00020",
    inputBackground: isDarkMode ? "#333333" : "#ffffff",
    inputBorder: isDarkMode ? "#555555" : "#e0e0e0",
    placeholderText: isDarkMode ? "#888888" : "#999999",
  };

  const studentProfile: StudentData | undefined = data?.student_profile;

  useEffect(() => {
    checkAppLockStatus();
  }, []);

  const checkAppLockStatus = async () => {
    try {
      const lockedStatus = await AsyncStorage.getItem("isAppLocked");
      if (lockedStatus === "true") {
        showLockoutAlertAndExit();
      }
    } catch (error) {
      console.error("Error checking app lock status:", error);
    }
  };

  const handleLogin = async () => {
    try {
      await login(username, password);
      setLoginAttempted(false);
      setLoginAttempts(0);
    } catch (error) {
      console.error("Login error:", error);
      setLoginAttempted(true);
      setLoginAttempts((prevAttempts) => {
        const newAttempts = prevAttempts + 1;
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          lockAppAndExit();
        } else {
          Alert.alert(
            "Login Failed",
            `Your login credentials were rejected. Please try again. ${
              MAX_LOGIN_ATTEMPTS - newAttempts
            } attempts remaining.`
          );
        }
        return newAttempts;
      });
      setUsername("");
      setPassword("");
    }
  };

  const lockAppAndExit = async () => {
    try {
      await AsyncStorage.setItem("isAppLocked", "true");
      showLockoutAlertAndExit();
    } catch (error) {
      console.error("Error locking app:", error);
      BackHandler.exitApp();
    }
  };

  const showLockoutAlertAndExit = () => {
    Alert.alert(
      "App Locked",
      "You have exceeded the maximum number of login attempts. The app is now locked. Please uninstall and reinstall the app to use it again.",
      [
        {
          text: "Exit App",
          onPress: () => BackHandler.exitApp(),
        },
      ],
      { cancelable: false }
    );
  };

  if (isLoading) {
    return (
      <Text style={{ padding: 24, color: colors.text, textAlign: "center" }}>
        Loading...
      </Text>
    );
  }

  if (error) {
    return (
      <Text style={{ padding: 24, color: colors.error, textAlign: "center" }}>
        {error}
      </Text>
    );
  }

  if (!isLoggedIn) {
    return (
      <View
        style={{
          flex: 1,
          padding: 24,
          backgroundColor: colors.background,
          justifyContent: "center",
        }}
      >
        {loginAttempted && (
          <Text
            style={{
              color: colors.error,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Login failed. Please enter your credentials again.
          </Text>
        )}
        <TextInput
          style={{
            height: 50,
            borderColor: colors.inputBorder,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            marginBottom: 16,
            color: colors.text,
            backgroundColor: colors.inputBackground,
          }}
          placeholder="Username"
          placeholderTextColor={colors.placeholderText}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={{
            height: 50,
            borderColor: colors.inputBorder,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            marginBottom: 24,
            color: colors.text,
            backgroundColor: colors.inputBackground,
          }}
          placeholder="Password"
          placeholderTextColor={colors.placeholderText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={{
            backgroundColor: paperTheme.colors.primary,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={handleLogin}
        >
          <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
            {loginAttempted ? "Try Again" : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ alignItems: "center", paddingVertical: 32 }}>
        <Avatar.Icon
          size={100}
          icon="account"
          style={{ backgroundColor: paperTheme.colors.primary }}
        />
        <Title
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: colors.text,
            marginTop: 16,
          }}
        >
          {studentProfile?.["Personal Information"].Name || "Student Name"}
        </Title>
        <Text style={{ color: colors.subText, marginTop: 4 }}>
          {studentProfile?.["Personal Information"]["Roll Number"] ||
            "Roll Number"}
        </Text>
      </View>

      <Card style={{ margin: 16, backgroundColor: colors.card, elevation: 2 }}>
        <Card.Content>
          <InfoItem
            icon="school"
            label="Programme"
            value={studentProfile?.["Personal Information"].Programme}
            colors={colors}
          />
          <InfoItem
            icon="calendar"
            label="Batch"
            value={studentProfile?.["Personal Information"].Batch}
            colors={colors}
          />
          <InfoItem
            icon="home"
            label="Resident Status"
            value={studentProfile?.["Personal Information"]["Resident Status"]}
            colors={colors}
          />
          <InfoItem
            icon="account"
            label="Father's Name"
            value={studentProfile?.["Family Information"]["Father's Name"]}
            colors={colors}
          />
          <InfoItem
            icon="map-marker"
            label="Address"
            value={studentProfile?.Address}
            colors={colors}
          />
        </Card.Content>
      </Card>

      <Card style={{ margin: 16, backgroundColor: colors.card, elevation: 2 }}>
        <Card.Content>
          <Title
            style={{
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 16,
              color: colors.text,
            }}
          >
            Contact Information
          </Title>
          <InfoItem
            icon="email"
            label="Student Email"
            value={studentProfile?.["Contact Information"]["Student Email"]}
            colors={colors}
          />
          <InfoItem
            icon="phone"
            label="Student Mobile"
            value={studentProfile?.["Contact Information"]["Student Mobile"]}
            colors={colors}
          />
          <InfoItem
            icon="email-outline"
            label="Parent Email"
            value={studentProfile?.["Contact Information"]["Parent Email"]}
            colors={colors}
          />
          <InfoItem
            icon="phone-outline"
            label="Parent Mobile"
            value={studentProfile?.["Contact Information"]["Parent Mobile"]}
            colors={colors}
          />
        </Card.Content>
      </Card>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginVertical: 24,
          marginHorizontal: 16,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: paperTheme.colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
          }}
          onPress={refreshData}
        >
          <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
            Refresh Data
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: colors.error,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
          }}
          onPress={logout}
        >
          <Text style={{ color: "#ffffff", fontWeight: "bold" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const InfoItem: React.FC<{
  icon: IconName;
  label: string;
  value?: string;
  colors: any;
}> = ({ icon, label, value, colors }) => (
  <View style={{ marginBottom: 16 }}>
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={colors.subText}
        style={{ marginRight: 8 }}
      />
      <Text style={{ color: colors.subText, fontSize: 14 }}>{label}</Text>
    </View>
    <Text style={{ color: colors.text, fontSize: 16, marginLeft: 28 }}>
      {value || "Not Available"}
    </Text>
    <Divider style={{ backgroundColor: colors.divider, marginTop: 12 }} />
  </View>
);

export default ProfileScreen;
