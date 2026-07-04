/// <reference types="expo" />

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_BACKEND_URL: string;
    EXPO_PUBLIC_MEALDB_URL: string;
  }
}
