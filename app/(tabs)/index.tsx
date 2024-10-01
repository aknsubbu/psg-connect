import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Avatar,
  useTheme,
  Text,
  ActivityIndicator,
} from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useStudentData } from "@/hooks/useStudentData";
import { useRouter } from "expo-router";

const HomePage: React.FC = () => {
  const { data, isLoading, error, refreshData, isLoggedIn } = useStudentData();
  const colorScheme = useColorScheme();
  const paperTheme = useTheme();
  const router = useRouter();

  const isDarkMode = colorScheme === "dark";

  const colors = {
    background: isDarkMode ? "#121212" : "#f5f5f5",
    card: isDarkMode ? "#1e1e1e" : "#ffffff",
    text: isDarkMode ? "#e0e0e0" : "#333333",
    subText: isDarkMode ? "#b0b0b0" : "#666666",
    accent: paperTheme.colors.primary,
    good: isDarkMode ? "#4ade80" : "#22c55e",
    warning: isDarkMode ? "#fbbf24" : "#f59e0b",
    danger: isDarkMode ? "#f87171" : "#ef4444",
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

  const studentName =
    data?.student_profile?.["Personal Information"]?.Name || "Student";
  const rollNumber =
    data?.student_profile?.["Personal Information"]?.["Roll Number"] || "N/A";
  const cgpa =
    data?.previous_semester_results?.latest_sem_cgpa?.toFixed(2) || "N/A";

  const attendance = data?.attendance || [];
  const bunkableClasses = attendance.filter(
    (course: any) =>
      course.remark.class_to_bunk && course.remark.class_to_bunk > 0
  );
  const lowestAttendance = Math.min(
    ...attendance.map((course: any) => course.percentage_of_attendance)
  );

  const QuickAccessButton: React.FC<{
    icon: string;
    title: string;
    onPress: () => void;
  }> = ({ icon, title, onPress }) => (
    <TouchableOpacity
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        margin: 8,
        width: "45%",
        elevation: 2,
      }}
      onPress={onPress}
    >
      <FontAwesome name={icon as any} size={32} color={colors.accent} />
      <Text style={{ color: colors.text, marginTop: 8, textAlign: "center" }}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <Text
        style={{
          color: colors.text,
          marginLeft: 16,
          marginTop: 16,
          fontSize: 24,
          fontWeight: "300",
        }}
      >
        Hi,
      </Text>
      <Text
        style={{
          color: colors.text,
          marginLeft: 16,
          marginTop: 4,
          fontSize: 28,
          fontWeight: "600",
        }}
      >
        {studentName}
      </Text>
      <Text
        style={{
          color: colors.subText,
          marginLeft: 16,
          marginTop: 4,
          fontSize: 16,
        }}
      >
        {rollNumber}
      </Text>

      <Card style={{ margin: 16, backgroundColor: colors.card, elevation: 2 }}>
        <Card.Content>
          <Title style={{ color: colors.text, marginBottom: 8 }}>
            Academic Overview
          </Title>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Paragraph style={{ color: colors.subText }}>CGPA</Paragraph>
              <Text
                style={{ color: colors.text, fontSize: 24, fontWeight: "bold" }}
              >
                {cgpa}
              </Text>
            </View>
            <View>
              <Paragraph style={{ color: colors.subText }}>
                Lowest Attendance
              </Paragraph>
              <Text
                style={{
                  color:
                    lowestAttendance < 75
                      ? colors.danger
                      : lowestAttendance < 85
                      ? colors.warning
                      : colors.good,
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                {lowestAttendance.toFixed(1)}%
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={{ margin: 16, backgroundColor: colors.card, elevation: 2 }}>
        <Card.Content>
          <Title style={{ color: colors.text, marginBottom: 8 }}>
            "Bunkable" Classes
          </Title>
          {bunkableClasses.length > 0 ? (
            bunkableClasses.map((course: any, index: any) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: colors.text, fontSize: 18 }}>
                  {course.course_code}
                </Text>
                <Text style={{ color: colors.good }}>
                  {course.remark.class_to_bunk} classes
                </Text>
              </View>
            ))
          ) : (
            <Paragraph style={{ color: colors.subText }}>
              No classes can be safely missed at this time.
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      <Title style={{ color: colors.text, marginLeft: 16, marginTop: 16 }}>
        Quick Access
      </Title>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          padding: 8,
        }}
      >
        <QuickAccessButton
          icon="graduation-cap"
          title="Grades"
          onPress={() => {
            /* Navigate to Academic Results */
            router.push("/grades");
          }}
        />
        <QuickAccessButton
          icon="calendar-check-o"
          title="Attendance"
          onPress={() => {
            /* Navigate to Attendance */
            router.push("/attendance");
          }}
        />
        <QuickAccessButton
          icon="user"
          title="Profile"
          onPress={() => {
            /* Navigate to Profile */
            router.push("/profile");
          }}
        />
      </View>

      <Card style={{ margin: 16, backgroundColor: colors.card, elevation: 2 }}>
        <Card.Content>
          <Title style={{ color: colors.text }}>Recent Announcements</Title>
          <Paragraph style={{ color: colors.subText, marginTop: 8 }}>
            No new announcements
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={{ margin: 16, backgroundColor: colors.card, elevation: 2 }}>
        <Card.Content>
          <Title style={{ color: colors.text }}>Upcoming Events</Title>
          <Paragraph style={{ color: colors.subText, marginTop: 8 }}>
            No upcoming events
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default HomePage;
