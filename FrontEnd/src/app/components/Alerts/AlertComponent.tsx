import { Alert } from "react-native";

export const ErrorAlertComponent = (title: string, message: string) => {
  Alert.alert(title, message);
};

export const SuccessAlertComponent = (title: string, message: string) => {
  Alert.alert(title, message);
};