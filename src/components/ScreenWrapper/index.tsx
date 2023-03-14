import {
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  ViewStyle,
  SafeAreaView,
} from "react-native";
import React from "react";

import colors from "../../utils/colors";

type ScreenWrapperProps = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

const ScreenWrapper = ({
  children,
  style = styles.container,
}: ScreenWrapperProps) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <KeyboardAvoidingView
        style={[styles.container, style]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
