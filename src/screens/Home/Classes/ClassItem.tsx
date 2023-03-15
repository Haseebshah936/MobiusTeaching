import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

import { ProfileDetailsCard } from "../../../components";

type ClassItemProps = {
  item: any;
  onPress: () => void;
};

const ClassItem = ({ item, onPress }: ClassItemProps) => {
  const { name, students, image } = item;
  return (
    <ProfileDetailsCard
      title={name}
      icon={<Image source={{ uri: image }} style={styles.profileCardPic} />}
      profileDataComponent={
        <Text
          style={{
            fontSize: 12,
            marginTop: 5,
          }}
        >
          Students: {students}
        </Text>
      }
      onButtonPress={onPress}
      iconRight={<View />}
      containerStyle={styles.profileDetailsCard}
    />
  );
};

export default ClassItem;

const styles = StyleSheet.create({
  profileDetailsCard: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  profileCardPic: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
