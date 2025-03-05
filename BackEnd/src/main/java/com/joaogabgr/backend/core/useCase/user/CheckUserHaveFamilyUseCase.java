package com.joaogabgr.backend.core.useCase.user;

import com.joaogabgr.backend.web.exeption.SystemContextException;

public interface CheckUserHaveFamilyUseCase {
    boolean execute(String userEmail) throws SystemContextException;
}
