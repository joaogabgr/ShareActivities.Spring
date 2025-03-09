package com.joaogabgr.backend.core.useCase.families;

import com.joaogabgr.backend.web.dto.families.AddMemberOnFamilyDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;

public interface AcceptInviteMemberUseCase {
    void execute(String inviteId) throws SystemContextException;
}
