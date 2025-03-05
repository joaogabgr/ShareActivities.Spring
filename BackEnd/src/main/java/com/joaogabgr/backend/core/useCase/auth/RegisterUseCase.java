package com.joaogabgr.backend.core.useCase.auth;

import com.joaogabgr.backend.web.exeption.SystemContextException;
import com.joaogabgr.backend.web.dto.auth.RegisterDTO;
import com.joaogabgr.backend.web.dto.user.UserDTO;

public interface RegisterUseCase {
    UserDTO register(RegisterDTO registerDTO) throws SystemContextException;
}
