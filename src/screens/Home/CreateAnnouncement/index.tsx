import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import React, { useRef } from "react";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import * as yup from "yup";
import { Formik } from "formik";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import {
  CustomButton,
  CustomTextInput,
  OptionPicker,
  AttachmentSellectedButton,
  CustomModal,
  ConfirmationModalBody,
} from "../../../components";
import colors from "../../../utils/colors";
import { auth, db } from "../../../config/firebase";
import { uploadData } from "../../../config/firebase/functions";

const createAnnouncmentValidationSchema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string(),
  type: yup.string(),
  attachment: yup.object().shape({
    name: yup.string(),
    uri: yup.string(),
    type: yup.string(),
    size: yup.number(),
  }),
  link: yup.string().test(function (value) {
    if (this.parent.type === "quiz" && !value) {
      return this.createError({
        path: "link",
        message: "Link is Required",
      });
    }
    return true;
  }),
  expiresAt: yup.date().test(function (value) {
    if (this.parent.type === "quiz" && value <= new Date()) {
      return this.createError({
        message: "Please Select a future expiration time",
      });
    }
    if (this.parent.type === "quiz" && !value) {
      return this.createError({
        path: "expiresAt",
        message: "Expiration Date is Required",
      });
    }
    return true;
  }),
});

type values = {
  title: string;
  description: string;
  type: string;
  attachment: {
    name: string;
    uri: string;
    type: string;
    size: number;
  };
  link: string;
  expiresAt: Date;
};

const CreateAnnouncement = ({ navigation, route }) => {
  const attachmentModalRef = useRef(null);

  const handleCreateAnnouncement = async (
    values?: values,
    setSubmitting?: any,
    setFieldError?: any
  ) => {
    try {
      const ref = doc(collection(db, "announcements"));
      let uri = "";
      if (values.attachment.name && values.attachment.uri)
        uri = await uploadData(
          `announcements/${ref.id}`,
          values.attachment.uri
        );
      await setDoc(ref, {
        title: values.title,
        description: values.description,
        type: values.type,
        attachment: { ...values.attachment, uri },
        expiresAt: values.expiresAt,
        classId: route.params.item.id,
        createdAt: serverTimestamp(),
        creatorId: auth.currentUser.uid,
        link: values.link,
      });
      setSubmitting(false);
      navigation.goBack();
    } catch (error) {
      setSubmitting(false);
      Alert.alert("Error", "Something went wrong. Please try again later.");
      console.log(error);
    }
  };

  const handleImageAttachment = async (setFieldValue) => {
    try {
      attachmentModalRef.current.close();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled)
        setFieldValue("attachment", {
          name: result.assets[0].fileName,
          uri: result.assets[0].uri,
          type: "img",
          size: result.assets[0].fileSize,
        });
      attachmentModalRef.current.close();
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while picking your image."
      );
    }
  };

  const handlePdfAttachment = async (setFieldValue) => {
    try {
      attachmentModalRef.current.close();
      const response = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (response.type === "success")
        setFieldValue("attachment", {
          name: response.name,
          uri: response.uri,
          type: "pdf",
          size: response.size,
        });
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while picking your document."
      );
    }
  };

  return (
    <Formik
      initialValues={{
        title: "",
        description: "",
        type: "info",
        attachment: {
          name: "",
          uri: "",
          type: "",
          size: 0,
        },
        link: "",
        expiresAt: new Date(),
      }}
      validationSchema={createAnnouncmentValidationSchema}
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        handleCreateAnnouncement(values, setSubmitting, setFieldError);
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
        <>
          <KeyboardAvoidingView behavior={"height"} style={styles.container}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
            >
              <CustomTextInput
                label="Title"
                placeholder={"What is the topic?"}
                onChangeText={handleChange("title")}
                onBlur={() => setFieldTouched("title")}
                value={values.title}
                selectionColor={colors.primary}
                touched={touched.title as boolean}
                error={errors.title as string}
              />
              <CustomTextInput
                label="Description"
                placeholder={"What do you want to say"}
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
              <OptionPicker
                label="Announcement Type"
                option1="info"
                option2="quiz"
                value={values.type}
                onChange={(value) => setFieldValue("type", value)}
              />
              {values.type === "quiz" && (
                <>
                  <CustomTextInput
                    label="Link"
                    placeholder={"Quiz Link"}
                    onChangeText={handleChange("link")}
                    onBlur={() => setFieldTouched("link")}
                    value={values.link}
                    selectionColor={colors.primary}
                    touched={touched.link as boolean}
                    error={errors.link as string}
                  />
                  <CustomTextInput
                    label="Expires At"
                    placeholder={"When does this expire?"}
                    onChangeText={(date) => {
                      setFieldValue("expiresAt", date);
                    }}
                    onBlur={() => setFieldTouched("expiresAt")}
                    value={values.expiresAt.toString()}
                    selectionColor={colors.primary}
                    isDateInput={true}
                    dateMode="datetime"
                    error={errors.expiresAt as string}
                    touched={touched.expiresAt as boolean}
                  />
                </>
              )}
              <AttachmentSellectedButton
                name={values.attachment?.name}
                size={values.attachment?.size}
                type={values.attachment?.type}
                uri={values.attachment.uri}
                onPress={() => {
                  Keyboard.dismiss();
                  attachmentModalRef.current.open();
                }}
              />
              <CustomButton
                onPress={handleSubmit}
                disabled={isSubmitting || !isValid}
                loading={isSubmitting}
                text="Create Announcement"
                btnContainerStyle={{
                  marginTop: 20,
                }}
              />
            </ScrollView>
          </KeyboardAvoidingView>
          <CustomModal modalRef={attachmentModalRef}>
            <ConfirmationModalBody
              title="Select Attachment Type"
              detailsText="You can select a PDF or an Image to attach to this announcement."
              btn1Text="PDF"
              btn2Text="Image"
              onPressBtn1={() => handlePdfAttachment(setFieldValue)}
              onPressBtn2={() => handleImageAttachment(setFieldValue)}
            />
          </CustomModal>
        </>
      )}
    </Formik>
  );
};

export default CreateAnnouncement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "android" ? 160 : 190,
  },
  descriptoinContainer: {
    paddingVertical: 0,
    marginVertical: 0,
    height: 80,
  },
});
