import {
  StyleSheet,
  Image,
  View,
  FlatList,
  Dimensions,
  Modal,
  TouchableOpacity,
} from "react-native";
import ImageView from "react-native-image-viewing";

import AppText from "../../components/AppText";
import Screen from "../../components/Screen";
import Seperator from "../../components/Seperator";
import { colors, fonts } from "../../config";
import ListItem from "../../components/ListItem";
import { removeSession } from "../../storage/storeSession";
import ImageViewScreen from "../ImageViewScreen";
import { useVisible } from "../../hooks/useVisible";
import { useImage } from "../../hooks/useImage";

const DriverProfile = ({ navigation, user, setUser }) => {
  const { visible, show, hide } = useVisible();
  const { imageUri, imageSet } = useImage();

  const {
    address,
    age,
    busNo,
    city,
    contact,
    country,
    // driverDutyEnd,
    // driverDutyTime,
    driverId,
    firstname,
    image,
    institute,
    lastname,
    licenseImage,
    medicalReport,
    postalcode,
    nationalIdentityNumber,
    password,
  } = user;

  const userDetails = [
    {
      id: 1,
      info: driverId,
      icon: "card-account-details-outline",
      label: "Driver Id",
    },
    {
      id: 2,
      info: nationalIdentityNumber,
      icon: "id-card",
      label: "National ID Number",
    },
    { id: 3, info: password, icon: "lock", label: "Password" },
    {
      id: 4,
      info: contact,
      icon: "cellphone",
      label: "Contact",
    },
    {
      id: 5,
      info: address,
      icon: "home",
      label: "Address",
    },
    {
      id: 6,
      info: city,
      icon: "city-variant-outline",
      label: "City",
    },
    {
      id: 7,
      info: country,
      icon: "city-variant-outline",
      label: "Country",
    },
    {
      id: 8,
      info: age,
      icon: "numeric",
      label: "Age",
    },
    {
      id: 9,
      info: busNo,
      icon: "bus",
      label: "Bus No",
    },
    // {
    //   id: 10,
    //   info: driverDutyTime,
    //   icon: "clock-time-four-outline",
    //   label: "Duty Time Start",
    // },
    // {
    //   id: 11,
    //   info: driverDutyEnd,
    //   icon: "clock-time-four-outline",
    //   label: "Duty Time End",
    // },
    {
      id: 12,
      info: postalcode,
      icon: "email",
      label: "Postal Code",
    },
  ];

  const logout = async () => {
    setUser(null);
    await removeSession();
  };
  return (
    <>
      <View style={styles.container}>
        <FlatList
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
                        : require("../../assets/profile-avatar.jpg")
                    }
                  />
                </TouchableOpacity>
                <AppText style={styles.name}>
                  {`${firstname} ${lastname}`}
                </AppText>
                <AppText style={styles.address}>{institute}</AppText>
              </View>
              <Seperator />
              <AppText style={styles.heading}>Personal Information</AppText>
            </>
          }
          data={userDetails}
          keyExtractor={(user) => user.id.toString()}
          renderItem={({ item }) => (
            <ListItem
              label={item.label}
              description={item.info}
              icon={item.icon}
              style={styles.listItem}
            />
          )}
          ListFooterComponent={() => (
            <>
              <Seperator />
              <View style={{ marginHorizontal: 15, marginVertical: 15 }}>
                <AppText>License Image</AppText>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    show();
                    imageSet(licenseImage);
                  }}
                >
                  <Image
                    source={{ uri: licenseImage }}
                    style={styles.squareImage}
                  />
                </TouchableOpacity>
              </View>
              <Seperator />
              <View style={{ marginHorizontal: 15, marginVertical: 10 }}>
                <AppText>Medical Report Image</AppText>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    show();
                    imageSet(medicalReport);
                  }}
                >
                  <Image
                    source={{ uri: medicalReport }}
                    style={styles.squareImage}
                  />
                </TouchableOpacity>
              </View>
              <Seperator />
              <ListItem
                label="Update"
                style={styles.listItem}
                icon="update"
                onPress={() => navigation.navigate("Update")}
              />
              <Seperator />
              <ListItem
                label="Logout"
                style={styles.listItem}
                icon="logout"
                onPress={logout}
              />
            </>
          )}
          ItemSeparatorComponent={Seperator}
        />
      </View>
      <ImageViewScreen hideModal={hide} imageUri={imageUri} visible={visible} />
    </>
  );
};

export default DriverProfile;

const styles = StyleSheet.create({
  address: {
    fontSize: 18,
    fontStyle: "italic",
    color: colors.lightBlack,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  detail: {
    fontSize: 20,
    marginLeft: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
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

  squareImage: {
    width: Dimensions.get("screen").width / 1.2,
    height: 200,
    borderRadius: 20,
  },
});
