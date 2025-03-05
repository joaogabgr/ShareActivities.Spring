package com.joaogabgr.backend.core.useCase.activities;

import com.joaogabgr.backend.web.dto.activities.ReadActivitiesDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;

public interface ReadActivitiesUseCase {
    ReadActivitiesDTO execute(String activitiesId) throws SystemContextException;
}
