package com.joaogabgr.backend.web.dto.families;

import lombok.Data;

@Data
public class FamilyUserDTO {
    private String userId;
    private String userName;
    private String userEmail;
    private Boolean isAdmin;

    public FamilyUserDTO(String userId, String userName, String userEmail, Boolean isAdmin) {
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.isAdmin = isAdmin;
    }
}
