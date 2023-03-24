import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import moment from "moment";

import colors from "../../../utils/colors";
import Hyperlink from "react-native-hyperlink";
import { AttachmentSellectedButton } from "../../../components";

const Announcement = ({ navigation, route }) => {
  const { item } = route.params;
  const {
    title,
    description,
    type,
    comments,
    createdAt,
    expiresAt,
    attachment,
  } = item;

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
    });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <Text style={styles.type}>{item.type}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.heading}>
              {type === "quiz" ? "Expires At " : "Posted on: "}
            </Text>
            <Text style={styles.dateText}>
              {moment(
                new Date(
                  (type === "quiz" ? expiresAt.seconds : createdAt.seconds) *
                    1000
                )
              ).format("h:mm a MM-DD-YYYY")}
            </Text>
          </View>
        </View>
        {type === "quiz" && (
          <View style={styles.linkContainer}>
            <Text style={styles.heading}>Link</Text>
            <Hyperlink linkDefault linkStyle={styles.link}>
              <Text selectable style={styles.detailsText}>
                {item.link}
              </Text>
            </Hyperlink>
          </View>
        )}
        <View style={styles.detailsContainer}>
          <Text style={styles.heading}>Details</Text>
          <Hyperlink linkDefault linkStyle={styles.link}>
            <Text selectable style={styles.detailsText}>
              {description}
            </Text>
          </Hyperlink>
        </View>
        <View style={styles.attachmentContainer}>
          <Text style={styles.heading}>Attachments</Text>
        </View>
        <AttachmentSellectedButton
          date={attachment.date}
          name={attachment.name}
          size={attachment.size}
          type={attachment.type}
          uri={attachment.uri}
          // onPress={() => navigation.navigate("AttachmentViewer", { item })}
        />
      </ScrollView>
    </View>
  );
};

export default Announcement;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  subContainer: {
    alignItems: "flex-end",
    rowGap: 5,
  },
  typeContainer: {
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  type: {
    fontSize: 14,
    color: colors.white,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  dateContainer: {
    rowGap: 5,
    alignItems: "center",
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 12,
  },
  linkContainer: {
    marginTop: 20,
  },
  link: {
    color: colors.linkBlue,
  },
  detailsContainer: {
    marginTop: 20,
  },
  detailsText: {
    fontSize: 12,
    marginTop: 10,
  },
  attachmentContainer: {
    marginTop: 20,
  },
});
