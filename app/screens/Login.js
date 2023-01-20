import {
  StyleSheet,
  Image,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  ToastAndroid,
} from "react-native";
import { KeyboardAvoidingView } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import fonts from "../config/fonts";
import colors from "../config/colors";
import { AppTextInput, Form, SubmitButton } from "../components/Form";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import * as storage from "../storage/storeSession";
import { handleParentlogin } from "../firebase/firebaseCalls/auth";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { database } from "../firebase/firebaseConfig";
import AppTextMaskInput from "../components/Form/AppTextMaskInput";
import AppText from "../components/AppText";
import { List } from "react-native-paper";
import Seperator from "../components/Seperator";

const validationSchema = Yup.object().shape({
  nationalIdentityNumber: Yup.string().required().label("National Id"),
  password: Yup.string().required().label("Password"),
});

const SchoolModal = ({
  schoolModalVisible,
  setSchoolModalVisible,
  institutes,
  setSelectedInstitute,
}) => {
  console.log("INstitute : ", institutes);
  return (
    <Modal
      visible={schoolModalVisible}
      onRequestClose={() => setSchoolModalVisible(false)}
      animationType="slide"
    >
      <View style={{ flex: 1, padding: 20 }}>
        <FlatList
          ListHeaderComponent={() => {
            return (
              <AppText
                style={{
                  fontSize: 20,
                  fontWeight: "800",
                  borderBottomColor: "black",
                  borderBottomWidth: 1,
                }}
              >
                Select Your Child School
              </AppText>
            );
          }}
          data={institutes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSchoolModalVisible(false);
                  setSelectedInstitute(item.institute);
                }}
              >
                <List.Item title={item.institute} />
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={Seperator}
        />
      </View>
    </Modal>
  );
};

const Login = ({ route }) => {
  const { setUser } = useContext(AuthContext);
  const [institutes, setInsitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState("");
  const [schoolModalVisible, setSchoolModalVisible] = useState(false);

  const { loginUser } = route.params;
  console.log("Login User : ", loginUser);
  const login = async (values) => {
    console.log("Selected institute : ", selectedInstitute);

    if (!selectedInstitute)
      return ToastAndroid.show("Please Select School", ToastAndroid.SHORT);

    const user = await handleParentlogin(values, loginUser, selectedInstitute);
    console.log("User : ", user);
    if (!user) return;
    await storage.saveSession(user);
    const userCollection = doc(database, loginUser, user.id);
    await updateDoc(userCollection, { isLoggedIn: true });
    setUser(user);
  };

  const getInstitutes = async () => {
    const instituteCollection = collection(database, "institute");
    const institutesSnapshot = await getDocs(instituteCollection);
    const institutes = institutesSnapshot.docs.map((institute) => ({
      id: institute.id,
      ...institute.data(),
    }));

    setInsitutes(institutes);
  };

  useEffect(() => {
    getInstitutes();
  }, []);

  return (
    <Screen>
      <ScrollView>
        <KeyboardAvoidingView style={styles.container} behavior="position">
          <Image
            source={require("../assets/login.jpg")}
            style={styles.loginImage}
          />
          <Text style={styles.heading}>Login</Text>

          <Form
            initialValues={{ nationalIdentityNumber: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={login}
          >
            <AppTextMaskInput
              label="National Identity Number"
              name="nationalIdentityNumber"
              autoCorrect={false}
              autoComplete="off"
              autoCapitalize="none"
              textContentType="none"
              keyboardType="numeric"
              mask={"99999-9999999-9"}
            />
            <AppTextInput
              label="Password"
              name="password"
              autoCorrect={false}
              autoComplete="off"
              autoCapitalize="none"
              textContentType="password"
              keyboardType="default"
              secureTextEntry
            />

            <TouchableOpacity onPress={() => setSchoolModalVisible(true)}>
              <View
                style={{
                  backgroundColor: colors.mediumLightBlack,
                  width: "100%",
                  height: 50,
                  borderRadius: 5,
                  marginVertical: 10,
                  borderColor: colors.lightBlack,
                  borderWidth: 1,
                  justifyContent: "center",
                  paddingLeft: 18,
                }}
              >
                {!selectedInstitute ? (
                  <AppText style={{ fontSize: 16, color: colors.lightBlack }}>
                    Select Institute
                  </AppText>
                ) : (
                  <AppText style={{ fontSize: 16 }}>
                    {selectedInstitute}
                  </AppText>
                )}
              </View>
            </TouchableOpacity>
            <SubmitButton title="LOGIN" />
          </Form>
        </KeyboardAvoidingView>
        <SchoolModal
          schoolModalVisible={schoolModalVisible}
          setSchoolModalVisible={setSchoolModalVisible}
          institutes={institutes}
          setSelectedInstitute={setSelectedInstitute}
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  account: {
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    padding: 30,
  },
  heading: {
    fontSize: 40,
    color: colors.mediumBlack,
    fontFamily: fonts.PoppinsBold,
    marginTop: 20,
  },
  input: {
    fontSize: 15,
    color: colors.lightBlack,
    marginVertical: 10,
  },
  loginImage: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
  },
  register: {
    marginLeft: 7,
    color: colors.blue,
  },

  text: {
    backgroundColor: "red",
  },
});

export default Login;
