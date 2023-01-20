import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import React, { useEffect } from "react";
import Loader from "../../components/Loader";
import AppText from "../../components/AppText";
import Seperator from "../../components/Seperator";
import ListItem from "../../components/ListItem";
import { colors, fonts } from "../../config";
import { useApi } from "../../hooks/useApi";
import { getDriverDetails } from "../../firebase/firebaseCalls/driver";
import { useVisible } from "../../hooks/useVisible";
import { useImage } from "../../hooks/useImage";
import ImageViewScreen from "../ImageViewScreen";

const DriverProfile = ({ route }) => {
  const { user } = route.params;
  const { visible, show, hide } = useVisible();
  const { imageUri, imageSet } = useImage();

  const { data, loading, request } = useApi(getDriverDetails);
  const {
    firstname,
    lastname,
    institute,
    address,
    age,
    busNo,
    city,
    contact,
    country,
    driverId,
    image,
    licenseImage,
    medicalReport,
    postalcode,
    salary,
  } = data[0] || {};

  const driverDetails = [
    { id: 1, info: driverId, label: "Driver Id" },
    { id: 2, info: age, label: "Age" },
    { id: 3, info: contact, label: "Contact" },
    { id: 4, info: address, label: "Address" },
    { id: 5, info: city, label: "City" },
    { id: 6, info: country, label: "Country" },
    { id: 7, info: age, label: "Age" },
    { id: 8, info: postalcode, label: "Postal Code" },
    { id: 9, info: salary, label: "Salary" },
    { id: 10, info: busNo, label: "Bus No" },
  ];

  useEffect(() => {
    request(user);
  }, []);

  if (loading) return <Loader />;
  return (
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
                      : require("../../assets/profile-avatar.jpg")
                  }
                />
              </TouchableOpacity>
              <AppText
                style={styles.name}
              >{`${firstname} ${lastname}`}</AppText>
              <AppText style={styles.address}>{institute}</AppText>
            </View>
            <Seperator />
            <AppText style={styles.heading}>Personal Information</AppText>
          </>
        }
        data={driverDetails}
        keyExtractor={(user) => user.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            description={item.info}
            label={item.label}
            style={styles.listItem}
          />
        )}
        ListFooterComponent={() => (
          <>
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
          </>
        )}
      />
      <ImageViewScreen hideModal={hide} imageUri={imageUri} visible={visible} />
    </View>
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
    // paddingHorizontal: 20,
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

export default DriverProfile;
