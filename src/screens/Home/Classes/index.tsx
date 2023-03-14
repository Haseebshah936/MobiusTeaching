import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { useCustomContext } from "../../../hooks/useCustomContext";
import colors from "../../../utils/colors";

const Classes = ({ navigation }) => {
  const { user } = useCustomContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image style={styles.profilePic} source={{ uri: user?.profilePic }} />
        </TouchableOpacity>
      ),
      headerBackground: () => <View />,
    });
  }, [user]);

  return (
    <View>
      <Button title="LogOut" onPress={() => signOut(auth)} />
    </View>
  );
};

export default Classes;

const styles = StyleSheet.create({
  profilePic: {
    width: 35,
    height: 35,
    borderRadius: 35,
    backgroundColor: colors.lightGrey,
  },
});
