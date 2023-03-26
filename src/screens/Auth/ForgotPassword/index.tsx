import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import * as yup from "yup";
import { Formik } from "formik";

import {
  CustomButton,
  CustomTextInput,
  ScreenWrapper,
} from "../../../components";
import { forgotPassword } from "../../../config/firebase/functions";
import colors from "../../../utils/colors";

const emailValidationSchema = yup.object().shape({
  email: yup.string().email().required("Email Address is Required"),
});

const ForgotPassword = ({ navigation }) => {
  const handleForgotPassword = async (
    values: any,
    { setSubmitting, setFieldError }
  ) => {
    try {
      await forgotPassword(values.email);
      setSubmitting(false);
      Alert.alert("Forgot Password", "Password reset email sent.");
    } catch (error) {
      console.log("🚀 ~ file: index.tsx:43 ~ handleSignUp ~ error:", error);
      Alert.alert("Error", error?.code?.split("/")[1].split("-").join(" "));
      setSubmitting(false);
    }
  };
  return (
    <ScreenWrapper>
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={emailValidationSchema}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          handleForgotPassword(values, {
            setSubmitting,
            setFieldError,
          });
        }}
      >
        {({
          values, // Values object
          handleChange, // onChange function for input
          errors, // Errors object
          setFieldTouched,
          setFieldValue,
          touched, // True if field has been touched
          isValid, // True if all fields are valid
          handleSubmit, // Function to submit form
          isSubmitting,
        }) => (
          <KeyboardAvoidingView behavior="height">
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Forgot Password?</Text>
              </View>
              <Image
                style={styles.logo}
                source={require("../../../assets/icon.png")}
              />
              <View style={styles.inputContainer}>
                <CustomTextInput
                  label="Email"
                  placeholder={"JohnDoe@example.com"}
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  onChangeText={handleChange("email")}
                  onBlur={() => setFieldTouched("email")}
                  value={values.email}
                  selectionColor={colors.primary}
                  touched={touched.email}
                  error={errors.email}
                />
              </View>

              <CustomButton
                onPress={handleSubmit}
                disabled={isSubmitting || !isValid}
                loading={isSubmitting}
                text="RESET PASSWORD"
              />
              <CustomButton
                onPress={() => navigation.navigate("SignIn")}
                text="BACK TO LOGIN"
                styleBtn={{
                  backgroundColor: colors.white,
                  borderColor: colors.black,
                  borderWidth: 1,
                }}
                styleText={{ color: colors.black }}
                loaderColor={colors.primary}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </ScreenWrapper>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  scrollContainer: {
    padding: 15,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 30,
    alignSelf: "center",
    fontWeight: "600",
    marginVertical: 30,
    letterSpacing: 1,
  },
  titleContainer: {
    justifyContent: "center",
  },
  logo: { alignSelf: "center", width: 200, height: 200 },
  inputContainer: {
    justifyContent: "space-evenly",
  },
  inputLabel: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
  },
  errorText: { fontSize: 12, color: "#FF0D10" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.bgColor,
  },
  forgetPassowrdContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  forgetPasswordText: {
    color: colors.black,
  },
  checkBoxContainer: {
    marginLeft: 0,
    paddingLeft: 0,
    backgroundColor: "transparent",
  },
  signupTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
});
