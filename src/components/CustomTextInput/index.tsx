import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import React, { memo, useState } from "react";
import colors from "../../utils/colors";
import { Feather } from "@expo/vector-icons";
import MaskInput from "react-native-mask-input";
import { Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import displayDateWithSlash from "../../utils/DateAndTime/displayDateWithSlash";

type CustomTextInputProps = TextInputProps & {
  onChangeText?: (text: any) => void;
  onBlur?: () => void;
  value?: string | any;
  label?: string;
  isDateInput?: boolean;
  containerStyle?: StyleProp<ViewProps> | any;
  inputContainerStyle?: StyleProp<ViewProps> | any;
  inputStyle?: StyleProp<ViewProps> | any;
  labelStyle?: StyleProp<ViewProps> | any;
  placeholder?: any;
  textContentType?: string;
  touched?: boolean;
  secureTextEntry?: boolean;
  mask?: string | any;
  error?: string;
  errorTextStyle?: StyleProp<ViewProps> | any;
  selectionColor?: string;
  iconLeft?: React.ReactNode | any;
  iconRight?: React.ReactNode | any;
  isFormInput?: boolean;
  placeholderTextColor?: string;
  multiline?: boolean;
  numberOfLines?: number;
  hideEyeIcon?: boolean;
};

const CustomTextInput = ({
  onChangeText = () => {},
  onBlur = () => {},
  value,
  label,
  isDateInput = false,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  labelStyle,
  placeholder,
  textContentType,
  touched,
  secureTextEntry,
  mask = "",
  error,
  errorTextStyle,
  selectionColor = colors.primary,
  iconLeft,
  iconRight,
  isFormInput = true,
  placeholderTextColor = colors.placeholder,
  multiline,
  numberOfLines,
  hideEyeIcon = false,
  ...props
}: CustomTextInputProps) => {
  const [showPassword, setShowPassword] = useState(secureTextEntry);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    onChangeText(date);
    hideDatePicker();
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={[styles.inputLabel, labelStyle]}>{label}</Text>}
      {!isDateInput ? (
        <View style={[styles.row, inputContainerStyle]}>
          {iconLeft}
          {mask === "" ? (
            <TextInput
              placeholder={placeholder}
              onChangeText={onChangeText}
              onBlur={onBlur}
              value={value}
              secureTextEntry={showPassword}
              selectionColor={selectionColor}
              placeholderTextColor={colors.placeholder}
              style={[styles.input, inputStyle]}
              multiline={multiline}
              numberOfLines={numberOfLines}
              {...props}
            />
          ) : (
            <MaskInput
              value={value}
              onChangeText={(masked, unmasked) => {
                onChangeText(unmasked);
              }}
              placeholder={placeholder}
              onBlur={onBlur}
              mask={mask}
              selectionColor={selectionColor}
              style={[styles.input, inputStyle]}
              {...props}
            />
          )}
          {secureTextEntry && !hideEyeIcon && (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setShowPassword((prev) => !prev)}
              style={{ marginLeft: 10 }}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          )}
          {iconRight}
        </View>
      ) : (
        <Pressable
          onPress={() => {
            showDatePicker();
          }}
          style={[styles.row, inputContainerStyle]}
        >
          <Text
            style={[
              styles.input,
              inputStyle,
              {
                color: value ? colors.black : colors.placeholder,
              },
            ]}
          >
            {displayDateWithSlash(value ? value : new Date())}
          </Text>
        </Pressable>
      )}
      {isFormInput && (
        <Text style={[styles.errorText, errorTextStyle]}>
          {touched && error ? error : ""}
        </Text>
      )}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={new Date(value ? value : Date.now())}
        onHide={onBlur}
      />
    </View>
  );
};

export default memo(CustomTextInput);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: colors.white,
    paddingRight: 20,
    paddingLeft: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
  },
  inputLabel: {
    fontSize: 16,
    marginVertical: 10,
    flex: 1,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === "ios" ? 20 : 12,
    color: colors.black,
    fontSize: 14,
  },
  errorText: { fontSize: 12, marginTop: 4, color: colors.danger },
});
