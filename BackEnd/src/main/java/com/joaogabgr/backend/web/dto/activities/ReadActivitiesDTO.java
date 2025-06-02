package com.joaogabgr.backend.web.dto.activities;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReadActivitiesDTO {
    private String id;
    private String name;
    private String description;
    private String status;
    private String userName;
    private String priority;
    private String familyName;
    private String type;
    private String dateCreated;
    private String dateExpire;
    private String dayForRecover;
    private String notes;
    private String location;
    private String latLog;
    private String linkUrl;
    private String photoUrl;
    private String documentUrl;
    private String photoName;
    private String documentName;
    private String warning;
}