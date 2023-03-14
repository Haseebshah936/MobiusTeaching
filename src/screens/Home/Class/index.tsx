import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";

const Class = ({ navigation, route }) => {
  const { item } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: item.name,
    });
  }, []);

  return (
    <View>
      <Text>Class</Text>
    </View>
  );
};

export default Class;

const styles = StyleSheet.create({});
