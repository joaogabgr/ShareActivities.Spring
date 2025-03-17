package com.joaogabgr.backend.application.operations.activities;

import com.joaogabgr.backend.core.domain.models.Activities;
import com.joaogabgr.backend.web.dto.activities.ReadActivitiesDTO;
import org.springframework.stereotype.Component;

@Component
public class ConvertActivitiesToReadDTO {
    public ReadActivitiesDTO execute(Activities activities) {
        ReadActivitiesDTO readActivitiesDTO = new ReadActivitiesDTO();
        readActivitiesDTO.setId(activities.getId());
        readActivitiesDTO.setName(activities.getName());
        readActivitiesDTO.setDescription(activities.getDescription());
        readActivitiesDTO.setStatus(String.valueOf(activities.getStatus()));
        readActivitiesDTO.setUserName(activities.getUser().getName());
        readActivitiesDTO.setDate(activities.getDateCreated().toString());
        readActivitiesDTO.setPriority(String.valueOf(activities.getPriority()));
        if (activities.getFamily() != null) {
            readActivitiesDTO.setFamilyName(activities.getFamily().getName());
        }
        readActivitiesDTO.setType(activities.getType());
        if (activities.getDateExpire() != null) {
            readActivitiesDTO.setDateExpire(activities.getDateExpire().toString());
        }
        if (activities.getDayForRecover() != null) {
            readActivitiesDTO.setDayForRecover(activities.getDayForRecover().toString());
        }
        return readActivitiesDTO;
    }
}