import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useFormikContext } from "formik";

import { colors } from "../../config";
import ErrorMessage from "../ErrorMessage";

const AppInputPicker = ({ options = [], name }) => {
  const [focus, setFocus] = useState(false);

  const { setFieldValue, values, errors } = useFormikContext();

  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);

  return (
    <>
      <View
        style={[
          styles.input,
          { borderColor: focus ? colors.purple : colors.lightBlack },
        ]}
      >
        <Picker
          selectedValue={values[name]}
          onValueChange={(itemValue) => setFieldValue(name, itemValue)}
          mode="dropdown"
          focusable={focus}
          onBlur={handleBlur}
          onFocus={handleFocus}
        >
          <Picker.Item label="Select Institute" value="" />
          {options.map((option) => (
            <Picker.Item
              key={option.id}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
      <ErrorMessage error={errors[name]} />
    </>
  );
};

export default AppInputPicker;

const styles = StyleSheet.create({
  input: {
    fontSize: 15,
    color: colors.lightBlack,
    marginVertical: 10,
    borderColor: colors.purple,
    borderWidth: 1,
    backgroundColor: colors.veryLightBlack,
    borderRadius: 5,
    overflow: "hidden",
  },
});
