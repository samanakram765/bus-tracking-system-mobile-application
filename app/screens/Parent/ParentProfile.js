import { StyleSheet, Image, View, FlatList } from "react-native";
import AppText from "../../components/AppText";

import Screen from "../../components/Screen";
import Seperator from "../../components/Seperator";
import { colors, fonts } from "../../config";
import ListItem from "../../components/ListItem";
import { removeSession } from "../../storage/storeSession";
import ImageViewScreen from "../ImageViewScreen";
import { useVisible } from "../../hooks/useVisible";
import { useImage } from "../../hooks/useImage";
import { TouchableOpacity } from "react-native-gesture-handler";
import { collection, doc, updateDoc } from "firebase/firestore";
import { database } from "../../firebase/firebaseConfig";

const ParentProfile = ({ navigation, user, setUser }) => {
  const { visible, show, hide } = useVisible();
  const { imageUri, imageSet } = useImage();

  const {
    image,
    firstname,
    lastname,
    fullName,
    nationalIdentityNumber,
    parentcontact,
    institute,
    password,
  } = user;

  const userDetails = [
    {
      id: 1,
      info: nationalIdentityNumber,
      icon: "id-card",
      label: "National ID Number",
    },
    { id: 2, info: password, icon: "lock", label: "Password" },
    {
      id: 3,
      info: parentcontact,
      icon: "cellphone",
      label: "Parent Contact",
    },
  ];

  const logout = async () => {
    setUser(null);
    const userCollection = doc(database, "parent", user.id);
    await updateDoc(userCollection, { isLoggedIn: false });
    await removeSession();
  };
  return (
    <>
      <Screen>
        <View style={styles.container}>
          <FlatList
            ListHeaderComponent={
              <>
                <View style={styles.imageAndDetails}>
                  <TouchableOpacity
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
                    {fullName ? fullName : `${firstname} ${lastname}`}
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
                <ListItem
                  label="Update"
                  style={styles.listItem}
                  icon="update"
                  onPress={() => navigation.navigate("Update")}
                />
                <ListItem
                  label="Logout"
                  style={styles.listItem}
                  icon="logout"
                  onPress={logout}
                />
              </>
            )}
          />
        </View>
      </Screen>
      <ImageViewScreen hideModal={hide} imageUri={imageUri} visible={visible} />
    </>
  );
};

export default ParentProfile;

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
});
