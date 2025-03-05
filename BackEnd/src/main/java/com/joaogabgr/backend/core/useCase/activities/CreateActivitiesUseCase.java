package com.joaogabgr.backend.core.useCase.activities;

import com.joaogabgr.backend.web.dto.activities.CreateActivitiesDTO;
import com.joaogabgr.backend.web.dto.activities.ReadActivitiesDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;

public interface CreateActivitiesUseCase {
    ReadActivitiesDTO execute(CreateActivitiesDTO createActivitiesDTO) throws SystemContextException;
}
