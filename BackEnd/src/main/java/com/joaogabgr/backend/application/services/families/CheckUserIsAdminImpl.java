package com.joaogabgr.backend.application.services.families;

import com.joaogabgr.backend.core.domain.models.FamiliesUsers;
import com.joaogabgr.backend.core.useCase.families.CheckUserIsAdminUseCase;
import com.joaogabgr.backend.infra.repositories.FamiliesUsersRepository;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CheckUserIsAdminImpl implements CheckUserIsAdminUseCase {
    @Autowired
    private FamiliesUsersRepository familiesUsersRepository;

    @Override
    public boolean execute(String userEmail) throws SystemContextException {
        try {
            FamiliesUsers familiesUsers = familiesUsersRepository.findByUserEmail(userEmail);
            if (!familiesUsers.getIsAdmin()) {
                throw new SystemContextException("User is not admin");
            } else {
                return true;
            }
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
