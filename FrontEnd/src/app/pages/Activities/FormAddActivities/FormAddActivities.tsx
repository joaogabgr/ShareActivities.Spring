import React from "react";
import ActivityForm from "@/src/app/components/ActivityForm/ActivityForm";
import { useLocalSearchParams } from "expo-router";

export default function FormAddActivities() {
  const params = useLocalSearchParams();
  const familyId = params.familyId as string;
  const familyName = params.familyName as string;

  return <ActivityForm 
    mode="create" 
    familyId={familyId} 
    familyName={familyName}
  />;
}
