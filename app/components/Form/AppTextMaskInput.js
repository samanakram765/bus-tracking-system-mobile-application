import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { useFormikContext } from "formik";

import { colors } from "../../config";
import ErrorMessage from "../ErrorMessage";
import { TextInputMask } from "react-native-masked-text";

const AppTextMaskInput = ({ label, name, mask, ...otherProps }) => {
  const { handleChange, errors } = useFormikContext();
  return (
    <>
      <TextInputMask
        type="custom"
        placeholder={label}
        onChangeText={handleChange(name)}
        {...otherProps}
        style={styles.input}
        options={{ mask }}
      />
      <ErrorMessage error={errors[name]} />
    </>
  );
};

export default AppTextMaskInput;

const styles = StyleSheet.create({
  input: {
    fontSize: 15,
    color: colors.lightBlack,
    marginVertical: 10,
    borderColor: colors.lightBlack,
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
  },
});
