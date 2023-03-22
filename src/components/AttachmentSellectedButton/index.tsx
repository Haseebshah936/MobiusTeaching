import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from "react-native";
import React from "react";

import colors from "../../utils/colors";
import Pdf from "../../assets/Icons/Pdf";
import UploadLicence from "../../assets/Icons/UploadLicence";

const AttachmentSellectedButton = ({
  name = "",
  type = "",
  uri = "",
  size = 10000000,
  date = new Date(),
  onPress = () => {},
}) => {
  const dateFormator = (date) => {
    const newDate = new Date(date).toDateString().split(" ");
    return `${newDate[1]} ${newDate[2]}, ${newDate[3]}`;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        styles.btnUpload,
        {
          backgroundColor: name && type ? colors.pdfSelectorBg : colors.white,
        },
      ]}
      onPress={onPress}
    >
      {name && type ? (
        <>
          {type === "pdf" ? (
            <Pdf />
          ) : (
            <Image source={{ uri: uri }} style={styles.img} />
          )}
          <View>
            <Text style={styles.btnName}>{name}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.btnText}>
                {parseFloat((size / (1024 * 1024)).toString()).toFixed(2)} MB
              </Text>
              <Text style={styles.btnText}>
                {dateFormator(date)} &nbsp;at&nbsp;
                {new Date(date).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <UploadLicence />
          <Text
            style={[
              styles.btnText,
              {
                color: colors.black,
              },
            ]}
          >
            Upload your licence
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default AttachmentSellectedButton;

const styles = StyleSheet.create({
  btnUpload: {
    flexDirection: "row",
    alignItems: "center",
    padding: Platform.OS === "ios" ? 20 : 18,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.black,
    marginTop: 10,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 35,
  },
  btnName: {
    marginLeft: 10,
    fontSize: 12,
    marginTop: 5,
    textTransform: "capitalize",
  },
  btnText: {
    marginLeft: 10,
    fontSize: 12,
    marginTop: 5,
    color: colors.black,
  },
});
