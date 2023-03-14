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
import { CustomTextInput } from "../../../components";
import ClassItem from "./ClassItem";

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
  const classesDataRef = useRef<Class[]>();

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
        <TouchableHighlight
          style={styles.plusButton}
          underlayColor={colors.lightGrey}
          onPress={() => navigation.navigate("CreateClass")}
        >
          <AntDesign name="plus" size={20} color={colors.black} />
        </TouchableHighlight>
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
                class: item,
              })
            }
          />
        )}
        estimatedItemSize={100}
        extraData={1}
      />
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
  plusButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
});
