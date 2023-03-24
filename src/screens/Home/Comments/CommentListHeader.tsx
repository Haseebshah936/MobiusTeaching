import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  CustomButton,
  CustomIconButton,
  CustomTextInput,
} from "../../../components";
import colors from "../../../utils/colors";

type CommentListHeaderProps = {
  sending?: boolean;
  onChangeText?: (text: string) => void;
  comment: string;
  onPostPress?: (text?: string) => void;
};

const CommentListHeader = ({
  sending = false,
  onChangeText,
  comment,
  onPostPress,
}: CommentListHeaderProps) => {
  return (
    <View style={styles.commentContainer}>
      <CustomTextInput
        multiline={true}
        placeholder="Write a comment..."
        placeholderTextColor={colors.placeholder}
        numberOfLines={3}
        containerStyle={styles.inputWrapper}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        isFormInput={false}
        onChangeText={onChangeText}
        value={comment}
      />
      <CustomButton
        onPress={onPostPress}
        text="Post"
        btnContainerStyle={styles.btnContainer}
        styleBtn={styles.btn}
        disabled={comment.length === 0 || sending}
        loading={sending}
      />
    </View>
  );
};

export default CommentListHeader;

const styles = StyleSheet.create({
  commentContainer: {
    width: "100%",
    flexDirection: "row",
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  inputWrapper: {
    height: 80,
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: colors.placeholder,
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    paddingRight: 0,
  },
  input: {
    paddingRight: 10,
    textAlign: "justify",
  },
  btnContainer: {
    alignSelf: "center",
    marginLeft: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  btn: {
    marginVertical: 0,
    padding: 0,
    paddingHorizontal: 10,
    paddingVertical: 10,
    minWidth: 70,
  },
});
