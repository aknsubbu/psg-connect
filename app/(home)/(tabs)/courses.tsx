import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import { Button, Avatar } from "react-native-paper";
import { Switch } from "react-native-paper";

export default function SettingsPage() {
  return (
    <SafeAreaView>
      <View className="flex p-5">
        <Text className="text-white text-3xl font-bold py-2">Courses</Text>
      </View>
    </SafeAreaView>
  );
}
