import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { DataTable, List, TextInput } from "react-native-paper";
import AuthContext from "../../context/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../../firebase/firebaseConfig";
import Loader from "../../components/Loader";
import { FlashList } from "@shopify/flash-list";
import _ from "lodash";
import { Row, Table } from "react-native-table-component";
import { colors } from "../../config";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "../../components/Icon";
import Drawer from "react-native-drawer";
import ListItem from "../../components/ListItem";
import AppButton from "../../components/AppButton";
import Seperator from "../../components/Seperator";

const SortModal = ({
  sortModalVisible,
  setSortModalVisible,
  setSidebar,
  handleSort,
}) => {
  const sortValues = [
    { id: 2, label: "Reg No", key: "rollNo" },
    { id: 3, label: "Student Name", key: "firstname" },
    { id: 4, label: "Bus No", key: "busNo" },
    { id: 5, label: "Driver Name", key: "driverName" },
    { id: 6, label: "Date", key: "timeAndDate" },
    { id: 7, label: "Opening(ON/OFF) Board", key: "openingTime.onBoard" },
    { id: 8, label: "Closing(ON/OFF) Board", key: "closingTime.offBoard" },
  ];

  return (
    <Modal animationType="slide" visible={sortModalVisible}>
      <View style={{ flex: 1, padding: 20 }}>
        <AppButton
          style={{ borderRadius: 50 }}
          title={"Close Modal"}
          onPress={() => {
            setSidebar(false);
            setSortModalVisible(false);
          }}
        />

        <FlatList
          data={sortValues}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                handleSort(item.key);
                setSidebar(false);
                setSortModalVisible(false);
              }}
            >
              <List.Item title={item.label} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={Seperator}
        />
      </View>
    </Modal>
  );
};

const AttendanceTable = ({ sidebar: sideBar, setSidebar }) => {
  const [studentsAttendance, setStudentsAttendance] = useState([]);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const [sortColumn, setSortColumn] = useState({
    path: "rollNo",
    order: "asc",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleSort = (path) => {
    const sortColumnCopy = { ...sortColumn };
    if (path === sortColumnCopy.path) {
      sortColumnCopy.order = sortColumnCopy.order === "asc" ? "desc" : "asc";
    } else {
      sortColumnCopy.path = path;
      sortColumnCopy.order = "asc";
    }
    console.log("Sort COlumn : ", sortColumnCopy);
    setSortColumn(sortColumnCopy);
  };

  const getStudentAttendanceRecord = async () => {
    setLoading(true);
    const attendanceCollection = collection(database, "attendance");

    const q = query(
      attendanceCollection,
      where("institute", "==", user.institute),
      where("fatherNID", "==", user.nationalIdentityNumber)
    );

    const attendanceSnapshot = await getDocs(q);
    const studentsAttendance = attendanceSnapshot.docs.map(
      (student, index) => ({ id: student.id, ...student.data() })
    );

    console.log("Students attendance : ", studentsAttendance);

    setStudentsAttendance(studentsAttendance);
    setFilteredData(studentsAttendance);
    setLoading(false);
  };

  useEffect(() => {
    getStudentAttendanceRecord();
  }, []);

  if (loading) return <Loader />;

  const orderedData = _.orderBy(
    filteredData,
    [sortColumn.path],
    [sortColumn.order]
  );

  const renderSideBar = () => {
    return (
      <View
        style={{
          flex: 1,
          borderTopColor: colors.mediumLightBlack,
          borderLeftColor: colors.mediumLightBlack,
          borderTopWidth: 2,
          borderLeftWidth: 2,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setSidebar(false);
            setSortModalVisible(true);
            console.log("Pressed");
          }}
        >
          <List.Item
            titleStyle={{ color: "black" }}
            title={"Sort"}
            left={() => <List.Icon icon={"sort"} color={colors.purple} />}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const AttendanceTableContent = () => {
    return (
      <View style={styles.container}>
        {orderedData.map((students, index) => {
          return (
            <List.Accordion
              style={{
                borderBottomColor: "#ededed",
                borderBottomWidth: 1,
                backgroundColor: "white",
              }}
              key={students.id}
              title={students.firstname}
              description={"Roll No: " + students.rollNo}
              left={() => (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: colors.purple,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white" }}>{index + 1}</Text>
                </View>
              )}
            >
              <List.Item
                style={{ borderBottomColor: "white", borderBottomWidth: 1 }}
                title={"Bus No"}
                description={students.busNo}
                left={(props) => <List.Icon {...props} icon="bus" />}
              />
              <List.Item
                style={{ borderBottomColor: "white", borderBottomWidth: 1 }}
                title={"Driver Name"}
                description={students.driverName}
                left={(props) => (
                  <List.Icon {...props} icon="account-tie-hat" />
                )}
              />
              <List.Item
                style={{ borderBottomColor: "white", borderBottomWidth: 1 }}
                title={"Date"}
                description={students.date || "none"}
                left={(props) => (
                  <List.Icon {...props} icon="sort-calendar-ascending" />
                )}
              />
              <List.Item
                style={{ borderBottomColor: "white", borderBottomWidth: 1 }}
                title={"School Opening(ON/OFF) Board"}
                description={
                  students?.openingTime?.onBoard.includes("0:00")
                    ? "A"
                    : `${students?.openingTime?.onBoard || "none"} - ${
                        students?.openingTime?.offBoard || "none"
                      }`
                }
                left={(props) => (
                  <List.Icon {...props} icon="clock-time-four-outline" />
                )}
              />
              <List.Item
                style={{ borderBottomColor: "white", borderBottomWidth: 1 }}
                title={"School Closing(ON/OFF) Board"}
                description={
                  students?.openingTime?.onBoard.includes("0:00")
                    ? "A"
                    : `${students?.closingTime?.onBoard || "none"} - ${
                        students?.closingTime?.offBoard || "none"
                      }`
                }
                left={(props) => (
                  <List.Icon {...props} icon="clock-time-four-outline" />
                )}
              />
            </List.Accordion>
          );
        })}
      </View>
    );
  };

  return (
    <Drawer
      open={sideBar}
      content={renderSideBar()}
      openDrawerOffset={0.3}
      tapToClose={true}
      captureGestures={true}
      side={"right"}
      onClose={() => {
        setSidebar(false);
        // this.setState({sideBar: false});
      }}
    >
      <ScrollView>
        <AttendanceTableContent />
      </ScrollView>

      <SortModal
        handleSort={handleSort}
        setSidebar={setSidebar}
        sortModalVisible={sortModalVisible}
        setSortModalVisible={setSortModalVisible}
      />
    </Drawer>
  );
};

export default AttendanceTable;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.whiteSmoke },
  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center", fontWeight: "100" },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: "#E7E6E1" },
});

//

{
  /* <ScrollView horizontal>
      <FlashList
        ListHeaderComponent={() => {
          return (
            <DataTable.Header style={{ width: 1500 }}>
              {tableHead.map((table) => {
                let flex = 1;

                if (table.label === "#") flex = 0.3;
                if (table.label === "Reg No") flex = 0.6;
                if (table.label === "Student Name") flex = 0.6;
                if (table.label === "Bus No") flex = 0.4;
                if (table.label === "Driver Name") flex = 0.5;
                if (table.label === "Date") flex = 0.5;
                if (table.label.includes("Opening")) flex = 0.7;
                if (table.label.includes("Closing")) flex = 0.7;

                return (
                  <DataTable.Title
                    style={{
                      flex: flex,
                    }}
                    onPress={() => {
                      handleSort(table.key);
                      alert(table.label);
                    }}
                  >
                    {table.label}
                  </DataTable.Title>
                );
              })}
            </DataTable.Header>
          );
        }}
        data={orderedData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: students, index }) => {
          console.log("Students : ", students);
          return (
            <DataTable.Row>
              <DataTable.Cell style={{ flex: 0.3 }}>{index + 1}</DataTable.Cell>
              <DataTable.Cell style={{ flex: 0.6 }}>
                {students.rollNo}
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 0.6 }}>
                {students.firstname}
              </DataTable.Cell>

              <DataTable.Cell style={{ flex: 0.4 }}>
                {students.busNo}
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 0.5 }}>
                {students.driverName}
              </DataTable.Cell>
              <DataTable.Cell
                style={{ flex: 0.5 }}
                onPress={() =>
                  students.date
                    ? alert(students.timeAndDate.toDate().toString())
                    : alert("none")
                }
              >
                {students.date || "none"}
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 0.7 }}>
                {`${students?.openingTime?.onBoard || "none"} - ${
                  students?.openingTime?.offBoard || "none"
                }`}
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 0.7 }}>
                {`${students?.closingTime?.onBoard || "none"} - ${
                  students?.closingTime?.offBoard || "none"
                }`}
              </DataTable.Cell>
            </DataTable.Row>
          );
        }}
        estimatedItemSize={50}
      />
    </ScrollView> */
}
