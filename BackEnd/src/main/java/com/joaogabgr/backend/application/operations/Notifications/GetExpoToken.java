package com.joaogabgr.backend.application.operations.Notifications;

import com.joaogabgr.backend.core.domain.models.User;
import com.joaogabgr.backend.infra.repositories.UserRepository;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class GetExpoToken {
    @Autowired
    private UserRepository userRepository;

    public String execute(String email) throws SystemContextException {
        User user = userRepository.findByEmail(email).orElseThrow( () -> new SystemContextException("User not found"));

        if (user.getExpoToken() == null) {
            throw new SystemContextException("Expo token not found");
        }
        return user.getExpoToken();
    }
}
