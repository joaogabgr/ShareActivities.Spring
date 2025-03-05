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
    private String date;
}
