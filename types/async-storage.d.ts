// src/types/async-storage.d.ts

declare module "@react-native-async-storage/async-storage" {
  export function getItem(key: string): Promise<string | null>;
  export function setItem(key: string, value: string): Promise<void>;
  // Add other methods you use from AsyncStorage here
}
