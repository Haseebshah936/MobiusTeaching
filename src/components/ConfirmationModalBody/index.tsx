import { StyleSheet, Text, View } from "react-native";
import React from "react";

import CustomButton from "../CustomButton";
import colors from "../../utils/colors";

type ConfirmationModalBodyProps = {
  title: string;
  detailsText?: string;
  btn1Text: string;
  btn2Text: string;
  onPressBtn1: () => void;
  onPressBtn2: () => void;
  loading?: boolean;
  disabled?: boolean;
};

const ConfirmationModalBody = ({
  title,
  detailsText,
  btn1Text,
  btn2Text,
  onPressBtn1,
  onPressBtn2,
  loading,
  disabled,
}: ConfirmationModalBodyProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{title}</Text>
        {detailsText && <Text style={styles.detailsText}>{detailsText}</Text>}
      </View>
      <CustomButton
        text={btn1Text}
        onPress={onPressBtn1}
        loading={loading}
        disabled={disabled || loading}
      />
      <CustomButton
        styleBtn={styles.btnSecondary}
        styleText={styles.btnSecondaryText}
        loaderColor={colors.primary}
        text={btn2Text}
        onPress={onPressBtn2}
      />
    </View>
  );
};

export default ConfirmationModalBody;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 20,
    paddingBottom: 60,
    borderRadius: 30,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  detailsText: {
    textAlign: "center",
    marginTop: 10,
  },
  btnSecondary: {
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 1,
  },
  btnSecondaryText: { color: colors.primary },
});
