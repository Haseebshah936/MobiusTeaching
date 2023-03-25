import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import colors from "../../utils/colors";

const { width, height } = Dimensions.get("window");

type EmptyListProps = {
  loading?: boolean;
  refreshing?: boolean;
  text?: string;
};

const EmptyList = ({ loading = false, text }: EmptyListProps) => {
  return (
    <View
      style={{
        alignItems: "center",
        paddingTop: 20,
      }}
    >
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            height: height / 2,
          }}
        >
          <Image
            style={{
              height: 250,
              width: 250,
            }}
            source={require("../../assets/Images/noData.png")}
          />
          <Text style={styles.text}>{text}</Text>
        </View>
      )}
    </View>
  );
};

export default EmptyList;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: colors.black,
    fontWeight: "bold",
    width: width / 1.5,
    textAlign: "center",
  },
});
