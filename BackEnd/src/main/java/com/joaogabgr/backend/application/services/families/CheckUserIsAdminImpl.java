package com.joaogabgr.backend.application.services.families;

import com.joaogabgr.backend.core.domain.models.FamiliesUsers;
import com.joaogabgr.backend.core.useCase.families.CheckUserIsAdminUseCase;
import com.joaogabgr.backend.infra.repositories.FamiliesUsersRepository;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CheckUserIsAdminImpl {
    @Autowired
    private FamiliesUsersRepository familiesUsersRepository;

    public boolean execute(String userEmail, String familyId) throws SystemContextException {
        try {
            return familiesUsersRepository.existsByUserEmailAndFamilyId(userEmail, familyId);
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
