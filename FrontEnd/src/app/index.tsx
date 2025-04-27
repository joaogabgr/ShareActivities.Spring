import { View, ActivityIndicator, SafeAreaView } from "react-native";
import { useEffect, useContext, useState } from "react";
import { useRouter } from "expo-router";
import { AuthProvider, AuthContext } from "../contexts/AuthContext";
import React from "react";

export default function Index() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

function Main() {
  const { validateToken, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      await validateToken();
      setLoading(false);
    };
    checkToken();
  }, []);

  useEffect(() => {
    if (!loading) {
      router.replace(isAuthenticated ? "/pages/Default" : "/pages/auth/Login");
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return null;
}
