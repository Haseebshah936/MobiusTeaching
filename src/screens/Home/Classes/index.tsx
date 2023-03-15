import {
  Image,
  RefreshControl,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";

import { useCustomContext } from "../../../hooks/useCustomContext";
import colors from "../../../utils/colors";
import {
  CustomIconButton,
  CustomModal,
  CustomTextInput,
  EmptyList,
  TextInputModalBody,
} from "../../../components";
import ClassItem from "./ClassItem";
import { auth, db } from "../../../config/firebase";

interface Class {
  id: string;
  name: string;
  students: number;
  image: string;
  description: string;
  creatorId: string;
}

const Classes = ({ navigation, route }) => {
  let { newClass } = route.params || {};
  const { user } = useCustomContext();
  const [state, setState] = useState({
    search: "",
    classes: [],
    isLoading: true,
    refreshing: false,
    reloading: false,
    joinClassCode: "",
    joiningClass: false,
    newClassCode: "",
    copyingCode: false,
  });
  const classesDataRef = useRef<Class[]>();
  const joinClassModalRef = useRef(null);
  const copyCodeModalRef = useRef(null);
  const isFocused = useIsFocused();

  // Set header with profile pic and plus button
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
      headerRight: () => (
        <CustomIconButton
          onPress={() => {
            user.type === "teacher"
              ? navigation.navigate("CreateClass")
              : joinClassModalRef.current?.open();
          }}
        >
          <AntDesign name="plus" size={20} color={colors.black} />
        </CustomIconButton>
      ),
    });
  }, [user]);

  // Get classes for teacher or student
  useEffect(() => {
    let unsubscribe: any;
    try {
      unsubscribe =
        user.type === "teacher"
          ? getClassesForTeacher()
          : getClassesForStudent();
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
      handleStateChange("isLoading", false);
      handleStateChange("refreshing", false);
      console.log(error);
    }
    return () => unsubscribe();
  }, [state.reloading, user.type]);

  // Get new class from CreateClass screen
  useEffect(() => {
    if (newClass) {
      // handleStateChange("classes", [newClass, ...state.classes]);
      // classesDataRef.current = [newClass, ...classesDataRef.current];
      handleStateChange("newClassCode", newClass.id);
      copyCodeModalRef.current?.open();
      navigation.setParams({ newClass: null });
    }
  }, [isFocused]);

  const handleStateChange = (key: string, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  //  Get classes for teacher
  const getClassesForTeacher = () => {
    const uid = auth.currentUser.uid;
    const q = query(
      collection(db, "classes"),
      where("creatorId", "==", uid),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (querySnapshot) => {
      const classes: Class[] = [];
      querySnapshot.forEach((doc) => {
        classes.push({
          id: doc.id,
          name: doc.data().name,
          students: doc.data().students,
          image: doc.data().image,
          description: doc.data().description,
          creatorId: doc.data().creatorId,
        });
      });
      handleStateChange("isLoading", false);
      handleStateChange("refreshing", false);
      handleStateChange("classes", classes);
      classesDataRef.current = classes;
    });
  };

  // Get classes for student
  const getClassesForStudent = () => {
    const uid = auth.currentUser.uid;
    const q = query(
      collection(db, "participants"),
      where("participantId", "==", uid),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, async (querySnapshot) => {
      const classes: Class[] = [];
      const promise = [];
      querySnapshot.forEach((participant) => {
        const docRef = doc(db, "classes", participant.data().classId);
        promise.push(getDoc(docRef));
      });
      const docs = await Promise.all(promise);
      docs.forEach((doc) => {
        classes.push({
          id: doc.id,
          name: doc.data().name,
          students: doc.data().students,
          image: doc.data().image,
          description: doc.data().description,
          creatorId: doc.data().creatorId,
        });
      });
      handleStateChange("isLoading", false);
      handleStateChange("refreshing", false);
      handleStateChange("classes", classes);
      classesDataRef.current = classes;
    });
  };

  // Search classes by name
  const handleSearch = (text: string) => {
    handleStateChange("search", text);
    if (!text) {
      return handleStateChange("classes", classesDataRef.current);
    }
    handleStateChange(
      "classes",
      classesDataRef.current.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  // Join class by code (student)
  const handleJoinClass = async (joinClassCode: string) => {
    handleStateChange("joiningClass", true);
    try {
      // Check if class exists
      const classRef = doc(db, "classes", joinClassCode);
      const classSnapshot = await getDoc(classRef);
      if (!classSnapshot.exists()) {
        Alert.alert("Error", "No class found with this code.");
        handleStateChange("joiningClass", false);
        return joinClassModalRef.current?.close();
      }

      // Check if user is already a member of the class
      const ref = collection(db, "participants");
      const q = query(
        ref,
        where("classId", "==", joinClassCode),
        where("participantId", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      // If user is not a member of the class, add them to the class
      if (querySnapshot.empty) {
        await addDoc(ref, {
          participantId: auth.currentUser.uid,
          classId: joinClassCode,
          createdAt: serverTimestamp(),
        });
        await updateDoc(classRef, {
          students: increment(1),
        });
        handleStateChange("classes", [
          {
            id: joinClassCode,
            name: classSnapshot.data().name,
            students: classSnapshot.data().students + 1,
            image: classSnapshot.data().image,
            description: classSnapshot.data().description,
            creatorId: classSnapshot.data().creatorId,
          },
          ...state.classes,
        ]);
        handleStateChange("joinClassCode", "");
      } else {
        Alert.alert("Join Class", "You are already a member of this class.");
      }
      handleStateChange("joiningClass", false);
      joinClassModalRef.current?.close();
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      handleStateChange("joiningClass", false);
      joinClassModalRef.current?.close();
    }
  };

  const copyToClipboard = async () => {
    handleStateChange("copyingCode", true);
    await Clipboard.setStringAsync(state.newClassCode);
    handleStateChange("copyingCode", false);
    copyCodeModalRef.current?.close();
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={state.classes}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 20,
        }}
        ListHeaderComponent={
          <CustomTextInput
            placeholder="Search by class name"
            value={state.search}
            onChangeText={handleSearch}
            iconLeft={<AntDesign name="search1" size={24} color="black" />}
            containerStyle={styles.searchContainer}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            isFormInput={false}
          />
        }
        renderItem={({ item }) => (
          <ClassItem
            item={item}
            onPress={() =>
              navigation.navigate("Class", {
                item,
              })
            }
          />
        )}
        ListEmptyComponent={<EmptyList loading={state.isLoading} />}
        estimatedItemSize={100}
        extraData={1}
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
      <CustomModal modalRef={joinClassModalRef}>
        <TextInputModalBody
          title="Join Class"
          details="Enter class code to join the class. You can ask your teacher for the class code."
          placeholder="Enter class code"
          buttonText="Join"
          onChangeText={(text) => handleStateChange("joinClassCode", text)}
          value={state.joinClassCode}
          btnDisabled={!state.joinClassCode}
          loading={state.joiningClass}
          onPressBtn={() => handleJoinClass(state.joinClassCode)}
        />
      </CustomModal>
      <CustomModal modalRef={copyCodeModalRef}>
        <TextInputModalBody
          title="Class Code"
          details="Share this code with your students to let them join your class."
          placeholder=""
          buttonText="Copy Code"
          editable={false}
          value={state.newClassCode}
          onPressBtn={copyToClipboard}
        />
      </CustomModal>
    </View>
  );
};

export default Classes;

const styles = StyleSheet.create({
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: colors.lightGrey,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  inputContainer: {
    borderColor: colors.lightGrey,
  },
  input: {
    marginLeft: 10,
  },
});
