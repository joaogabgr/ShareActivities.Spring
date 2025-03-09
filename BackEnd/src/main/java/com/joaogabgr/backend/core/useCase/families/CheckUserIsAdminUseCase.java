package com.joaogabgr.backend.core.useCase.families;

import com.joaogabgr.backend.web.exeption.SystemContextException;

public interface CheckUserIsAdminUseCase {
    boolean execute(String userEmail) throws SystemContextException;
}
