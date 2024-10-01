import * as FileSystem from "expo-file-system";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import {
  saveCredentials,
  getCredentials,
  clearCredentials,
  Credentials,
} from "./secureCredStorage";

const API_URL = "https://psg-connect-wt9qm.ondigitalocean.app/fetch_data";
const STUDENT_DATA_FILE = FileSystem.documentDirectory + "student_data.json";

interface StudentData {
  student_profile: any;
  attendance: any;
  current_semester_results: any;
  previous_semester_results: any;
  ca_marks: any;
}

interface FetchResult {
  success: boolean;
  data?: StudentData;
  error?: string;
}

class StudentDataManager {
  private static instance: StudentDataManager;
  private data: StudentData | null = null;
  private lastFetchTime: number = 0;
  private readonly FETCH_INTERVAL = 10000; // 1 hour in milliseconds

  private constructor() {}

  public static getInstance(): StudentDataManager {
    if (!StudentDataManager.instance) {
      StudentDataManager.instance = new StudentDataManager();
    }
    return StudentDataManager.instance;
  }

  private async checkNetworkConnectivity(): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected === true && netInfo.isInternetReachable === true;
  }

  private async fetchFromServer(
    credentials: Credentials
  ): Promise<FetchResult> {
    try {
      const isConnected = await this.checkNetworkConnectivity();
      if (!isConnected) {
        return {
          success: false,
          error:
            "No internet connection. Please check your network and try again.",
        };
      }

      const response = await axios.post(API_URL, credentials, {
        timeout: 10000, // 10 seconds timeout
      });

      if (response.data.status === "success") {
        return { success: true, data: response.data.data };
      } else {
        return {
          success: false,
          error: "Data fetch was not successful. Please try again later.",
        };
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          return {
            success: false,
            error:
              "The request timed out. Please check your internet connection and try again.",
          };
        }
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          return {
            success: false,
            error: `Server error: ${error.response.status}. Please try again later.`,
          };
        } else if (error.request) {
          // The request was made but no response was received
          return {
            success: false,
            error:
              "No response received from server. Please check your internet connection and try again.",
          };
        }
      }
      // Something happened in setting up the request that triggered an Error
      console.error("Error fetching data from server:", error);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      };
    }
  }

  private async saveToFile(data: StudentData): Promise<void> {
    try {
      const jsonValue = JSON.stringify(data);
      await FileSystem.writeAsStringAsync(STUDENT_DATA_FILE, jsonValue);
    } catch (error) {
      console.error("Error saving data to file:", error);
      throw new Error("Failed to save data to local storage.");
    }
  }

  private async loadFromFile(): Promise<StudentData | null> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(STUDENT_DATA_FILE);
      if (!fileInfo.exists) {
        return null;
      }
      const jsonValue = await FileSystem.readAsStringAsync(STUDENT_DATA_FILE);
      return JSON.parse(jsonValue) as StudentData;
    } catch (error) {
      console.error("Error loading data from file:", error);
      return null;
    }
  }

  public async fetchAndStoreData(
    username: string,
    password: string
  ): Promise<FetchResult> {
    try {
      await saveCredentials(username, password);
      const credentials = await getCredentials();
      if (!credentials) {
        return { success: false, error: "Failed to retrieve credentials" };
      }
      const result = await this.fetchFromServer(credentials);
      if (result.success && result.data) {
        await this.saveToFile(result.data);
        this.data = result.data;
        this.lastFetchTime = Date.now();
      }
      return result;
    } catch (error) {
      console.error("Error in fetchAndStoreData:", error);
      return {
        success: false,
        error: "An unexpected error occurred while fetching and storing data.",
      };
    }
  }

  public async getData(): Promise<StudentData | null> {
    if (!this.data) {
      this.data = await this.loadFromFile();
    }
    return this.data;
  }

  public async refreshIfNeeded(): Promise<FetchResult> {
    const now = Date.now();
    if (now - this.lastFetchTime > this.FETCH_INTERVAL) {
      const credentials = await getCredentials();
      if (credentials) {
        return this.fetchAndStoreData(
          credentials.username,
          credentials.password
        );
      } else {
        return {
          success: false,
          error: "No stored credentials found. Please log in again.",
        };
      }
    }
    return { success: true, data: this.data || undefined };
  }

  public async clearData(): Promise<void> {
    try {
      this.data = null;
      this.lastFetchTime = 0;
      await clearCredentials();
      await FileSystem.deleteAsync(STUDENT_DATA_FILE, { idempotent: true });
    } catch (error) {
      console.error("Error clearing data:", error);
      throw new Error("Failed to clear data and credentials.");
    }
  }

  public async hasStoredCredentials(): Promise<boolean> {
    const credentials = await getCredentials();
    return credentials !== null;
  }

  public async isDataStale(): Promise<boolean> {
    const now = Date.now();
    return now - this.lastFetchTime > this.FETCH_INTERVAL;
  }
}

export const studentDataManager = StudentDataManager.getInstance();
