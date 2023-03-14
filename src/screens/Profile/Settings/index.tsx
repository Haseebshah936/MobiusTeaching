import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import {
  CustomButton,
  CustomTextInput,
  ScreenWrapper,
} from "../../../components";
import * as yup from "yup";
import colors from "../../../utils/colors";
import { Formik } from "formik";
import { useCustomContext } from "../../../hooks/useCustomContext";

const passwordValidationSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .min(6, ({ min }) => `Old password must be at least ${min} characters`)
    .required("Old password is required"),
  password: yup
    .string()
    .min(6, ({ min }) => `Password must be at least ${min} characters`)
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const Settings = ({ navigation }) => {
  const { user, setUser } = useCustomContext();
  const handlePasswordChange = (values, { setSubmitting, setFieldError }) => {
    console.log(values);
    setTimeout(() => {
      setSubmitting(false);
      setUser({
        ...user,
        password: values.password,
      });
      navigation.goBack();
    }, 1000);
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Formik
        initialValues={{
          oldPassword: user.password,
          password: "",
          confirmPassword: "",
        }}
        validationSchema={passwordValidationSchema}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          handlePasswordChange(values, { setSubmitting, setFieldError });
        }}
      >
        {({
          values, // Values object
          handleChange, // onChange function for input
          errors, // Errors object
          setFieldTouched,
          touched, // True if field has been touched
          isValid, // True if all fields are valid
          handleSubmit, // Function to submit form
          isSubmitting, // True if form is submitting
        }) => (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardDismissMode="on-drag"
          >
            <View style={styles.inputContainer}>
              <CustomTextInput
                label="Old Password"
                placeholder={"Old Password"}
                textContentType={"password"}
                secureTextEntry
                onChangeText={handleChange("oldPassword")}
                onBlur={() => setFieldTouched("oldPassword")}
                value={values.oldPassword}
                selectionColor={colors.primary}
                touched={touched.oldPassword as boolean}
                error={errors.oldPassword as string}
                labelStyle={styles.inputLabel}
                containerStyle={styles.textInputContainer}
                inputStyle={styles.input}
              />
              <CustomTextInput
                label="New Password"
                placeholder={"New Password"}
                textContentType={"password"}
                secureTextEntry
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={() => setFieldTouched("password")}
                selectionColor={colors.primary}
                touched={touched.password}
                error={errors.password}
                labelStyle={styles.inputLabel}
                containerStyle={styles.textInputContainer}
                inputStyle={styles.input}
              />
              <CustomTextInput
                label="Confirm Password"
                placeholder={"Confirm Password"}
                textContentType={"password"}
                secureTextEntry
                onChangeText={handleChange("confirmPassword")}
                onBlur={() => setFieldTouched("confirmPassword")}
                value={values.confirmPassword}
                selectionColor={colors.primary}
                touched={touched.confirmPassword}
                error={errors.confirmPassword}
                labelStyle={styles.inputLabel}
                containerStyle={styles.textInputContainer}
                inputStyle={styles.input}
              />
              <CustomButton
                onPress={handleSubmit}
                styleBtn={styles.button}
                styleText={styles.buttonText}
                disabled={isSubmitting || !isValid}
                loading={isSubmitting}
                text={"Update Password"}
              />
            </View>
            <CustomButton
              styleBtn={styles.button}
              styleText={styles.buttonText}
              text={"Delete Account"}
              onPress={() => {
                Alert.alert("Are you sure?", "This action cannot be undone");
              }}
            />
          </ScrollView>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: "100%",
    flex: 1,
  },
  inputLabel: {
    flex: 0,
    marginBottom: 5,
  },
  textInputContainer: {
    flex: 1,
    maxHeight: 100,
    justifyContent: "flex-start",
  },
  input: {
    paddingVertical: 10,
    marginVertical: 0,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0,
  },
  button: {
    alignSelf: "center",
    marginVertical: 20,
    width: "70%",
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
  },
});
