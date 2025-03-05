package com.joaogabgr.backend.core.useCase.auth;

import com.joaogabgr.backend.web.exeption.SystemContextException;
import com.joaogabgr.backend.web.dto.auth.AuthenticationDTO;

public interface LoginUseCase {
    String login(AuthenticationDTO authenticationDTO) throws SystemContextException;
}
