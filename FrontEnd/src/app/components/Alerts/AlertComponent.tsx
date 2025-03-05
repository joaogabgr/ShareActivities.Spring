import { Alert, Button } from 'react-native';

export const ErrorAlertComponent = (title: string, msg: string) => {
  Alert.alert(
    title,
    msg,
    [
      { text: "OK" }
    ]
  );
};