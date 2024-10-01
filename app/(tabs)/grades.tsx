import React, { useEffect, useState } from "react";
import { ScrollView, View, useColorScheme, Dimensions } from "react-native";
import {
  Card,
  Title,
  Text,
  DataTable,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { useStudentData } from "@/hooks/useStudentData";

interface SemMarkModel {
  latest_sem_no: number;
  latest_sem_cgpa: number;
}

interface CAMarksModel {
  courseCode: string;
  courseTitle: string;
  ca1: string | null;
  ca2: string | null;
  ca3: string | null;
  bestOfCA: string | null;
  at1: string | null;
  at2: string | null;
  ap: string | null;
  total: string | null;
}

interface AcademicData {
  current_semester_results: string[][];
  previous_semester_results: SemMarkModel;
  ca_marks: {
    [key: string]: CAMarksModel[];
  };
}

const AcademicResultsScreen: React.FC = () => {
  const [academicData, setAcademicData] = useState<AcademicData | null>(null);
  const { data, isLoading, error, refreshData, isLoggedIn } = useStudentData();
  const colorScheme = useColorScheme();
  const paperTheme = useTheme();
  const screenWidth = Dimensions.get("window").width;

  const isDarkMode = colorScheme === "dark";

  const colors = {
    background: isDarkMode ? "#121212" : "#f5f5f5",
    card: isDarkMode ? "#1e1e1e" : "#ffffff",
    text: isDarkMode ? "#e0e0e0" : "#333333",
    subText: isDarkMode ? "#b0b0b0" : "#666666",
    border: isDarkMode ? "#333333" : "#e0e0e0",
    error: isDarkMode ? "#cf6679" : "#b00020",
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        refreshData();
      }, 20000); // Retry after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [error, refreshData]);

  // useEffect(() => {
  //   let intervalId: NodeJS.Timeout;

  //   if (isLoggedIn) {
  //     // Fetch data immediately when logged in
  //     refreshData();

  //     // Set up interval to fetch data every 10 seconds
  //     intervalId = setInterval(() => {
  //       refreshData();
  //     }, 10000);
  //   }

  //   // Clean up function to clear the interval when component unmounts or user logs out
  //   return () => {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //     }
  //   };
  // }, [isLoggedIn, refreshData]);

  useEffect(() => {
    if (data) {
      setAcademicData(data as AcademicData);
    }
  }, [data]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={paperTheme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ color: colors.error }}>{error}</Text>
      </View>
    );
  }

  if (!academicData) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ color: colors.text }}>No academic data available.</Text>
      </View>
    );
  }

  const renderCAMarksTable = () => {
    const allMarks = Object.values(academicData.ca_marks).flat();
    return (
      <ScrollView horizontal>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={{ width: 100 }}>
              <Text style={{ color: colors.subText, fontWeight: "bold" }}>
                Course Code
              </Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 200 }}>
              <Text style={{ color: colors.subText, fontWeight: "bold" }}>
                Course Title
              </Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{ width: 80 }}>
              <Text style={{ color: colors.subText, fontWeight: "bold" }}>
                CA1
              </Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{ width: 80 }}>
              <Text style={{ color: colors.subText, fontWeight: "bold" }}>
                CA2
              </Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{ width: 80 }}>
              <Text style={{ color: colors.subText, fontWeight: "bold" }}>
                CA3
              </Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{ width: 80 }}>
              <Text style={{ color: colors.subText, fontWeight: "bold" }}>
                Best
              </Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{ width: 80 }}>
              <Text style={{ color: colors.subText, fontWeight: "bold" }}>
                AT1
              </Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{ width: 80 }}>
              <Text style={{ color: colors.subText, fontWeight: "bold" }}>
                AT2
              </Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{ width: 80 }}>
              <Text style={{ color: colors.subText, fontWeight: "bold" }}>
                AP
              </Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{ width: 80 }}>
              <Text style={{ color: colors.subText, fontWeight: "bold" }}>
                Total
              </Text>
            </DataTable.Title>
          </DataTable.Header>
          {allMarks.map((mark, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell style={{ width: 100 }}>
                <Text style={{ color: colors.text }}>{mark.courseCode}</Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ width: 200 }}>
                <Text style={{ color: colors.text }}>{mark.courseTitle}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ width: 80 }}>
                <Text style={{ color: colors.text }}>{mark.ca1 || "-"}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ width: 80 }}>
                <Text style={{ color: colors.text }}>{mark.ca2 || "-"}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ width: 80 }}>
                <Text style={{ color: colors.text }}>{mark.ca3 || "-"}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ width: 80 }}>
                <Text style={{ color: colors.text }}>
                  {mark.bestOfCA || "-"}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ width: 80 }}>
                <Text style={{ color: colors.text }}>{mark.at1 || "-"}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ width: 80 }}>
                <Text style={{ color: colors.text }}>{mark.at2 || "-"}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ width: 80 }}>
                <Text style={{ color: colors.text }}>{mark.ap || "-"}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ width: 80 }}>
                <Text style={{ color: colors.text }}>{mark.total || "-"}</Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <Card style={{ margin: 16, backgroundColor: colors.card, elevation: 2 }}>
        <Card.Content>
          <Title style={{ fontSize: 20, marginBottom: 16, color: colors.text }}>
            CA Marks
          </Title>
          {renderCAMarksTable()}
        </Card.Content>
      </Card>

      <Card style={{ margin: 16, backgroundColor: colors.card, elevation: 2 }}>
        <Card.Content>
          <Title style={{ fontSize: 20, marginBottom: 16, color: colors.text }}>
            Previous Semester Results
          </Title>
          <Text style={{ color: colors.text, marginBottom: 8, fontSize: 16 }}>
            Latest Semester:{" "}
            {academicData.previous_semester_results.latest_sem_no}
          </Text>
          <Text
            style={{ color: colors.text, fontSize: 18, fontWeight: "bold" }}
          >
            CGPA:{" "}
            {academicData.previous_semester_results.latest_sem_cgpa.toFixed(3)}
          </Text>
        </Card.Content>
      </Card>

      <Card style={{ margin: 16, backgroundColor: colors.card, elevation: 2 }}>
        <Card.Content>
          <Title style={{ fontSize: 20, marginBottom: 16, color: colors.text }}>
            Previous Semester Results (Semester{" "}
            {academicData.current_semester_results[1][0]})
          </Title>
          <ScrollView horizontal>
            <DataTable>
              <DataTable.Header>
                {academicData.current_semester_results[0]
                  .slice(2)
                  .map((header, index) => (
                    <DataTable.Title key={index} style={{ width: 120 }}>
                      <Text
                        style={{ color: colors.subText, fontWeight: "bold" }}
                      >
                        {header}
                      </Text>
                    </DataTable.Title>
                  ))}
              </DataTable.Header>
              {academicData.current_semester_results
                .slice(2)
                .map((row, rowIndex) => (
                  <DataTable.Row key={rowIndex}>
                    {row.slice(1).map((cell, cellIndex) => (
                      <DataTable.Cell key={cellIndex} style={{ width: 120 }}>
                        <Text style={{ color: colors.text }}>{cell}</Text>
                      </DataTable.Cell>
                    ))}
                  </DataTable.Row>
                ))}
            </DataTable>
          </ScrollView>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default AcademicResultsScreen;
