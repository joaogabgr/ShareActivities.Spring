package com.joaogabgr.backend.core.useCase.families;

import com.joaogabgr.backend.web.dto.families.UpdateFamilyDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;

public interface UpdateFamilyUseCase {
    UpdateFamilyDTO execute(UpdateFamilyDTO updateFamilyDTO) throws SystemContextException;
} 