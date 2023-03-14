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
  StyleProp,
  TextStyle,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import colors from "../../../utils/colors";
import * as yup from "yup";
import { Formik } from "formik";
import {
  CustomButton,
  CustomTextInput,
  ScreenWrapper,
} from "../../../components";
import { useCustomContext } from "../../../hooks/useCustomContext";
import { signIn } from "../../../config/firebase/functions";
import * as SecureStore from "expo-secure-store";

const loginValidationSchema = yup.object().shape({
  email: yup.string().email().required("Email Address is Required"),
  password: yup
    .string()
    .min(6, ({ min }) => `Password must be at least ${min} characters`)
    .required("Password is required"),
});

const Login = ({ navigation }) => {
  const { user, setUser } = useCustomContext();

  const handleLogin = async (values: any, { setSubmitting, setFieldError }) => {
    try {
      await signIn(values.email, values.password);
      const user = JSON.stringify({
        email: values.email,
        password: values.password,
      });
      await SecureStore.setItemAsync("auth", user);
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      error.code === "auth/wrong-password"
        ? Alert.alert("Wrong Password", "Please enter the correct password")
        : Alert.alert("Error", "Something went wrong. Please try again later");
    }
  };

  return (
    <ScreenWrapper>
      <Formik
        initialValues={{
          email: "",
          password: "",
          rememberMe: false,
        }}
        validationSchema={loginValidationSchema}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          handleLogin(values, {
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
              <Text style={styles.title}>Welcome</Text>
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
            </View>
            <View style={styles.row}>
              <View />
              <TouchableOpacity
                style={styles.forgetPassowrdContainer}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.forgetPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <CustomButton
              onPress={handleSubmit}
              disabled={isSubmitting || !isValid}
              loading={isSubmitting}
              text="LOGIN"
            />
            <View style={styles.signupTextContainer}>
              <Text style={{ fontSize: 16, color: colors.black }}>
                You don't have an account yet?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text
                  style={{
                    color: colors.primary,
                    textDecorationLine: "underline",
                  }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </Formik>
    </ScreenWrapper>
  );
};

export default Login;

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
