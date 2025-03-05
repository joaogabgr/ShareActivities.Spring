package com.joaogabgr.backend.core.useCase.activities;

import com.joaogabgr.backend.web.exeption.SystemContextException;

public interface DeleteActivitiesUseCase {
    String execute(String activitiesId) throws SystemContextException;
}
