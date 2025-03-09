package com.joaogabgr.backend.core.useCase.families;

import com.joaogabgr.backend.web.exeption.SystemContextException;

public interface DeleteMemberOnFamilyUseCase {
    void execute(String familyId, String userEmail) throws SystemContextException;
}
