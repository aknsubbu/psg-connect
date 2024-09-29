import { useState, useEffect } from "react";
import { studentDataManager } from "@/components/functions/studentDataManager";

interface StudentData {
  student_profile: any;
  attendance: any;
  current_semester_results: any;
  previous_semester_results: any;
  ca_marks: any;
}

interface UseStudentDataReturn {
  data: StudentData | null;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  refreshData: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useStudentData = (): UseStudentDataReturn => {
  const [data, setData] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await studentDataManager.fetchAndStoreData(
        username,
        password
      );
      if (result.success && result.data) {
        setData(result.data);
        setIsLoggedIn(true);
      } else {
        setError(result.error || "Failed to fetch data");
      }
    } catch (err) {
      setError("An error occurred while logging in");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await studentDataManager.refreshIfNeeded();
      const refreshedData = await studentDataManager.getData();
      if (refreshedData) {
        setData(refreshedData);
      } else {
        setError("Failed to refresh data");
      }
    } catch (err) {
      setError("An error occurred while refreshing data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await studentDataManager.clearData();
      setData(null);
      setIsLoggedIn(false);
    } catch (err) {
      setError("An error occurred while logging out");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      setIsLoading(true);
      try {
        const hasCredentials = await studentDataManager.hasStoredCredentials();
        setIsLoggedIn(hasCredentials);
        if (hasCredentials) {
          const storedData = await studentDataManager.getData();
          if (storedData) {
            setData(storedData);
          } else {
            await refreshData();
          }
        }
      } catch (err) {
        console.error("Error checking login status:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  return { data, isLoading, error, isLoggedIn, login, refreshData, logout };
};
