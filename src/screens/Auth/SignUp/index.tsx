import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React from "react";
// import { TextInput } from "react-native-paper";
import colors from "../../../utils/colors";
import * as yup from "yup";
import { Formik } from "formik";
import {
  CustomButton,
  CustomTextInput,
  ScreenWrapper,
} from "../../../components";
import { useCustomContext } from "../../../hooks/useCustomContext";
import { signUp } from "../../../config/firebase/functions";

const signupValidationSchema = yup.object().shape({
  email: yup.string().email().required("Email Address is Required"),
  password: yup
    .string()
    .min(6, ({ min }) => `Password must be at least ${min} characters`)
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .min(6, ({ min }) => `Password must be at least ${min} characters`)
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Password is required"),
});

const SignUp = ({ navigation }) => {
  const { setUser } = useCustomContext();
  const handleSignUp = async (
    values: any,
    { setSubmitting, setFieldError }
  ) => {
    try {
      await signUp(values.email, values.password);
      setSubmitting(false);
    } catch (error) {
      console.log("🚀 ~ file: index.tsx:43 ~ handleSignUp ~ error:", error);
      setSubmitting(false);
    }
  };
  return (
    <ScreenWrapper>
      <Formik
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={signupValidationSchema}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          handleSignUp(values, {
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
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Create an Account</Text>
            </View>
            <View>
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
              <CustomTextInput
                label="Password"
                placeholder={"Password"}
                textContentType="password"
                secureTextEntry
                onChangeText={handleChange("password")}
                onBlur={() => setFieldTouched("password")}
                value={values.password}
                selectionColor={colors.primary}
                touched={touched.password}
                error={errors.password}
              />
              <CustomTextInput
                label="Confirm Password"
                placeholder={"Confirm Password"}
                textContentType="password"
                secureTextEntry
                onChangeText={handleChange("confirmPassword")}
                onBlur={() => setFieldTouched("confirmPassword")}
                value={values.confirmPassword}
                selectionColor={colors.primary}
                touched={touched.confirmPassword}
                error={errors.confirmPassword}
              />
            </View>
            <View style={styles.row}>
              <View />
              <TouchableOpacity
                style={styles.forgetPassowrdContainer}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.forgetPasswordText}>Forget Password?</Text>
              </TouchableOpacity>
            </View>

            <CustomButton
              onPress={handleSubmit}
              disabled={isSubmitting || !isValid}
              loading={isSubmitting}
              text="SIGN UP"
            />

            <View style={styles.signupTextContainer}>
              <Text style={{ fontSize: 16, color: colors.black }}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                <Text
                  style={{
                    color: colors.primary,
                    textDecorationLine: "underline",
                  }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </Formik>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  logo: { alignSelf: "center", width: 180, height: 180 },
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
