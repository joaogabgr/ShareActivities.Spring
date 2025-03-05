package com.joaogabgr.backend.core.useCase.families;

import com.joaogabgr.backend.web.dto.families.CreateFamiliesDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;

public interface CreateFamilieUseCase {
    CreateFamiliesDTO execute(CreateFamiliesDTO createFamiliesDTO) throws SystemContextException;
}
