import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import React from "react";
import * as yup from "yup";
import { Formik } from "formik";

import {
  CustomButton,
  CustomTextInput,
  ImagePicker,
} from "../../../components";
import { useCustomContext } from "../../../hooks/useCustomContext";
import { updateUserProfile } from "../../../config/firebase/functions";
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

const EditProfile = ({ navigation }) => {
  const { user, setUser } = useCustomContext();
  const handleEditProfile = async (
    values?: values,
    setSubmitting?: any,
    setFieldError?: any
  ) => {
    try {
      await updateUserProfile(
        values.name,
        values.profilePic === user?.profilePic ? "" : values.profilePic,
        values.dateOfBirth,
        values.type
      );
      setUser({ ...user, ...values });
      setSubmitting(false);
      navigation.goBack();
    } catch (error) {
      setSubmitting(false);
      console.log(
        "🚀 ~ file: index.tsx ~ line 100 ~ handleEditProfile ~ error",
        error
      );
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          profilePic: user?.profilePic,
          dateOfBirth: user?.dateOfBirth ? new Date(user?.dateOfBirth) : "",
          name: user?.name,
          type: user?.type,
        }}
        validationSchema={profileValidationSchema}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          handleEditProfile(values, setSubmitting, setFieldError);
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
            <ImagePicker
              imageUri={values.profilePic}
              setImageUri={(uri) => {
                setFieldValue("profilePic", uri);
              }}
              onBlur={() => setFieldTouched("profilePic")}
              touched={touched.profilePic as boolean}
              error={errors.profilePic as string}
              imageContainerStyle={{
                backgroundColor: colors.grey,
              }}
            />
            <CustomTextInput
              label="Name"
              placeholder={"John doe"}
              onChangeText={handleChange("name")}
              onBlur={() => setFieldTouched("name")}
              value={values.name}
              selectionColor={colors.primary}
              touched={touched.name as boolean}
              error={errors.name as string}
            />
            <CustomTextInput
              label="Date of Birth"
              isDateInput={true}
              onChangeText={(date: any) => {
                setFieldValue("dateOfBirth", date);
              }}
              onBlur={() => setFieldTouched("dateOfBirth")}
              value={values.dateOfBirth as any}
              selectionColor={colors.primary}
              touched={touched.dateOfBirth as boolean}
              error={errors.dateOfBirth as string}
            />
            {/* <View style={styles.typeContainer}>
              <Text style={{ color: colors.black, fontSize: 16 }}>
                {"I am a"}
              </Text>
              <View style={styles.btnWrapper}>
                <CustomButton
                  onPress={() => setFieldValue("type", "student")}
                  text="Student"
                  btnContainerStyle={[
                    styles.btnContainer,
                    {
                      backgroundColor:
                        values.type === "student"
                          ? colors.primary
                          : colors.white,
                    },
                  ]}
                  styleBtn={styles.btn}
                  styleText={{
                    textTransform: null,
                    color:
                      values.type === "teacher" ? colors.primary : colors.white,
                  }}
                />
                <CustomButton
                  onPress={() => setFieldValue("type", "teacher")}
                  text="Teacher"
                  btnContainerStyle={[
                    styles.btnContainer,
                    {
                      backgroundColor:
                        values.type === "teacher"
                          ? colors.primary
                          : colors.white,
                    },
                  ]}
                  styleBtn={styles.btn}
                  styleText={{
                    textTransform: null,
                    color:
                      values.type === "student" ? colors.primary : colors.white,
                  }}
                />
              </View>
            </View> */}
            <CustomButton
              onPress={handleSubmit}
              disabled={isSubmitting || !isValid}
              loading={isSubmitting}
              text="Update Profile"
              btnContainerStyle={{
                marginTop: 20,
              }}
            />
          </ScrollView>
        )}
      </Formik>
    </>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexGrow: 1,
    backgroundColor: colors.white,
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
