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
        readActivitiesDTO.setDate(activities.getDate().toString());
        return readActivitiesDTO;
    }
}
