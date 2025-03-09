package com.joaogabgr.backend.core.useCase.families;

import com.joaogabgr.backend.web.exeption.SystemContextException;

public interface DeleteInviteUseCase {
    void execute(String inviteId) throws SystemContextException;
}
