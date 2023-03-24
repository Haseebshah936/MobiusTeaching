import { StyleSheet, Text, View } from "react-native";
import React from "react";
import WebView from "react-native-webview";

const AttachmentViewer = ({ navigation, route }) => {
  const { item } = route.params;
  return (
    <WebView
      style={{
        flex: 1,
      }}
      source={{ uri: item.attachment.uri }}
    />
  );
};

export default AttachmentViewer;

const styles = StyleSheet.create({});
