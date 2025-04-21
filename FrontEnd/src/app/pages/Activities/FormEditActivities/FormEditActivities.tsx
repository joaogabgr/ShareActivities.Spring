import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import ActivityForm from "@/src/app/components/ActivityForm/ActivityForm";

export default function FormEditActivities() {
  const params = useLocalSearchParams();
  const [activityData, setActivityData] = useState<any>(null);
  const familyId = params.familyId as string;
  const familyName = params.familyName as string;
  
  useEffect(() => {
    // Parse activityData e adiciona familyId se necessário
    if (params.activity) {
      const parsedActivity = JSON.parse(params.activity as string);
      
      // Se temos um familyId nas props, garante que ele é adicionado ao objeto da atividade
      if (familyId && !parsedActivity.familyId) {
        parsedActivity.familyId = familyId;
      }
      setActivityData(parsedActivity);
    }
  }, [params.activity, familyId]);

  if (!activityData) return null;

  return <ActivityForm 
    mode="edit" 
    activityData={activityData} 
    familyId={familyId} 
    familyName={familyName}
  />;
}