package com.joaogabgr.backend.core.useCase.families;

import com.joaogabgr.backend.web.dto.families.AddMemberOnFamilyDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;

public interface AddMemberOnFamilyUseCase {
    void execute(AddMemberOnFamilyDTO addMemberOnFamilyDTO) throws SystemContextException;
}
