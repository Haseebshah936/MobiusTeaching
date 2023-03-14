import { Image, StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { signOut } from "firebase/auth";

import {
  ConfirmationModalBody,
  CustomModal,
  ProfileDetailsCard,
} from "../../../components";
import { auth } from "../../../config/firebase";
import colors from "../../../utils/colors";
import { useCustomContext } from "../../../hooks/useCustomContext";

const Profile = ({ navigation }) => {
  const { user } = useCustomContext();
  const logOutRef = useRef(null);

  const handleSignOut = async () => {
    logOutRef.current.open();
    await SecureStore.deleteItemAsync("auth");
    signOut(auth);
  };

  return (
    <View style={styles.container}>
      <ProfileDetailsCard
        title={user?.name}
        profileDataComponent={
          <Text style={styles.detailText}>
            {user?.type.charAt(0).toUpperCase() + user?.type.slice(1)}
          </Text>
        }
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
        titleTextStyle={{
          lineHeight: 15,
          fontSize: 16,
        }}
        containerStyle={{
          marginHorizontal: 0,
          marginVertical: 0,
          // width: "80%",
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
          title="LogOut"
          detailsText="Are you sure you want to logout? You will be redirected to the login screen."
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
  detailText: {
    fontSize: 12,
    marginTop: 5,
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
