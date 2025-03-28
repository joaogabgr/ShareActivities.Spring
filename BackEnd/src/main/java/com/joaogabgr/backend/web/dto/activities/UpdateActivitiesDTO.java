package com.joaogabgr.backend.web.dto.activities;

import com.joaogabgr.backend.core.domain.enums.ActivitiesStatus;
import com.joaogabgr.backend.core.domain.enums.PriorityActivities;
import com.joaogabgr.backend.core.domain.models.Activities;
import com.joaogabgr.backend.web.dto.DTO;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.IOException;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class UpdateActivitiesDTO implements DTO {
    private String id;
    private String name;
    private String description;
    private String status;
    private String priority;
    private String userId;
    private String familyId;
    private String type;
    private LocalDateTime dateExpire;
    private LocalDateTime dateCreated;
    private Integer daysForRecover;

    @Override
    public Activities toEntity(){
        Activities activities = new Activities();
        activities.setId(id);
        activities.setName(name);
        activities.setDescription(description);
        activities.setStatus(ActivitiesStatus.valueOf(status));
        activities.setDateExpire(dateExpire);
        activities.setDateCreated(dateCreated);
        activities.setType(type);
        activities.setPriority(PriorityActivities.valueOf(priority));
        return activities;
    }

    @Override
    public boolean isValid() {
        return isNotNullOrEmpty(id) || isNotNullOrEmpty(name) || isNotNullOrEmpty(description) || isNotNullOrEmpty(status) || isNotNullOrEmpty(userId) ||
                isNotNullOrEmpty(type) || isNotNullOrEmpty(priority) || isNotNullOrEmpty(String.valueOf(dateCreated));
    }
}
