import * as SecureStore from "expo-secure-store";

const USERNAME_KEY = "secure_username";
const PASSWORD_KEY = "secure_password";

export interface Credentials {
  username: string;
  password: string;
}

export const saveCredentials = async (
  username: string,
  password: string
): Promise<void> => {
  try {
    await SecureStore.setItemAsync(USERNAME_KEY, username);
    await SecureStore.setItemAsync(PASSWORD_KEY, password);
  } catch (error) {
    console.error("Error saving credentials:", error);
    throw new Error("Failed to save credentials securely");
  }
};

export const getCredentials = async (): Promise<Credentials | null> => {
  try {
    const username = await SecureStore.getItemAsync(USERNAME_KEY);
    const password = await SecureStore.getItemAsync(PASSWORD_KEY);

    if (username && password) {
      return { username, password };
    }
    return null;
  } catch (error) {
    console.error("Error retrieving credentials:", error);
    return null;
  }
};

export const clearCredentials = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(USERNAME_KEY);
    await SecureStore.deleteItemAsync(PASSWORD_KEY);
  } catch (error) {
    console.error("Error clearing credentials:", error);
    throw new Error("Failed to clear credentials");
  }
};
