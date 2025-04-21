package com.joaogabgr.backend.application.operations.FamiliesUsers;

import com.joaogabgr.backend.web.dto.families.FamilyUserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MapFamilyUsersToDTO {

    public FamilyUserDTO execute(String familyId, String userName, String userEmail, boolean admin) {
        return new FamilyUserDTO(familyId, userName, userEmail, admin);
    }
}
