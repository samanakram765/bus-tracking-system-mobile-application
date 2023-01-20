import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import AppText from "../components/AppText";
import { colors, fonts } from "../config";
import {
  AppTextInput,
  Form,
  SubmitButton,
  AppInputPicker,
} from "../components/Form";
import { getInstitutes } from "../firebase/firebaseCalls/institutes";
import useFirebaseCalls from "../hooks/useFirebaseCalls";

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required().label("First Name"),
  lastname: Yup.string().required().label("Last Name"),
  email: Yup.string().email().required().label("Email"),
  password: Yup.string().min(8).max(12).required().label("Password"),
  institute: Yup.string().required().label("Institute"),
  rollNo: Yup.number().required().label("Roll No"),
  contact: Yup.number().required().label("Contact Number"),
});

const Register = ({ navigation }) => {
  const { data } = useFirebaseCalls(getInstitutes);

  return (
    <Screen>
      <ScrollView style={{ flexGrow: 1, paddingHorizontal: 30 }}>
        <Image
          source={require("../assets/signup.jpg")}
          style={styles.loginImage}
        />
        <Text style={styles.heading}>Sign up</Text>
        <Form
          initialValues={{
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            institute: "",
            rollNo: "",
            contact: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => console.log(values)}
        >
          <AppTextInput
            label="First Name"
            name="firstname"
            autoCorrect={false}
            autoComplete="username"
            autoCapitalize="none"
            textContentType="name"
            keyboardType="default"
          />
          <AppTextInput
            label="Last Name"
            name="lastname"
            autoCorrect={false}
            autoComplete="username"
            autoCapitalize="none"
            textContentType="name"
            keyboardType="default"
          />
          <AppTextInput
            label="Email"
            name="email"
            autoCorrect={false}
            autoComplete="email"
            autoCapitalize="none"
            textContentType="emailAddress"
            keyboardType="email-address"
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

          <AppTextInput
            label="Roll No"
            name="rollNo"
            autoCorrect={false}
            autoComplete="off"
            autoCapitalize="none"
            textContentType="none"
            keyboardType="phone-pad"
          />
          <AppTextInput
            label="Contact Number"
            name="contact"
            autoCorrect={false}
            autoComplete="off"
            autoCapitalize="none"
            textContentType="none"
            keyboardType="phone-pad"
          />

          <AppInputPicker name="institute" options={data} />

          <SubmitButton title="LOGIN" />
        </Form>
        <View style={styles.account}>
          <AppText>Already have an account?</AppText>
          <AppText
            style={styles.register}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </AppText>
        </View>
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

export default Register;
