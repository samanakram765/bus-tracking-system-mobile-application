import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import Screen from "../../components/Screen";
import ListItem from "../../components/ListItem";
import { useApi } from "../../hooks/useApi";
import { getStudents } from "../../firebase/firebaseCalls/students";
import AuthContext from "../../context/AuthContext";
import Loader from "../../components/Loader";
import { studentAvatar } from "../../helpers/avatar";
import { FlatList } from "react-native-gesture-handler";
import Seperator from "../../components/Seperator";

const StudentsListScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { data, loading, request } = useApi(getStudents || []);

  console.log("Student Data : ", data);

  useEffect(() => {
    request(user);
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <FlatList
        data={data}
        keyExtractor={(student) => student.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            key={item.id}
            image={item.image ? item.image : studentAvatar()}
            label={`${item.firstname} ${item.lastname}`}
            description={item.parent}
            onAndOffBoard={true}
            studentBoardingStatus={item.onAndOffBoard}
            rightIcon="chevron-right"
            onPress={() =>
              navigation.navigate("StudentProfile", { student: item })
            }
          />
        )}
        ItemSeparatorComponent={Seperator}
      />
    </>
  );
};

export default StudentsListScreen;

const styles = StyleSheet.create({});
