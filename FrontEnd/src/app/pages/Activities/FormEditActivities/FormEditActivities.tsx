import React from "react";
import { useLocalSearchParams } from "expo-router";
import ActivityForm from "@/src/app/components/ActivityForm/ActivityForm";

export default function FormEditActivities() {
  const params = useLocalSearchParams();
  const activityData = params.activity ? JSON.parse(params.activity as string) : null;

  return <ActivityForm mode="edit" activityData={activityData} />;
}