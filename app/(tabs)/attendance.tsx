import React, { useEffect } from "react";
import { ScrollView, View, useColorScheme } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  DataTable,
  Chip,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { useStudentData } from "@/hooks/useStudentData";

interface AttendanceModel {
  course_code: string;
  total_hours: number;
  exemption_hours: number;
  total_absent: number;
  total_present: number;
  percentage_of_attendance: number;
  percentage_with_exemp: number;
  percentage_with_exemp_med: number;
  attendance_percentage_from: string;
  attendance_percentage_to: string;
  remark: { class_to_bunk?: number; class_to_attend?: number };
}

const AttendancePage: React.FC = () => {
  const { data, isLoading, error, refreshData, isLoggedIn } = useStudentData();
  const colorScheme = useColorScheme();
  const theme = useTheme();

  const isDarkMode = colorScheme === "dark";

  const colors = {
    background: isDarkMode ? "#1a1a1a" : "#f3f4f6",
    text: isDarkMode ? "#ffffff" : "#000000",
    card: isDarkMode ? "#2a2a2a" : "#ffffff",
    error: isDarkMode ? "#ff6b6b" : "#dc2626",
    chipLow: isDarkMode ? "#B91C1C" : "#B91C1C",
    chipModerate: isDarkMode ? "#CA8A04" : "#CA8A04",
    chipGood: isDarkMode ? "#22C55E" : "#22C55E",
    chipText: isDarkMode ? "#ffffff" : "#000000",
  };

  const attendance: AttendanceModel[] = data?.attendance || [];

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
    if (error) {
      const timer = setTimeout(() => {
        refreshData();
      }, 20000); // Retry after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [error, refreshData]);

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
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
        <Paragraph style={{ color: colors.error }}>{error}</Paragraph>
      </View>
    );
  }

  if (attendance.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Paragraph style={{ color: colors.text }}>
          No attendance data available.
        </Paragraph>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <Title
        style={{
          fontSize: 24,
          fontWeight: "bold",
          padding: 16,
          color: colors.text,
        }}
      >
        Attendance Summary
      </Title>
      <Card style={{ margin: 16, backgroundColor: colors.card }}>
        <Card.Content>
          <Paragraph style={{ marginBottom: 8, color: colors.text }}>
            Period: {attendance[0]?.attendance_percentage_from} to{" "}
            {attendance[0]?.attendance_percentage_to}
          </Paragraph>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={{ flex: 2 }}>
                <Paragraph style={{ color: colors.text }}>Course</Paragraph>
              </DataTable.Title>
              <DataTable.Title numeric style={{ flex: 1 }}>
                <Paragraph style={{ color: colors.text }}>
                  Attendance %
                </Paragraph>
              </DataTable.Title>
              <DataTable.Title numeric style={{ flex: 3 }}>
                <Paragraph style={{ color: colors.text }}>Status</Paragraph>
              </DataTable.Title>
            </DataTable.Header>

            {attendance.map((course) => (
              <DataTable.Row key={course.course_code}>
                <DataTable.Cell style={{ flex: 2 }}>
                  <Paragraph style={{ color: colors.text }}>
                    {course.course_code}
                  </Paragraph>
                </DataTable.Cell>
                <DataTable.Cell numeric style={{ flex: 1 }}>
                  <Paragraph style={{ color: colors.text }}>
                    {course.percentage_of_attendance}%
                  </Paragraph>
                </DataTable.Cell>
                <DataTable.Cell
                  numeric
                  style={{ flex: 3, justifyContent: "flex-end" }}
                >
                  <AttendanceStatus
                    percentage={course.percentage_of_attendance}
                    remark={course.remark}
                    colors={colors}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>

      {attendance.map((course) => (
        <Card
          key={course.course_code}
          style={{ margin: 16, backgroundColor: colors.card }}
        >
          <Card.Content>
            <Title style={{ color: colors.text }}>{course.course_code}</Title>
            <Paragraph style={{ color: colors.text }}>
              Exemption Hours: {course.exemption_hours}
            </Paragraph>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 8,
              }}
            >
              <Paragraph style={{ color: colors.text }}>
                Total Hours: {course.total_hours}
              </Paragraph>
              <Paragraph style={{ color: colors.text }}>
                Present: {course.total_present}
              </Paragraph>
              <Paragraph style={{ color: colors.text }}>
                Absent: {course.total_absent}
              </Paragraph>
            </View>
            <Paragraph style={{ marginVertical: 8, color: colors.text }}>
              Attendance: {course.percentage_of_attendance}%
            </Paragraph>
            <AttendanceRemark remark={course.remark} color={colors.text} />
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const AttendanceStatus: React.FC<{
  percentage: number;
  remark: AttendanceModel["remark"];
  colors: any;
}> = ({ percentage, remark, colors }) => {
  if (percentage < 75) {
    return (
      <Chip icon="alert" style={{ backgroundColor: colors.chipLow }}>
        <Paragraph style={{ color: colors.chipText }}>Low</Paragraph>
      </Chip>
    );
  } else if (percentage < 85) {
    return (
      <Chip icon="information" style={{ backgroundColor: colors.chipModerate }}>
        <Paragraph style={{ color: colors.chipText }}>Moderate</Paragraph>
      </Chip>
    );
  } else {
    return (
      <Chip icon="check" style={{ backgroundColor: colors.chipGood }}>
        <Paragraph style={{ color: colors.chipText }}>Good</Paragraph>
      </Chip>
    );
  }
};

const AttendanceRemark: React.FC<{
  remark: AttendanceModel["remark"];
  color: string;
}> = ({ remark, color }) => {
  if (remark.class_to_bunk !== undefined) {
    return (
      <Paragraph style={{ color }}>
        You can safely miss {remark.class_to_bunk} more classes.
      </Paragraph>
    );
  } else if (remark.class_to_attend !== undefined) {
    return (
      <Paragraph style={{ color }}>
        You need to attend {remark.class_to_attend} more classes to reach 75%.
      </Paragraph>
    );
  } else {
    return null;
  }
};

export default AttendancePage;
