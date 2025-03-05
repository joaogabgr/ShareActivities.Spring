package com.joaogabgr.backend.application.services.user;

import com.joaogabgr.backend.core.useCase.user.CheckUserHaveFamilyUseCase;
import com.joaogabgr.backend.infra.repositories.FamiliesUsersRepository;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CheckUserHaveFamilyImpl implements CheckUserHaveFamilyUseCase {

    @Autowired
    private FamiliesUsersRepository familiesUsersRepository;

    @Override
    public boolean execute(String userEmail) throws SystemContextException {
        try {
            return familiesUsersRepository.existsByUserEmail(userEmail);
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
