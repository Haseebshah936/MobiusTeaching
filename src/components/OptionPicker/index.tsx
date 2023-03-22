import { StyleSheet, Text, View } from "react-native";
import React from "react";

import colors from "../../utils/colors";
import CustomButton from "../CustomButton";

type OptionPickerProps = {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  option1?: string;
  option2?: string;
};

const OptionPicker = ({
  label = "I am a",
  value = "student",
  onChange = () => {},
  option1 = "student",
  option2 = "teacher",
}: OptionPickerProps) => {
  return (
    <View style={styles.typeContainer}>
      <Text style={{ color: colors.black, fontSize: 16 }}>{label}</Text>
      <View style={styles.btnWrapper}>
        <CustomButton
          onPress={() => onChange(option1)}
          text={option1}
          btnContainerStyle={[
            styles.btnContainer,
            {
              backgroundColor:
                value === option1 ? colors.primary : colors.white,
            },
          ]}
          styleBtn={styles.btn}
          styleText={{
            textTransform: "capitalize",
            color: value === option2 ? colors.primary : colors.white,
          }}
        />
        <CustomButton
          onPress={() => onChange(option2)}
          text={option2}
          btnContainerStyle={[
            styles.btnContainer,
            {
              backgroundColor:
                value === option2 ? colors.primary : colors.white,
            },
          ]}
          styleBtn={styles.btn}
          styleText={{
            textTransform: "capitalize",
            color: value === option1 ? colors.primary : colors.white,
          }}
        />
      </View>
    </View>
  );
};

export default OptionPicker;

const styles = StyleSheet.create({
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  btnWrapper: {
    flexDirection: "row",
    columnGap: 10,
  },
  btnContainer: {
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  btn: {
    marginVertical: 0,
    paddingVertical: 5,
    backgroundColor: "transparent",
  },
});
