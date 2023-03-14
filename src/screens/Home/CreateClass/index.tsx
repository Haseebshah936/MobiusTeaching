import { StyleSheet, View, ScrollView } from "react-native";
import React from "react";
import * as yup from "yup";
import { Formik } from "formik";

import {
  CustomButton,
  CustomTextInput,
  ImagePicker,
} from "../../../components";
import colors from "../../../utils/colors";

const createClassValidationSchema = yup.object().shape({
  image: yup.string().required("Profile Picture is Required"),
  name: yup.string().required("Name is Required"),
  description: yup.string(),
});

type values = {
  image: string;
  name: string;
  description: string;
};

const CreateClass = ({ navigation }) => {
  const handleCreateClass = async (
    values?: values,
    setSubmitting?: any,
    setFieldError?: any
  ) => {
    try {
      // await updateUserProfile(
      //   values.name,
      //   values.image === user?.image ? "" : values.image,
      //   values.type
      // );
      // setUser({ ...user, ...values });
      setSubmitting(false);
      navigation.goBack();
    } catch (error) {
      setSubmitting(false);
      console.log(
        "🚀 ~ file: index.tsx ~ line 100 ~ handleCreateClass ~ error",
        error
      );
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          image: "",
          name: "",
          description: "",
        }}
        validationSchema={createClassValidationSchema}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          handleCreateClass(values, setSubmitting, setFieldError);
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
              imageUri={values.image}
              setImageUri={(uri) => {
                setFieldValue("image", uri);
              }}
              onBlur={() => setFieldTouched("image")}
              touched={touched.image as boolean}
              error={errors.image as string}
              imageContainerStyle={{
                backgroundColor: colors.grey,
              }}
              imageFor="other"
            />
            <CustomTextInput
              label="Class Name"
              placeholder={"Mathematics"}
              onChangeText={handleChange("name")}
              onBlur={() => setFieldTouched("name")}
              value={values.name}
              selectionColor={colors.primary}
              touched={touched.name as boolean}
              error={errors.name as string}
            />
            <CustomTextInput
              label="Description"
              placeholder={"What do you teach?"}
              onChangeText={handleChange("description")}
              onBlur={() => setFieldTouched("description")}
              value={values.description}
              selectionColor={colors.primary}
              multiline
              numberOfLines={4}
              inputContainerStyle={styles.descriptoinContainer}
              touched={touched.description as boolean}
              error={errors.description as string}
            />
            <CustomButton
              onPress={handleSubmit}
              disabled={isSubmitting || !isValid}
              loading={isSubmitting}
              text="Create Class"
              btnContainerStyle={{
                marginTop: 20,
              }}
            />
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

export default CreateClass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  descriptoinContainer: {
    paddingVertical: 0,
    marginVertical: 0,
    height: 80,
  },
});
