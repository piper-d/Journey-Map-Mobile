import React from "react";
import { View, Text, SafeAreaView, Button } from "react-native";
import { Props } from "../../../App";

export function SettingsView({route, navigation}: Props) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
      </SafeAreaView>
    );
  }