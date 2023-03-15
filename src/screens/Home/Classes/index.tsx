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
import { ModalizeProps } from "react-native-modalize";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../config/firebase";
import { Alert } from "react-native";

interface Class {
  id: string;
  name: string;
  students: number;
  image: string;
  description: string;
  creatorId: string;
}

const Classes = ({ navigation }) => {
  const { user } = useCustomContext();
  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [joinClassCode, setJoinClassCode] = useState("");
  const [joiningClass, setJoiningClass] = useState(false);
  const classesDataRef = useRef<Class[]>();
  const joinClassModalRef = useRef(null);

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

  useEffect(() => {
    setLoading(true);

    let subscribe: () => void;
    try {
      subscribe =
        user.type === "teacher"
          ? getClassesForTeacher()
          : getClassesForStudent();
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
    return subscribe;
  }, [refreshing, user.type]);

  const getClassesForTeacher = () => {
    const uid = auth.currentUser.uid;
    const q = query(collection(db, "classes"), where("creatorId", "==", uid));
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
      setLoading(false);
      setClasses(classes);
      classesDataRef.current = classes;
    });
  };

  const getClassesForStudent = () => {
    const uid = auth.currentUser.uid;
    const q = query(
      collection(db, "participants"),
      where("participantId", "==", uid)
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
      setLoading(false);
      setClasses(classes);
      classesDataRef.current = classes;
    });
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (!text) {
      return setClasses(classesDataRef.current);
    }
    setClasses(
      classesDataRef.current.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const handleJoinClass = async (joinClassCode: string) => {
    setJoiningClass(true);
    try {
      // Check if class exists
      const classRef = doc(db, "classes", joinClassCode);
      const classSnapshot = await getDoc(classRef);
      if (!classSnapshot.exists()) {
        Alert.alert("Join Class Error", "No class found with this code.");
        setJoiningClass(false);
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
        setJoinClassCode("");
      } else {
        Alert.alert(
          "Join Class Error",
          "You are already a member of this class."
        );
      }
      setJoiningClass(false);
      joinClassModalRef.current?.close();
    } catch (error) {
      Alert.alert(
        "Join Class Error",
        "Something went wrong. Please try again."
      );
      setJoiningClass(false);
      joinClassModalRef.current?.close();
    }
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={classes}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 20,
        }}
        ListHeaderComponent={
          <CustomTextInput
            placeholder="Search by class name"
            value={search}
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
        ListEmptyComponent={<EmptyList loading={isLoading} />}
        estimatedItemSize={100}
        extraData={1}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => setRefreshing(!refreshing)}
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
          onChangeText={setJoinClassCode}
          value={joinClassCode}
          btnDisabled={!joinClassCode}
          loading={joiningClass}
          onPressBtn={() => handleJoinClass(joinClassCode)}
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
