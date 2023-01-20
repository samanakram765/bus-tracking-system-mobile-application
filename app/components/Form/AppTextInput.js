import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { useFormikContext } from "formik";

import { colors } from "../../config";
import ErrorMessage from "../ErrorMessage";

const AppTextInput = ({ label, name, ...otherProps }) => {
  const { handleChange, errors } = useFormikContext();
  return (
    <>
      <TextInput
        mode="outlined"
        label={label}
        onChangeText={handleChange(name)}
        {...otherProps}
        style={styles.input}
      />
      <ErrorMessage error={errors[name]} />
    </>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  input: {
    fontSize: 15,
    color: colors.lightBlack,
    marginVertical: 10,
  },
});
