package com.joaogabgr.backend.core.useCase.activities;

import com.joaogabgr.backend.web.dto.activities.ReadActivitiesDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;

import java.util.List;

public interface ReadActivitiesPerUserUseCase {
    List<ReadActivitiesDTO> execute(String userEmail) throws SystemContextException;
}
