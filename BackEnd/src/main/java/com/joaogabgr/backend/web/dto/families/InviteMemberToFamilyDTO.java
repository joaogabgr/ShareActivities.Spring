package com.joaogabgr.backend.web.dto.families;

import com.joaogabgr.backend.web.dto.DTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InviteMemberToFamilyDTO implements DTO {
    private String familyId;
    private String userEmail;
    private String invitedEmail;

    @Override
    public Object toEntity() {
        return null;
    }

    @Override
    public boolean isValid() {
        return isNotNullOrEmpty(familyId) ||
                isNotNullOrEmpty(userEmail) ||
                isNotNullOrEmpty(invitedEmail);
    }
}
