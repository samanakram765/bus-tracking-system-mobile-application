import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import AppText from "../../components/AppText";
import ListItem from "../../components/ListItem";
import Seperator from "../../components/Seperator";
import { colors, fonts } from "../../config";
import { useVisible } from "../../hooks/useVisible";
import { useImage } from "../../hooks/useImage";
import ImageViewScreen from "../ImageViewScreen";

const StudentProfile = ({ route }) => {
  const { visible, show, hide } = useVisible();
  const { imageUri, imageSet } = useImage();
  const { student } = route.params;

  const {
    firstname,
    lastname,
    parent,
    parentcontact,
    contact,
    address,
    city,
    postalcode,
    rollNo,
    busNo,
    image,
    institute,
    onAndOffBoard,
  } = student || {};

  console.log("Student information :", onAndOffBoard);
  const userDetails = [
    {
      id: 1,
      info: parent,
      icon: "account-child",
      label: "Parent/Guardian Name",
    },
    {
      id: 2,
      info: parentcontact,
      icon: "cellphone",
      label: "Parent/Guardian Contact",
    },
    { id: 3, info: contact, icon: "cellphone", label: "Contact" },
    { id: 4, info: address, icon: "map-marker", label: "Address" },
    { id: 5, info: city, icon: "city", label: "City" },
    { id: 6, info: postalcode, icon: "post", label: "Postal Code" },
    { id: 7, info: rollNo, icon: "numeric", label: "Roll No" },
    { id: 8, info: busNo, icon: "bus", label: "Bus No" },
  ];

  return (
    <>
      <View style={styles.container}>
        <FlatList
          style={{ flex: 1, paddingHorizontal: 20 }}
          ListHeaderComponent={
            <>
              <View style={styles.imageAndDetails}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    show();
                    imageSet(image);
                  }}
                >
                  <Image
                    style={styles.image}
                    source={
                      image
                        ? { uri: image }
                        : require("../../assets/student-avatar.jpeg")
                    }
                  />
                </TouchableOpacity>
                <AppText
                  style={styles.name}
                >{`${firstname} ${lastname}`}</AppText>
                <AppText style={styles.address}>{institute}</AppText>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AppText>Status</AppText>
                  <View
                    style={{
                      marginLeft: 20,
                      width: 15,
                      height: 15,
                      borderRadius: 10,
                      backgroundColor:
                        onAndOffBoard === false || onAndOffBoard === undefined
                          ? colors.danger
                          : "green",
                    }}
                  ></View>
                </View>
              </View>
              <Seperator />
              <AppText style={styles.heading}>Personal Information</AppText>
            </>
          }
          data={userDetails}
          keyExtractor={(user) => user.id.toString()}
          renderItem={({ item }) => (
            <ListItem
              description={item.info}
              label={item.label}
              icon={item.icon}
              style={styles.listItem}
            />
          )}
        />
      </View>
      <ImageViewScreen hideModal={hide} imageUri={imageUri} visible={visible} />
    </>
  );
};

const styles = StyleSheet.create({
  address: {
    fontSize: 18,
    fontStyle: "italic",
    color: colors.lightBlack,
  },
  container: {
    flex: 1,
  },

  heading: {
    fontSize: 27,
    marginTop: 5,
    fontFamily: fonts.PoppinsMedium,
    marginLeft: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    marginTop: 50,
    elevation: 10,
  },
  imageAndDetails: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  listItem: {
    marginVertical: 5,
    padding: 0,
  },
  name: {
    fontSize: 22,
    fontFamily: fonts.PoppinsBold,
    color: colors.mediumBlack,
  },
});

export default StudentProfile;
