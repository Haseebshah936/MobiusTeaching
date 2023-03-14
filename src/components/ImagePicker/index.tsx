import React from "react";
import {
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Text,
  Image,
  StyleProp,
  ViewStyle,
} from "react-native";
import * as imagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";

import colors from "../../utils/colors";

type ImagePickerProps = {
  imageUri: string;
  setImageUri: (uri: string) => void;
  uploading?: boolean;
  onBlur?: () => void;
  touched?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  imageContainerStyle?: StyleProp<ViewStyle>;
};

function ImagePicker({
  imageUri,
  setImageUri,
  uploading = false,
  onBlur = () => {},
  touched,
  error,
  containerStyle,
  imageContainerStyle,
}: ImagePickerProps) {
  const pickImage = async () => {
    try {
      let result = await imagePicker.launchImageLibraryAsync({
        mediaTypes: imagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      } else {
        Alert.alert("Profile Picture", "You have closed the photo gallery");
        onBlur();
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while picking your image."
      );
    }
  };

  const handleOnPressImp = () => {
    !imageUri
      ? pickImage()
      : Alert.alert("Update", "Are you sure?", [
          { text: "No" },
          {
            text: "Yes",
            onPress: () => pickImage(),
          },
        ]);
  };

  const handleOnPress = () => {
    imagePicker.getMediaLibraryPermissionsAsync().then(({ status }) => {
      if (status != "granted") {
        imagePicker.requestMediaLibraryPermissionsAsync().then(({ status }) => {
          if (status != "granted")
            Alert.alert("Error !!", "Media library permission required.");
          else handleOnPressImp();
        });
      } else handleOnPressImp();
    });
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          if (!uploading) handleOnPress();
        }}
        style={
          uploading
            ? [styles.uploadingContainer, containerStyle]
            : { marginRight: 5 }
        }
      >
        {!uploading ? (
          <View style={[styles.container, imageContainerStyle]}>
            {imageUri && (
              <Image style={styles.image} source={{ uri: imageUri }} />
            )}
            {!imageUri && (
              <Image
                source={require("../../assets/Images/user.png")}
                style={styles.image}
              />
            )}
            {!imageUri && (
              <View style={styles.icon}>
                <AntDesign name="plus" size={15} color={colors.white} />
              </View>
            )}
            {imageUri && (
              <View style={styles.icon}>
                <AntDesign name="edit" size={18} color={colors.white} />
              </View>
            )}
          </View>
        ) : (
          <ActivityIndicator size={"small"} color={colors.white} />
        )}
      </TouchableOpacity>
      <Text style={[styles.errorText]}>{touched && error ? error : ""}</Text>
    </>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  uploadingContainer: {
    width: 80,
    height: 80,
    backgroundColor: colors.white,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    position: "relative",
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "transparent",
  },
  errorText: { fontSize: 10, marginTop: 2, color: colors.danger },
  image: { width: 80, height: 80, borderRadius: 50 },
  icon: {
    position: "absolute",
    top: 5,
    right: -5,
    backgroundColor: colors.black,
    borderRadius: 50,
    padding: 5,
  },
});
