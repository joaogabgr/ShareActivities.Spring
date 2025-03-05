package com.joaogabgr.backend.core.useCase.activities;

import com.joaogabgr.backend.web.dto.activities.ReadActivitiesDTO;
import com.joaogabgr.backend.web.dto.activities.UpdateActivitiesDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;

public interface UpdateActivitiesUseCase {
    ReadActivitiesDTO execute(UpdateActivitiesDTO updateActivitiesDTO) throws SystemContextException;
}
