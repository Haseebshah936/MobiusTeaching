import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import React from "react";

import colors from "../../../utils/colors";

const Loading = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.splash}
        source={require("../../../assets/splash.png")}
      />
      <ActivityIndicator
        style={styles.activityIndicator}
        size="large"
        color={colors.primary}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  splash: {
    height: "90%",
    resizeMode: "contain",
  },
  activityIndicator: {
    position: "absolute",
    bottom: 60,
  },
});
