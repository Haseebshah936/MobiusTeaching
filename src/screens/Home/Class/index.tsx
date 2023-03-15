import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Fontisto, Feather, AntDesign } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import {
  ConfirmationModalBody,
  CustomIconButton,
  CustomModal,
  TextInputModalBody,
} from "../../../components";
import colors from "../../../utils/colors";
import { useCustomContext } from "../../../hooks/useCustomContext";

const Class = ({ navigation, route }) => {
  const { item } = route.params;
  const { user } = useCustomContext();
  const [state, setState] = useState({
    copyingCode: false,
  });
  const copyCodeModalRef = useRef(null);
  const confirmationModalRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: item.name,
      headerRight: () =>
        user.type === "teacher" ? (
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <CustomIconButton
              onPress={() => {
                navigation.navigate("Class Settings", {
                  item,
                });
              }}
            >
              <Feather name="edit" size={18} color="black" />
            </CustomIconButton>
            <CustomIconButton onPress={() => copyCodeModalRef.current.open()}>
              <Fontisto
                name={Platform.OS === "ios" ? "share-a" : "share"}
                size={Platform.OS === "ios" ? 15 : 18}
                color="black"
              />
            </CustomIconButton>
            <CustomIconButton
              onPress={() => {
                navigation.navigate("Create Announcement");
              }}
            >
              <AntDesign name="plus" size={18} color={colors.black} />
            </CustomIconButton>
          </View>
        ) : (
          <CustomIconButton onPress={() => confirmationModalRef.current.open()}>
            <Feather name="log-out" size={20} color={colors.black} />
          </CustomIconButton>
        ),
    });
  }, [item]);

  const handleStateChange = (key: string, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const copyToClipboard = async () => {
    handleStateChange("copyingCode", true);
    await Clipboard.setStringAsync(item.id);
    handleStateChange("copyingCode", false);
    copyCodeModalRef.current?.close();
  };

  return (
    <>
      <Text>Class</Text>
      <CustomModal modalRef={copyCodeModalRef}>
        <TextInputModalBody
          title="Class Code"
          details="Share this code with your students to let them join your class."
          placeholder=""
          buttonText="Copy Code"
          editable={false}
          value={item.id}
          loading={state.copyingCode}
          onPressBtn={copyToClipboard}
        />
      </CustomModal>
      <CustomModal modalRef={confirmationModalRef}>
        <ConfirmationModalBody
          title="Leave Class"
          detailsText="Are you sure you want to leave this class?"
          btn1Text="Leave Class"
          btn2Text="Cancel"
          onPressBtn1={() => {}}
          onPressBtn2={() => {}}
        />
      </CustomModal>
    </>
  );
};

export default Class;

const styles = StyleSheet.create({});
