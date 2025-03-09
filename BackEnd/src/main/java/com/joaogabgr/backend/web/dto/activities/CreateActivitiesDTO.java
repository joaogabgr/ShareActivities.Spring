package com.joaogabgr.backend.web.dto.activities;

import com.joaogabgr.backend.core.domain.enums.ActivitiesStatus;
import com.joaogabgr.backend.core.domain.models.Activities;
import com.joaogabgr.backend.web.dto.DTO;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.IOException;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class CreateActivitiesDTO implements DTO {
    private String name;
    private String description;
    private String status;
    private String userId;
    private String familyId;

    @Override
    public Activities toEntity() {
        Activities activities = new Activities();
        activities.setName(name);
        activities.setDescription(description);
        activities.setStatus(ActivitiesStatus.valueOf(status));
        activities.setDate(LocalDateTime.now());
        return activities;
    }

    @Override
    public boolean isValid() {
        return isNotNullOrEmpty(name) || isNotNullOrEmpty(description) || isNotNullOrEmpty(status) || isNotNullOrEmpty(userId);
    }
}
