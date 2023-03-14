import { Image, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useRef } from "react";
import {
  ConfirmationModalBody,
  CustomButton,
  CustomModal,
  ProfileDetailsCard,
} from "../../../components";
import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";
import colors from "../../../utils/colors";
import { useCustomContext } from "../../../hooks/useCustomContext";

const Profile = ({ navigation }) => {
  const { user } = useCustomContext();
  const logOutRef = useRef(null);

  const handleSignOut = async () => {
    logOutRef.current.open();
    await SecureStore.deleteItemAsync("auth");
    setTimeout(() => {
      signOut(auth);
    }, 30);
  };

  return (
    <View style={styles.container}>
      <ProfileDetailsCard
        title={`${user?.name}\n${
          user?.type.charAt(0).toUpperCase() + user?.type.slice(1)
        }`}
        activeOpacity={1}
        iconRight={<View />}
        icon={
          <Image
            source={{
              uri: user?.profilePic,
              cache: "reload",
              headers: { Pragma: "no-cache" },
            }}
            style={styles.profilePic}
          />
        }
        containerStyle={{
          marginHorizontal: 0,
          marginVertical: 0,
        }}
      />

      <ProfileDetailsCard
        title="Edit Profile"
        onButtonPress={() => navigation.navigate("Edit Profile")}
        iconRight={
          <MaterialIcons name="arrow-forward-ios" size={24} color="black" />
        }
        containerStyle={styles.profileDetailsCard}
      />
      <ProfileDetailsCard
        title="Settings"
        onButtonPress={() => navigation.navigate("Settings")}
        iconRight={
          <MaterialIcons name="arrow-forward-ios" size={24} color="black" />
        }
        containerStyle={styles.profileDetailsCard}
      />
      <ProfileDetailsCard
        title="Logout"
        onButtonPress={() => logOutRef.current.open()}
        iconRight={
          <MaterialIcons name="arrow-forward-ios" size={24} color="black" />
        }
        containerStyle={styles.profileDetailsCard}
      />
      <CustomModal modalRef={logOutRef}>
        <ConfirmationModalBody
          title="Are you sure?"
          btn1Text="LogOut"
          btn2Text="Cancel"
          onPressBtn1={handleSignOut}
          onPressBtn2={() => logOutRef.current.close()}
        />
      </CustomModal>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: colors.lightGrey,
  },
  profileDetailsCard: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
