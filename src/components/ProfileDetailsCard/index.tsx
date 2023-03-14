import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import colors from "../../utils/colors";
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";

const padding = Platform.OS === "ios" ? 20 : 15;

type ProfileDetailsCardProps = {
  icon?: React.ReactNode;
  title: string;
  iconRight?: React.ReactNode;
  isEdit?: boolean;
  isDelete?: boolean;
  dividerVisible?: boolean;
  dataComponent?: React.ReactNode;
  profileDataComponent?: React.ReactNode;
  profileDataContainerStyle?: StyleProp<ViewStyle>;
  onButtonPress?: () => void;
  onDeletePress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  headerContainerStyle?: StyleProp<ViewStyle>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  titleTextStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  dataContainerStyle?: StyleProp<ViewStyle>;
  editButtonColor?: string;
  activeOpacity?: number;
};

const ProfileDetailsCard = ({
  icon,
  title,
  iconRight = null,
  isEdit = false,
  isDelete = false,
  dividerVisible = true,
  dataComponent,
  profileDataComponent,
  profileDataContainerStyle,
  onButtonPress,
  onDeletePress,
  containerStyle = styles.container,
  headerContainerStyle = styles.headerContainer,
  titleContainerStyle = styles.titleContainer,
  titleTextStyle = styles.titleText,
  buttonStyle = styles.btn,
  dataContainerStyle = styles.dataContainer,
  editButtonColor = colors.primary,
  activeOpacity = 0.6,
}: ProfileDetailsCardProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onButtonPress}
        style={[styles.headerContainer, headerContainerStyle]}
      >
        <View style={[styles.titleContainer, titleContainerStyle]}>
          {icon}
          <View
            style={[styles.profileDataContainer, profileDataContainerStyle]}
          >
            <Text numberOfLines={1} style={[styles.titleText, titleTextStyle]}>
              {title}
            </Text>
            {profileDataComponent}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {isDelete && (
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor: isEdit
                    ? colors.white
                    : colors.iconBackground,
                },
                buttonStyle,
              ]}
              activeOpacity={1}
              onPress={onDeletePress}
            >
              <MaterialIcons name="delete" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
          {iconRight ? (
            iconRight
          ) : (
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor: isEdit ? colors.white : colors.primary,
                },
                buttonStyle,
              ]}
              activeOpacity={isEdit ? 0.6 : 1}
              onPress={onButtonPress}
            >
              {isEdit ? (
                <AntDesign name="edit" size={24} color={editButtonColor} />
              ) : (
                <Ionicons name="md-add" size={20} color={colors.white} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      {dataComponent && (
        <>
          {dividerVisible && <View style={styles.divider} />}
          <View style={[styles.dataContainer, dataContainerStyle]}>
            {dataComponent}
          </View>
        </>
      )}
    </View>
  );
};

export default ProfileDetailsCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingHorizontal: padding,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: padding,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileDataContainer: {
    flex: 1,
    marginLeft: 10,
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
  },
  btn: {
    padding: Platform.OS === "ios" ? 5 : 3,
    borderRadius: 50,
  },
  dataContainer: {
    paddingVertical: padding - 5,
    paddingTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.black,
    opacity: 0.1,
  },
});
