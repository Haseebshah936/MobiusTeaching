import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaViewBase,
  SafeAreaViewComponent,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView
      edges={["left", "right", "top"]}
      style={[styles.container, style]}
    >
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
