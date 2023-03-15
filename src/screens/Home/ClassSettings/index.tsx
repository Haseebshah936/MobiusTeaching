import { StyleSheet, View, ScrollView, Alert } from "react-native";
import React from "react";
import * as yup from "yup";
import { Formik } from "formik";

import {
  CustomButton,
  CustomTextInput,
  ImagePicker,
} from "../../../components";
import colors from "../../../utils/colors";
import {
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../../config/firebase";
import { uploadImage } from "../../../config/firebase/functions";

const classSettingsValidationSchema = yup.object().shape({
  image: yup.string().required("Profile Picture is Required"),
  name: yup.string().required("Name is Required"),
  description: yup.string(),
});

type values = {
  image: string;
  name: string;
  description: string;
};

const ClassSettings = ({ navigation, route }) => {
  const { item } = route.params || {};
  const handleClassSettings = async (
    values?: values,
    setSubmitting?: any,
    setFieldError?: any
  ) => {
    try {
      const ref = doc(db, "classes", item.id);
      const image =
        values.image === item.image
          ? values.image
          : await uploadImage(`classes/${ref.id}`, values.image);
      await updateDoc(ref, {
        name: values.name,
        description: values.description,
        image,
      });
      setSubmitting(false);
      navigation.navigate("Class", {
        item: {
          id: ref.id,
          name: values.name,
          description: values.description,
          image,
        },
      });
    } catch (error) {
      setSubmitting(false);
      Alert.alert("Error", "Something went wrong. Please try again later.");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          image: item.image,
          name: item.name,
          description: item.description,
        }}
        validationSchema={classSettingsValidationSchema}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          handleClassSettings(values, setSubmitting, setFieldError);
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
              text="Update Class"
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

export default ClassSettings;

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
