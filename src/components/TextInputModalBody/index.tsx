import { Platform, StyleSheet, Text, TextInputProps, View } from "react-native";
import React from "react";
import CustomTextInput from "../CustomTextInput";
import CustomButton from "../CustomButton";

interface TextInputModalBodyProps {
  title: string;
  details: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder: string;
  onPressBtn: () => void;
  loading?: boolean;
  secureTextEntry?: TextInputProps["secureTextEntry"];
  editable?: boolean;
  buttonText?: string;
  btnDisabled?: boolean;
}

const TextInputModalBody = ({
  title,
  details,
  value,
  onChangeText,
  placeholder,
  onPressBtn,
  secureTextEntry,
  editable,
  loading,
  buttonText,
  btnDisabled,
}: TextInputModalBodyProps) => {
  return (
    <View style={styles.modalContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.details}>{details}</Text>
      <CustomTextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        inputStyle={styles.inputStyle}
        autoFocus={true}
        secureTextEntry={secureTextEntry}
        editable={editable}
      />
      <CustomButton
        text={buttonText}
        onPress={onPressBtn}
        disabled={btnDisabled}
        loading={loading}
      />
      <View style={{ height: Platform.OS === "ios" ? 120 : 30 }} />
    </View>
  );
};

export default TextInputModalBody;

const styles = StyleSheet.create({
  modalContainer: {
    paddingTop: 40,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    letterSpacing: 0.5,
  },
  details: {
    marginVertical: 10,
    textAlign: "center",
    alignSelf: "center",
    marginBottom: 30,
  },
  inputStyle: {
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});
