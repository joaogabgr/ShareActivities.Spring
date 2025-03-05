package com.joaogabgr.backend.web.dto.families;

import com.joaogabgr.backend.web.dto.DTO;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AddMemberOnFamilyDTO implements DTO{
    private String familyId;
    private String userEmail;
    private boolean isAdmin;

    @Override
    public Object toEntity() {
        return null;
    }

    @Override
    public boolean isValid() {
        return isNotNullOrEmpty(familyId) || isNotNullOrEmpty(userEmail);
    }
}
