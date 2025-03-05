package com.joaogabgr.backend.core.useCase.activities;

import com.joaogabgr.backend.web.dto.activities.ChangeStatusDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;

public interface ChangeStatusUseCase {
    String execute(ChangeStatusDTO changeStatusDTO) throws SystemContextException;
}
