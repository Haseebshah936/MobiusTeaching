import {
  Image,
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
  TextInputModalBody,
} from "../../../components";
import ClassItem from "./ClassItem";
import { ModalizeProps } from "react-native-modalize";

interface Class {
  id: number;
  name: string;
  teacher: string;
  students: number;
  image: string;
}

const data: Class[] = [
  {
    id: 1,
    name: "Class 1",
    teacher: "Teacher 1",
    students: 10,
    image: "https://picsum.photos/200/300",
  },
  {
    id: 2,
    name: "Class 2",
    teacher: "Teacher 2",
    students: 10,
    image: "https://picsum.photos/200/300",
  },
  {
    id: 3,
    name: "Class 3",
    teacher: "Teacher 3",
    students: 10,
    image: "https://picsum.photos/200/300",
  },
  {
    id: 4,
    name: "Class 4",
    teacher: "Teacher 4",
    students: 10,
    image: "https://picsum.photos/200/300",
  },
  {
    id: 5,
    name: "Class 5",
    teacher: "Teacher 5",
    students: 10,
    image: "https://picsum.photos/200/300",
  },
  {
    id: 6,
    name: "Class 6",
    teacher: "Teacher 6",
    students: 10,
    image: "https://picsum.photos/200/300",
  },
  {
    id: 7,
    name: "Class 7",
    teacher: "Teacher 7",
    students: 10,
    image: "https://picsum.photos/200/300",
  },
  {
    id: 8,
    name: "Class 8",
    teacher: "Teacher 8",
    students: 10,
    image: "https://picsum.photos/200/300",
  },
];

const Classes = ({ navigation }) => {
  const { user } = useCustomContext();
  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState<Class[]>([]);
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
    setTimeout(() => {
      setClasses(data);
      classesDataRef.current = data;
    }, 1000);
  }, []);

  const handleSearch = (text) => {
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

  const handleJoinClass = () => {
    setJoiningClass(true);
    setTimeout(() => {
      setJoiningClass(false);
      joinClassModalRef.current?.close();
    }, 1000);
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
        estimatedItemSize={100}
        extraData={1}
      />
      <CustomModal modalRef={joinClassModalRef}>
        <TextInputModalBody
          title="Join Class"
          details="Enter the class code to join the class"
          placeholder="Enter class code"
          buttonText="Join"
          onChangeText={setJoinClassCode}
          value={joinClassCode}
          btnDisabled={!joinClassCode}
          loading={joiningClass}
          onPressBtn={handleJoinClass}
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
