import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import colors from "../../utils/colors";

type CustomIconButtonProps = {
  onPress: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  underlayColor?: string;
};

const CustomIconButton = ({
  onPress,
  children,
  style,
  underlayColor = colors.lightGrey,
}: CustomIconButtonProps) => {
  return (
    <TouchableHighlight
      style={[styles.iconButton, style]}
      underlayColor={underlayColor}
      onPress={onPress}
    >
      {children}
    </TouchableHighlight>
  );
};

export default CustomIconButton;

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
});
