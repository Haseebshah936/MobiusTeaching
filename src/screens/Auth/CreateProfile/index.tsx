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
  ImagePicker,
  ScreenWrapper,
} from "../../../components";
import { useCustomContext } from "../../../hooks/useCustomContext";
import {
  createProfile,
  signIn,
  uploadImage,
} from "../../../config/firebase/functions";

const profileValidationSchema = yup.object().shape({
  photoUrl: yup.string().required("Profile Picture is Required"),
  dateOfBirth: yup
    .date()
    .required("Date of Birth is Required")
    .test(function (value) {
      if (value > new Date()) {
        return this.createError({
          message: "Date of Birth cannot be in the future",
        });
      }
      if (value) {
        const age = new Date().getFullYear() - value.getFullYear();
        if (age < 18) {
          return this.createError({
            path: "dateOfBirth",
            message: "Age must be 18 or older",
          });
        }
      }
      return true;
    }),
  name: yup.string().required("Name is Required"),
  type: yup.string(),
});

type values = {
  photoUrl: string;
  dateOfBirth: any;
  name: string;
  type: string;
};

const CreateProfile = ({ navigation }) => {
  const { user, setUser } = useCustomContext();
  const handleCreateProfile = async (
    values?: values,
    setSubmitting?: any,
    setFieldError?: any
  ) => {
    try {
      await createProfile(
        values.name,
        values.photoUrl,
        values.dateOfBirth,
        values.type
      );
      setUser({ ...user, ...values });
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      Alert.alert("Error", error?.code?.split("/")[1].split("-").join(" "));
    }
  };

  return (
    <ScreenWrapper>
      <Formik
        initialValues={{
          photoUrl: "",
          dateOfBirth: "",
          name: "",
          type: "student",
        }}
        validationSchema={profileValidationSchema}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          handleCreateProfile(values, setSubmitting, setFieldError);
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
              <Text style={styles.title}>Create Profile</Text>
            </View>
            <ImagePicker
              imageUri={values.photoUrl}
              setImageUri={(uri) => setFieldValue("photoUrl", uri)}
              onBlur={() => setFieldTouched("photoUrl")}
              touched={touched.photoUrl}
              error={errors.photoUrl}
            />
            <View>
              <CustomTextInput
                label="Name"
                placeholder={"John doe"}
                onChangeText={handleChange("name")}
                onBlur={() => setFieldTouched("name")}
                value={values.name}
                selectionColor={colors.primary}
                touched={touched.name}
                error={errors.name}
              />
              <CustomTextInput
                label="Date of Birth"
                //   labelStyle={styles.inputLabelText}
                isDateInput={true}
                onChangeText={(date: any) => {
                  setFieldValue("dateOfBirth", date);
                }}
                onBlur={() => setFieldTouched("dateOfBirth")}
                inputContainerStyle={{ paddingLeft: 20 }}
                value={values.dateOfBirth}
                selectionColor={colors.primary}
                touched={touched.dateOfBirth}
                error={errors.dateOfBirth}
              />
            </View>
            <CustomButton
              onPress={handleSubmit}
              disabled={isSubmitting || !isValid}
              loading={isSubmitting}
              text="Create Profile"
            />
          </ScrollView>
        )}
      </Formik>
    </ScreenWrapper>
  );
};

export default CreateProfile;

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
