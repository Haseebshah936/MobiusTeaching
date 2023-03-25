import {
  Alert,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Fontisto, Feather, AntDesign } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import {
  ConfirmationModalBody,
  CustomIconButton,
  CustomModal,
  EmptyList,
  TextInputModalBody,
} from "../../../components";
import colors from "../../../utils/colors";
import { useCustomContext } from "../../../hooks/useCustomContext";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../config/firebase";
import { FlashList } from "@shopify/flash-list";
import Announcement from "./Announcement";

const Class = ({ navigation, route }) => {
  const { item } = route.params;
  const { user } = useCustomContext();
  const [state, setState] = useState({
    copyingCode: false,
    loading: true,
    announcements: [],
    leavingClass: false,
    refreshing: false,
    reloading: false,
  });
  const copyCodeModalRef = useRef(null);
  const confirmationModalRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: item.name,
      headerRight: () =>
        user.type === "teacher" && user.id === item.creatorId ? (
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
                navigation.navigate("Create Announcement", {
                  item,
                });
              }}
            >
              <AntDesign name="plus" size={18} color={colors.black} />
            </CustomIconButton>
          </View>
        ) : (
          <CustomIconButton onPress={() => confirmationModalRef.current.open()}>
            <Feather name="log-out" size={20} color={colors.danger} />
          </CustomIconButton>
        ),
    });
  }, [item]);

  useEffect(() => {
    const ref = collection(db, "announcements");
    const q = query(
      ref,
      where("classId", "==", item.id),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const announcements = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setState((prev) => ({
        ...prev,
        announcements,
        loading: false,
        refreshing: false,
      }));
    });
    return unsubscribe;
  }, [state.reloading]);

  const handleStateChange = (key: string, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const copyToClipboard = async () => {
    handleStateChange("copyingCode", true);
    await Clipboard.setStringAsync(item.id);
    handleStateChange("copyingCode", false);
    copyCodeModalRef.current?.close();
  };

  const handleClassLeave = async () => {
    handleStateChange("leavingClass", true);
    try {
      const ref = collection(db, "participants");
      const classRef = doc(db, "classes", item.id);
      const q = query(
        ref,
        where("classId", "==", item.id),
        where("participantId", "==", auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const participant = snapshot.docs[0];
      await updateDoc(classRef, {
        students: increment(-1),
      });
      await deleteDoc(participant.ref);
      handleStateChange("leavingClass", false);
      confirmationModalRef.current?.close();
      navigation.goBack();
    } catch (error) {
      console.log(error);
      handleStateChange("leavingClass", false);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={state.announcements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Announcement
            item={item}
            onCommentPress={() =>
              navigation.navigate("Comments", {
                item,
              })
            }
            onPress={() => navigation.navigate("Announcement", { item })}
          />
        )}
        estimatedItemSize={100}
        ListEmptyComponent={<EmptyList loading={state.loading} />}
        contentContainerStyle={{
          paddingVertical: 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={() => {
              handleStateChange("refreshing", true);
              handleStateChange("reloading", !state.reloading);
            }}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
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
          onPressBtn1={handleClassLeave}
          onPressBtn2={confirmationModalRef.current?.close}
          loading={state.leavingClass}
        />
      </CustomModal>
    </View>
  );
};

export default Class;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
