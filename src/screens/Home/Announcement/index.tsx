import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Linking,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import moment from "moment";
import { Feather } from "@expo/vector-icons";
import Hyperlink from "react-native-hyperlink";
import { deleteObject, ref } from "firebase/storage";
import { deleteDoc, doc, onSnapshot } from "firebase/firestore";

import {
  AttachmentSellectedButton,
  ConfirmationModalBody,
  CustomIconButton,
  CustomModal,
  EmptyList,
} from "../../../components";
import { useCustomContext } from "../../../hooks/useCustomContext";
import { db, storage } from "../../../config/firebase";
import colors from "../../../utils/colors";

const Announcement = ({ navigation, route }) => {
  const { user } = useCustomContext();
  const [state, setState] = useState({
    deletingAnnouncement: false,
    expired: false,
    item: route.params.item,
  });
  const confirmationModalRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: state.item.title,
      headerRight: () =>
        user.type === "teacher" && user.id === state.item.creatorId ? (
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <CustomIconButton
              onPress={() => {
                navigation.navigate("Create Announcement", {
                  item: state.item,
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
  }, [state.item]);

  useEffect(() => {
    let interval;
    let unsubscribe;
    if (state.item.type === "quiz") {
      if (state.item.expiresAt?.seconds * 1000 < new Date().getTime())
        handleStateChange("expired", true);
      interval = setInterval(() => {
        if (state.item.expiresAt?.seconds * 1000 < new Date().getTime()) {
          handleStateChange("expired", true);
          clearInterval(interval);
        }
      }, 1000);
    }
    unsubscribe = onSnapshot(doc(db, "announcements", state.item.id), (doc) => {
      if (doc.exists()) {
        const { title } = doc.data();
        navigation.setOptions({ title });
        setState((state) => ({
          ...state,
          item: { ...doc.data(), id: doc.id },
        }));
      } else {
        navigation.goBack();
      }
    });
    return () => {
      if (state.item.type === "quiz") clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleStateChange = (key, value) => {
    setState((state) => ({ ...state, [key]: value }));
  };

  const handleDeleteAnnouncement = async () => {
    handleStateChange("deletingAnnouncement", true);
    try {
      const announcementRef = doc(db, "announcements", state.item.id);
      await deleteDoc(announcementRef);
      const storageRef = ref(storage, `announcements/${state.item.id}`);
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

  const openFile = async (fileUrl) => {
    try {
      const supported = await Linking.canOpenURL(fileUrl);

      if (!supported) {
        console.log(`Can't handle url: ${fileUrl}`);
      } else {
        Linking.openURL(fileUrl);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // const downloadFile = async () => {
  //   const fileUri = attachment.uri; // replace with your file URL
  //   const fileExtension = fileUri.split(".").pop();
  //   const downloadResumable = FileSystem.createDownloadResumable(
  //     fileUri,
  //     FileSystem.documentDirectory + `file.${fileExtension}`
  //   );

  //   try {
  //     const { uri } = await downloadResumable.downloadAsync();
  //     console.log("File downloaded to:", uri);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <Text style={styles.type}>{state.item.type}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.heading}>
              {state.item.type === "quiz" ? "End's on " : "Posted At: "}
            </Text>
            <Text style={styles.dateText}>
              {moment(
                new Date(
                  (state.item.type === "quiz"
                    ? state.item.expiresAt.seconds
                    : state.item.createdAt.seconds) * 1000
                )
              ).format("h:mm a MM-DD-YYYY")}
            </Text>
          </View>
        </View>
        {!state.expired || state.item.creatorId === user.id ? (
          <>
            {state.item.type === "quiz" && (
              <View style={styles.linkContainer}>
                <Text style={styles.heading}>Link</Text>
                <Hyperlink linkDefault linkStyle={styles.link}>
                  <Text selectable style={styles.detailsText}>
                    {state.item.link}
                  </Text>
                </Hyperlink>
              </View>
            )}
            <View style={styles.detailsContainer}>
              <Text style={styles.heading}>Details</Text>
              <Hyperlink linkDefault linkStyle={styles.link}>
                <Text selectable style={styles.detailsText}>
                  {state.item.description}
                </Text>
              </Hyperlink>
            </View>
            <View style={styles.attachmentContainer}>
              <Text style={styles.heading}>Attachment</Text>
            </View>
            {/* <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            > */}
            <AttachmentSellectedButton
              date={state.item.attachment.date}
              name={state.item.attachment.name}
              size={state.item.attachment.size}
              type={state.item.attachment.type}
              uri={state.item.attachment.uri}
              onPress={() => openFile(state.item.attachment.uri)}
            />
            {/* <CustomIconButton onPress={downloadFile}>
                <Feather name="download" size={20} color={colors.primary} />
              </CustomIconButton> */}
            {/* </View> */}
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
