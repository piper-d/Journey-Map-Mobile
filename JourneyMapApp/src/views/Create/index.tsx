import React from "react";
import { Text, Button, SafeAreaView } from "react-native";
import { Props } from "../../../App";

export function CreateView({route, navigation}: Props) {
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </SafeAreaView>
  );
}
  