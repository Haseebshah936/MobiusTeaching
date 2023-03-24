import { Alert, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  EmptyList,
  ProfileDetailsCard,
  ScreenWrapper,
} from "../../../components";
import { FlashList } from "@shopify/flash-list";
import compareDate from "../../../utils/DateAndTime/compareDate";
import { useCustomContext } from "../../../hooks/useCustomContext";
import CommentListHeader from "./CommentListHeader";
import { onValue, push, ref, set } from "firebase/database";
import { auth, db, realTimeDB } from "../../../config/firebase";
import { doc, increment, setDoc, updateDoc } from "firebase/firestore";

const Comments = ({ navigation, route }) => {
  const { item } = route.params;
  const { user } = useCustomContext();
  const [state, setState] = useState({
    loading: true,
    comments: [],
    comment: "",
    sending: false,
  });

  useEffect(() => {
    const commentRef = ref(realTimeDB, `comments/${item.id}`);
    const unsubscribe = onValue(commentRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return setState((prev) => ({ ...prev, loading: false }));
      const comments = Object.keys(data)
        .map((key) => data[key])
        .reverse();
      setState((prev) => ({ ...prev, comments, loading: false }));
    });
    return unsubscribe;
  }, []);

  const handleStateChange = (item, value) => {
    setState((prev) => ({ ...prev, [item]: value }));
  };

  const handleCommentPress = async () => {
    handleStateChange("sending", true);
    const commentRef = ref(realTimeDB, `comments/${item.id}`);
    const newCommentRef = push(commentRef);
    try {
      const newComment = {
        id: newCommentRef.key,
        name: auth.currentUser.displayName,
        comment: state.comment,
        createdAt: new Date().getTime(),
        uri: auth.currentUser.photoURL,
        creatorId: auth.currentUser.uid,
      };
      await set(newCommentRef, newComment);
      await updateDoc(doc(db, "announcements", item.id), {
        comments: increment(1),
      });
      setState((prev) => ({ ...prev, comment: "", sending: false }));
    } catch (error) {
      setState((prev) => ({ ...prev, sending: false }));
      Alert.alert(
        "Error",
        "Something went wrong while posting your comment please try again later"
      );
    }
  };

  return (
    <ScreenWrapper>
      <FlashList
        data={state.comments}
        ListHeaderComponent={
          <CommentListHeader
            comment={state.comment}
            onChangeText={(text) => handleStateChange("comment", text)}
            onPostPress={handleCommentPress}
            sending={state.sending}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        renderItem={({ item }) => (
          <ProfileDetailsCard
            icon={
              <Image
                style={styles.profileImage}
                source={
                  item?.uri
                    ? { uri: item.uri }
                    : require("../../../assets/Images/user.png")
                }
              />
            }
            activeOpacity={1}
            containerStyle={styles.containerStyle}
            headerContainerStyle={styles.headerContainerStyle}
            title={item.name}
            iconRight={<Text>{compareDate(item.createdAt)}</Text>}
            dataComponent={<Text>{item.comment}</Text>}
          />
        )}
        ListEmptyComponent={<EmptyList loading={state.loading} />}
        extraData={1}
        estimatedItemSize={100}
        keyExtractor={(item, index) => index.toString()}
      />
    </ScreenWrapper>
  );
};

export default Comments;

const styles = StyleSheet.create({
  containerStyle: {
    marginHorizontal: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerContainerStyle: { paddingBottom: 10 },
});
