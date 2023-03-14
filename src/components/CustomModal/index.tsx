import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import React from "react";
import { Modalize, ModalizeProps } from "react-native-modalize";

import colors from "../../utils/colors";

type CustomModalProps = ModalizeProps & {
  modalRef: React.RefObject<Modalize>;
  children: React.ReactNode;
  adjustToContentHeight?: boolean;
  modalStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
};

const CustomModal = ({
  modalRef,
  children,
  adjustToContentHeight = true,
  modalStyle = styles.modal,
  headerStyle = styles.modalHeader,
  ...props
}: CustomModalProps) => {
  return (
    <Modalize
      handlePosition="inside"
      handleStyle={[styles.modalHeader, headerStyle]}
      modalStyle={[styles.modal, modalStyle]}
      ref={modalRef}
      adjustToContentHeight={adjustToContentHeight}
      {...props}
    >
      {children}
    </Modalize>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalHeader: {
    top: 13,
    width: 40,
    backgroundColor: "#bcc0c1",
  },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
});
