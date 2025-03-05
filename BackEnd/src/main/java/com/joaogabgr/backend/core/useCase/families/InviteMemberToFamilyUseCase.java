package com.joaogabgr.backend.core.useCase.families;

import com.joaogabgr.backend.core.domain.models.Invites;
import com.joaogabgr.backend.web.dto.families.InviteMemberToFamilyDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;

public interface InviteMemberToFamilyUseCase {
    Invites execute(InviteMemberToFamilyDTO inviteMemberToFamilyDTO) throws SystemContextException;
}
