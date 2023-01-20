import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { colors, fonts } from "../config";
import AppText from "../components/AppText";
import ListItem from "../components/ListItem";
import Seperator from "../components/Seperator";
import { useApi } from "../hooks/useApi";
import { getBusDetails } from "../firebase/firebaseCalls/bus";
import Loader from "../components/Loader";
import { useVisible } from "../hooks/useVisible";
import { useImage } from "../hooks/useImage";
import Screen from "../components/Screen";
import ImageViewScreen from "./ImageViewScreen";

const BusDetails = ({ route }) => {
  const { user } = route.params;
  const { data, loading, request } = useApi(getBusDetails);
  const { visible, hide, show } = useVisible();
  const { imageUri, imageSet } = useImage();

  const {
    busNo,
    busRoutes,
    image,
    institute,
    licenseNo,
    // maintainance,
    seatCapacity,
    seatCapacityFilled
  } = data[0] || {};

  const busDetails = [
    { id: 1, info: busNo, label: "Bus No" },
    { id: 2, info: institute, label: "Institute" },
    { id: 3, info: licenseNo, label: "License No" },
    // { id: 4, info: maintainance, label: "Maintainance" },
    { id: 5, info: seatCapacity, label: "Seat Capacity" },
    { id: 6, info: seatCapacity - seatCapacityFilled, label: "Remaining Seats" },
    
  ];

  useEffect(() => {
    request(user);
  }, []);

  if (loading) return <Loader />;

  return (
    <Screen>
      <FlatList
        style={{ flex: 1, paddingHorizontal: 20 }}
        ListHeaderComponent={
          <>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                show();
                imageSet(image);
              }}
              style={styles.imageAndDetails}
            >
              <Image
                style={styles.squareImage}
                source={
                  image
                    ? { uri: image }
                    : require("../assets/profile-avatar.jpg")
                }
              />
            </TouchableOpacity>
            <Seperator />
            <AppText style={styles.heading}>Personal Information</AppText>
          </>
        }
        data={busDetails}
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
            {busRoutes?.map((route, index) => (
              <ListItem
                key={index}
                label={`Latitude     Longitude`}
                description={`${route.latitude}  ${route.longitude}`}
                style={styles.listItem}
              />
            ))}
          </>
        )}
      />
      <ImageViewScreen hideModal={hide} imageUri={imageUri} visible={visible} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  address: {
    fontSize: 18,
    fontStyle: "italic",
    color: colors.lightBlack,
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
    marginTop: 25,
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

export default BusDetails;
