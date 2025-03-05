package com.joaogabgr.backend.application.operations.user;

import com.joaogabgr.backend.infra.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CheckUserCredentials {

    @Autowired
    private UserRepository userRepository;

    public boolean findEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public boolean findCpf(String cpf) {
        return userRepository.findByCpf(cpf) != null;
    }
}
