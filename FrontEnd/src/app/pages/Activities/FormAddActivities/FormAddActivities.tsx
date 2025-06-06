import React from "react";
import ActivityForm from "@/src/app/components/ActivityForm/ActivityForm";
import { useLocalSearchParams } from "expo-router";

export default function FormAddActivities() {
  const params = useLocalSearchParams();
  const familyId = params.familyId as string;
  const familyName = params.familyName as string;

  // Extrai possíveis dados vindos do Gemini
  const initialData = {
    name: params.name as string,
    description: params.description as string,
    dateExpire: params.dateExpire as string,
    priority: params.priority as string,
    status: params.status as string,
    type: params.type as string,
    notes: params.notes as string,
    location: params.location as string,
    daysForRecover: params.daysForRecover as string,
  };
  // Remove campos undefined ou vazios
  const filteredInitialData = Object.fromEntries(
    Object.entries(initialData).filter(([_, v]) => v !== undefined && v !== "")
  );

  return <ActivityForm 
    mode="create" 
    familyId={familyId} 
    familyName={familyName}
    initialData={Object.keys(filteredInitialData).length > 0 ? filteredInitialData : undefined}
  />;
}
