import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import moment from "moment";

import colors from "../../../utils/colors";
import { CustomIconButton } from "../../../components";

type AnnouncementProps = {
  item: any;
  onPress?: () => void;
  onCommentPress?: () => void;
};

const Announcement = ({
  item,
  onPress = () => {},
  onCommentPress = () => {},
}: AnnouncementProps) => {
  const { title, description, type, comments, createdAt, expiresAt } = item;
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.6}
      onPress={onPress}
    >
      <View style={styles.row}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <View style={styles.typeContainer}>
          <Text style={styles.type}>{type}</Text>
        </View>
      </View>
      {/* <Text numberOfLines={4} style={styles.detailsText}>
        {description}
      </Text> */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={onCommentPress}
          style={styles.commentContainer}
          activeOpacity={0.6}
        >
          <FontAwesome5 name="comment-alt" size={16} color={colors.gray} />
          <Text style={styles.commentText}>{comments ? comments : 0}</Text>
        </TouchableOpacity>
        {/* <CustomIconButton onPress={onPress}>
          <AntDesign name="arrowright" size={20} color={colors.gray} />
        </CustomIconButton> */}
        {/* <TouchableOpacity
          style={styles.seeMoreContainer}
          onPress={onPress}
          activeOpacity={0.6}
        >
          <Text style={styles.seeMoreText}>View Details</Text>
        </TouchableOpacity> */}
        <Text style={styles.dateText}>
          {type === "quiz" ? "Quiz ends on: " : "Posted on: "}
          {moment(
            new Date(
              (type === "quiz" ? expiresAt.seconds : createdAt?.seconds) * 1000
            )
          ).format("h:mm a MM-DD-YYYY")}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Announcement;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "bold", flex: 1 },
  typeContainer: {
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  type: {
    fontSize: 14,
    color: colors.white,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  detailsText: {
    marginTop: 10,
    fontSize: 12,
    textAlign: "justify",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  commentText: {
    fontSize: 12,
    color: colors.gray,
  },
  seeMoreContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  seeMoreText: {
    color: colors.lightPurple,
    fontSize: 12,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 12,
  },
});
