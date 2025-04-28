package com.joaogabgr.backend.web.dto.activities;

import com.joaogabgr.backend.core.domain.enums.ActivitiesStatus;
import com.joaogabgr.backend.core.domain.enums.PriorityActivities;
import com.joaogabgr.backend.core.domain.models.Activities;
import com.joaogabgr.backend.web.dto.DTO;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class CreateActivitiesDTO implements DTO {
    private String name;
    private String description;
    private String status;
    private String priority;
    private String userId;
    private String familyId;
    private String type;
    private LocalDateTime dateCreated;
    private LocalDateTime dateExpire;
    private Integer daysForRecover;
    private String notes;
    private String location;
    private String linkUrl;
    private String photoUrl;
    private String documentUrl;
    private String photoName;
    private String documentName;

    @Override
    public Activities toEntity() {
        Activities activities = new Activities();
        activities.setName(name);
        activities.setDescription(description);
        activities.setStatus(ActivitiesStatus.valueOf(status));
        activities.setDateCreated(dateCreated);
        activities.setDateExpire(dateExpire.withHour(0).withMinute(0).withSecond(0).withNano(0));
        activities.setType(type);
        activities.setPriority(PriorityActivities.valueOf(priority));
        activities.setNotes(notes);
        activities.setImageUrl(photoUrl);
        activities.setDocumentUrl(documentUrl);
        activities.setImageName(photoName);
        activities.setDocumentName(documentName);
        activities.setLinkUrl(linkUrl);
        return activities;
    }

    @Override
    public boolean isValid() {
        return isNotNullOrEmpty(name) || isNotNullOrEmpty(description) || isNotNullOrEmpty(status) || isNotNullOrEmpty(userId) ||
                isNotNullOrEmpty(type) || isNotNullOrEmpty(priority);
    }
}