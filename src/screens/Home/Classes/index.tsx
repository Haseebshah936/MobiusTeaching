import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";

const Classes = () => {
  return (
    <View>
      <Button title="LogOut" onPress={() => signOut(auth)} />
    </View>
  );
};

export default Classes;

const styles = StyleSheet.create({});
