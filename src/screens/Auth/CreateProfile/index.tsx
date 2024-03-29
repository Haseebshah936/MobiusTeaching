import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import * as yup from "yup";
import { Formik } from "formik";

import {
  CustomButton,
  CustomTextInput,
  ImagePicker,
  OptionPicker,
} from "../../../components";
import { useCustomContext } from "../../../hooks/useCustomContext";
import { createProfile } from "../../../config/firebase/functions";
import colors from "../../../utils/colors";

const profileValidationSchema = yup.object().shape({
  profilePic: yup.string().required("Profile Picture is Required"),
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
        if (age < 13) {
          return this.createError({
            path: "dateOfBirth",
            message: "Age must be 13 or older",
          });
        }
      }
      return true;
    }),
  name: yup.string().required("Name is Required"),
  type: yup.string(),
});

type values = {
  profilePic: string;
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
        values.profilePic,
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
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{
          profilePic: "",
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
          <KeyboardAvoidingView behavior="height">
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Create Profile</Text>
              </View>
              <ImagePicker
                imageUri={values.profilePic}
                setImageUri={(uri) => setFieldValue("profilePic", uri)}
                onBlur={() => setFieldTouched("profilePic")}
                touched={touched.profilePic}
                error={errors.profilePic}
                containerStyle={{ alignSelf: "flex-start" }}
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
                  isDateInput={true}
                  onChangeText={(date: any) => {
                    setFieldValue("dateOfBirth", date);
                  }}
                  onBlur={() => setFieldTouched("dateOfBirth")}
                  value={values.dateOfBirth}
                  selectionColor={colors.primary}
                  touched={touched.dateOfBirth}
                  error={errors.dateOfBirth}
                />
                <OptionPicker
                  label="I am a"
                  option1="student"
                  option2="teacher"
                  value={values.type}
                  onChange={(value) => setFieldValue("type", value)}
                />
              </View>
              <CustomButton
                onPress={handleSubmit}
                disabled={isSubmitting || !isValid}
                loading={isSubmitting}
                text="Create Profile"
                btnContainerStyle={{
                  marginTop: 20,
                }}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default CreateProfile;

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
