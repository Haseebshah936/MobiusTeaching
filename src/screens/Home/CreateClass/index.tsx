import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import * as yup from "yup";
import { Formik } from "formik";

import {
  CustomButton,
  CustomTextInput,
  ImagePicker,
} from "../../../components";
import colors from "../../../utils/colors";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../../config/firebase";
import { uploadImage } from "../../../config/firebase/functions";

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
      const ref = doc(collection(db, "classes"));
      const image = await uploadImage(`classes/${ref.id}`, values.image);
      await setDoc(ref, {
        name: values.name,
        description: values.description,
        image,
        createdAt: serverTimestamp(),
        creatorId: auth.currentUser.uid,
        students: 0,
      });
      setSubmitting(false);
      navigation.navigate("Classes", {
        newClass: {
          id: ref.id,
          name: values.name,
          description: values.description,
          image,
          creatorId: auth.currentUser.uid,
          students: 0,
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
          <KeyboardAvoidingView behavior="height">
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
          </KeyboardAvoidingView>
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
    flexGrow: 1,
    paddingBottom: 100,
  },
  descriptoinContainer: {
    paddingVertical: 0,
    marginVertical: 0,
    height: 80,
  },
});
