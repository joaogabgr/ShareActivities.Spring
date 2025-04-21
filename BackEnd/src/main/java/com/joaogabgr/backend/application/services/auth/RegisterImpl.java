package com.joaogabgr.backend.application.services.auth;

import com.joaogabgr.backend.application.operations.user.CheckUserCredentials;
import com.joaogabgr.backend.core.domain.models.User;
import com.joaogabgr.backend.core.useCase.auth.RegisterUseCase;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import com.joaogabgr.backend.infra.repositories.UserRepository;
import com.joaogabgr.backend.web.dto.auth.RegisterDTO;
import com.joaogabgr.backend.web.dto.user.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterImpl implements RegisterUseCase {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CheckUserCredentials checkUserCredentials;

    @Override
    public UserDTO register(RegisterDTO data) throws SystemContextException {
        try {
            if (data.isValid()) {
                throw new SystemContextException("Data invalida");
            }

            if (checkUserCredentials.findEmail(data.getEmail())) {
                throw new SystemContextException("Email já cadastrado");
            }

            if (checkUserCredentials.findCpf(data.getCpf())) {
                throw new SystemContextException("CPF já cadastrado");
            }

            if (data.getCpf().length() != 11) {
                throw new SystemContextException("CPF inválido");
            }

            String encodedPassword = encodePassword(data.getPassword());
            User user = (User) data.toEntity(encodedPassword);
            userRepository.save(user);
            return new UserDTO(user.getName(), user.getEmail(), user.getCpf(), user.getRole());
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }

    private String encodePassword(String password) {
        return new BCryptPasswordEncoder().encode(password);
    }
}