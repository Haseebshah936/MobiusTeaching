import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import React from "react";
import colors from "../../utils/colors";

type CustomButtonProps = {
  onPress?: () => void | object;
  loading?: boolean;
  disabled?: boolean;
  text?: string;
  btnContainerStyle?: StyleProp<ViewStyle>;
  styleBtn?: StyleProp<ViewStyle>;
  styleText?: StyleProp<TextStyle>;
  iconTextContainerStyle?: StyleProp<ViewStyle>;
  Righticonstyle?: StyleProp<ViewStyle>;
  styleLoader?: StyleProp<ViewStyle>;
  loaderColor?: string;
  icon?: any;
  iconRight?: any;
  activeOpacity?: number;
};

const CustomButton = ({
  onPress = () => {},
  loading = false,
  disabled = false,
  text = "LOG IN",
  btnContainerStyle,
  styleBtn = styles.button,
  styleText = styles.btnText,
  styleLoader = styles.ActivityIndicator,
  loaderColor = "white",
  iconTextContainerStyle = styles.row,
  icon,
  iconRight,
  Righticonstyle,
  activeOpacity = 0.6,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      disabled={loading || disabled}
      style={btnContainerStyle}
    >
      <View
        style={[
          styles.button,
          styleBtn,
          {
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {loading ? ( // if loading is true, show the ActivityIndicator
          <ActivityIndicator
            size={20}
            style={[styles.ActivityIndicator, styleLoader]}
            color={loaderColor}
          />
        ) : (
          <View style={[styles.row, iconTextContainerStyle]}>
            {icon}
            <Text style={[styles.btnText, styleText]}>{text}</Text>
            <View style={[Righticonstyle]}>{iconRight}</View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    padding: 20,
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
    position: "relative",
    justifyContent: "center",
    zIndex: 1,
    marginVertical: 10,
  },
  btnText: {
    color: colors.white,
    fontWeight: "bold",
    letterSpacing: 1,
    fontSize: 16,
    textTransform: "uppercase",
  },
  ActivityIndicator: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});

{
  /* <Button
            disabled={loading || !isValid}
            loading={loading}
            mode="contained"
            onPress={handleSubmit}
            style={{
              marginVertical: 10,
              borderRadius: 0,
              paddingVertical: 5,
            }}
            labelStyle={{ fontSize: 16 }}

          >
            LOG IN
          </Button> */
}
