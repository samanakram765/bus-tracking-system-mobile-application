import {
  TouchableHighlight,
  Image,
  Dimensions,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { List } from "react-native-paper";
import { format } from "timeago.js";

import { colors, defaultStyles } from "../config";

const ListItem = ({
  label,
  icon,
  image,
  description,
  rightIcon,
  onPress,
  color,
  messagesCount,
  created_at,
  studentBoardingStatus,
  onAndOffBoard = false,
}) => {
  console.log("Student on and off : ", studentBoardingStatus);

  const handleLeftProp = (props) => {
    if (image || image === "")
      return (
        <Image
          resizeMode="cover"
          source={
            image ? { uri: image } : require("../assets/profile-avatar.jpg")
          }
          style={defaultStyles.image}
        />
      );
    return icon && <List.Icon {...props} icon={icon} />;
  };

  return (
    <TouchableHighlight onPress={onPress} underlayColor={"#ededed"}>
      <List.Item
        title={label}
        style={{
          width: Dimensions.get("screen").width,
        }}
        titleStyle={[defaultStyles.listItemTitle, { color: color }]}
        description={description ? description : null}
        descriptionStyle={[defaultStyles.listItemDescription, { color: color }]}
        left={(props) => handleLeftProp(props)}
        right={(props) => (
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            {onAndOffBoard && (
              <View
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 10,
                  backgroundColor:
                    studentBoardingStatus === false ||
                    studentBoardingStatus === undefined
                      ? colors.danger
                      : "green",
                }}
              ></View>
            )}

            {messagesCount
              ? messagesCount !== 0 && (
                  <Text style={styles.messagesCount}>{messagesCount}</Text>
                )
              : null}
            {rightIcon ? <List.Icon {...props} icon={rightIcon} /> : null}
            {created_at && <Text>{format(created_at.toDate())}</Text>}
          </View>
        )}
      />
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  messagesCount: {
    backgroundColor: colors.purple,
    fontSize: 20,
    color: "white",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
});

export default ListItem;
