import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import * as SecureStore from "expo-secure-store";

import {
  CustomButton,
  CustomModal,
  CustomTextInput,
} from "../../../components";
import { useCustomContext } from "../../../hooks/useCustomContext";
import {
  changePassword,
  deleteAccount,
} from "../../../config/firebase/functions";
import colors from "../../../utils/colors";

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
  const [oldPassword, setOldPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const deleteModalRef = useRef(null);

  const handlePasswordChange = async (
    values,
    { setSubmitting, setFieldError }
  ) => {
    try {
      await changePassword(values.oldPassword, values.password);
      setSubmitting(false);
      navigation.goBack();
    } catch (error) {
      console.log(error);
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount(oldPassword);
      await SecureStore.deleteItemAsync("auth");
      setUser(null);
      setDeleting(false);
    } catch (error) {
      console.log(error);
      error.code === "auth/wrong-password"
        ? Alert.alert("Wrong Password", "Please enter the correct password")
        : Alert.alert("Error", "Something went wrong. Please try again later");
      setDeleting(false);
    }
  };

  return (
    <>
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
              keyboardShouldPersistTaps="handled"
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
                  // styleBtn={styles.button}
                  // styleText={styles.buttonText}
                  disabled={isSubmitting || !isValid}
                  loading={isSubmitting}
                  text={"Update Password"}
                />
              </View>
              <CustomButton
                styleBtn={styles.button}
                // styleText={styles.buttonText}
                text={"Delete Account"}
                onPress={() => deleteModalRef.current.open()}
              />
            </ScrollView>
          )}
        </Formik>
      </KeyboardAvoidingView>
      <CustomModal modalRef={deleteModalRef}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Delete Account</Text>
          <Text style={styles.details}>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Text>
          <CustomTextInput
            placeholder="Enter your password to confirm"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
            inputStyle={styles.inputStyle}
            autoFocus={true}
          />
          <CustomButton
            text="Delete Account"
            onPress={handleDeleteAccount}
            disabled={!oldPassword}
            loading={deleting}
          />
          <View style={{ height: Platform.OS === "ios" ? 120 : 30 }} />
        </View>
      </CustomModal>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  inputContainer: {
    width: "100%",
  },
  inputLabel: {
    flex: 0,
    marginBottom: 5,
  },
  textInputContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  input: {
    marginVertical: 0,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0,
  },
  button: {
    marginTop: 40,
    marginBottom: 20,
  },
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
