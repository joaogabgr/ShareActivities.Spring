package com.joaogabgr.backend.application.services.auth;

import com.joaogabgr.backend.core.domain.models.User;
import com.joaogabgr.backend.core.useCase.auth.LoginUseCase;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import com.joaogabgr.backend.infra.security.TokenService;
import com.joaogabgr.backend.web.dto.auth.AuthenticationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class LoginImpl implements LoginUseCase {

    @Autowired
    private TokenService tokenService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public String login(AuthenticationDTO data) throws SystemContextException {
        try {
            if (data.isValid()) {
                throw new SystemContextException("Invalid data");
            }

            var usernamePassword = new UsernamePasswordAuthenticationToken(data.getEmail(), data.getPassword());
            var auth = authenticationManager.authenticate(usernamePassword);

            return tokenService.generateToken((User) auth.getPrincipal());
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
