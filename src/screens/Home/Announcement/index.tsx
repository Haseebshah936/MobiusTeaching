import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";

const Announcement = ({ navigation, route }) => {
  const { item } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: item.title,
    });
  }, []);

  return (
    <View>
      <Text>Announcement</Text>
    </View>
  );
};

export default Announcement;

const styles = StyleSheet.create({});
