import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import moment from "moment";
import { Feather } from "@expo/vector-icons";

import colors from "../../../utils/colors";
import Hyperlink from "react-native-hyperlink";
import {
  AttachmentSellectedButton,
  ConfirmationModalBody,
  CustomIconButton,
  CustomModal,
  EmptyList,
} from "../../../components";
import { useCustomContext } from "../../../hooks/useCustomContext";
import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../../../config/firebase";
import { deleteObject, ref } from "firebase/storage";

const Announcement = ({ navigation, route }) => {
  const { item } = route.params;
  const { title, description, type, createdAt, expiresAt, attachment, link } =
    item || {};
  const { user } = useCustomContext();
  const [state, setState] = useState({
    deletingAnnouncement: false,
    expired: false,
  });
  const confirmationModalRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
      headerRight: () =>
        user.type === "teacher" && user.id === item.creatorId ? (
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <CustomIconButton
              onPress={() => {
                navigation.navigate("Create Announcement", {
                  item,
                  edit: true,
                });
              }}
            >
              <Feather name="edit" size={18} color="black" />
            </CustomIconButton>
            <CustomIconButton
              onPress={() => confirmationModalRef.current.open()}
            >
              <Feather name="trash" size={20} color={colors.danger} />
            </CustomIconButton>
          </View>
        ) : null,
    });
  }, []);

  useEffect(() => {
    let interval;
    if (type === "quiz") {
      if (expiresAt?.seconds * 1000 < new Date().getTime())
        handleStateChange("expired", true);
      interval = setInterval(() => {
        if (expiresAt?.seconds * 1000 < new Date().getTime()) {
          handleStateChange("expired", true);
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => {
      if (type === "quiz") clearInterval(interval);
    };
  }, []);

  const handleStateChange = (key, value) => {
    setState((state) => ({ ...state, [key]: value }));
  };

  const handleDeleteAnnouncement = async () => {
    handleStateChange("deletingAnnouncement", true);
    try {
      const announcementRef = doc(db, "announcements", item.id);
      await deleteDoc(announcementRef);
      const storageRef = ref(storage, `announcements/${item.id}`);
      await deleteObject(storageRef);
      handleStateChange("deletingAnnouncement", false);
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "Something went wrong while deleting announcement please try again later"
      );
      handleStateChange("deletingAnnouncement", false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <Text style={styles.type}>{type}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.heading}>
              {type === "quiz" ? "End's on " : "Posted At: "}
            </Text>
            <Text style={styles.dateText}>
              {moment(
                new Date(
                  (type === "quiz" ? expiresAt.seconds : createdAt.seconds) *
                    1000
                )
              ).format("h:mm a MM-DD-YYYY")}
            </Text>
          </View>
        </View>
        {!state.expired ? (
          <>
            {type === "quiz" && (
              <View style={styles.linkContainer}>
                <Text style={styles.heading}>Link</Text>
                <Hyperlink linkDefault linkStyle={styles.link}>
                  <Text selectable style={styles.detailsText}>
                    {link}
                  </Text>
                </Hyperlink>
              </View>
            )}
            <View style={styles.detailsContainer}>
              <Text style={styles.heading}>Details</Text>
              <Hyperlink linkDefault linkStyle={styles.link}>
                <Text selectable style={styles.detailsText}>
                  {description}
                </Text>
              </Hyperlink>
            </View>
            <View style={styles.attachmentContainer}>
              <Text style={styles.heading}>Attachment</Text>
            </View>
            <AttachmentSellectedButton
              date={attachment.date}
              name={attachment.name}
              size={attachment.size}
              type={attachment.type}
              uri={attachment.uri}
              // onPress={() =>
              //   navigation.navigate("AttachmentViewer", {
              //     item: route?.params?.item,
              //   })
              // }
            />
          </>
        ) : (
          <EmptyList text="The quiz is no longer available the quiz time has been ended" />
        )}
      </ScrollView>
      <CustomModal modalRef={confirmationModalRef}>
        <ConfirmationModalBody
          title="Delete Announcement"
          detailsText="Are you sure you want to delete this announcement?"
          btn1Text="Delete"
          btn2Text="Cancel"
          onPressBtn1={handleDeleteAnnouncement}
          onPressBtn2={confirmationModalRef.current?.close}
          loading={state.deletingAnnouncement}
        />
      </CustomModal>
    </View>
  );
};

export default Announcement;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  subContainer: {
    alignItems: "flex-end",
    rowGap: 5,
  },
  typeContainer: {
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  type: {
    fontSize: 14,
    color: colors.white,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  dateContainer: {
    rowGap: 5,
    alignItems: "center",
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 12,
  },
  linkContainer: {
    marginTop: 20,
  },
  link: {
    color: colors.linkBlue,
  },
  detailsContainer: {
    marginTop: 20,
  },
  detailsText: {
    fontSize: 12,
    marginTop: 10,
  },
  attachmentContainer: {
    marginTop: 20,
  },
});
