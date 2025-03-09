package com.joaogabgr.backend.application.services.families;

import com.joaogabgr.backend.application.operations.families.FindFamily;
import com.joaogabgr.backend.application.operations.user.FindUser;
import com.joaogabgr.backend.core.domain.models.FamiliesUsers;
import com.joaogabgr.backend.core.domain.models.User;
import com.joaogabgr.backend.core.useCase.families.DeleteMemberOnFamilyUseCase;
import com.joaogabgr.backend.infra.repositories.FamiliesUsersRepository;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeleteMemberOnFamilyImpl implements DeleteMemberOnFamilyUseCase {
    @Autowired
    private FamiliesUsersRepository familiesUsersRepository;

    public void execute(String familyId, String userEmail) throws SystemContextException {
        try {
            FamiliesUsers familiesUsers = familiesUsersRepository.findByUserEmail(userEmail);

            if (!familiesUsers.getFamily().getId().equals(familyId)) {
                throw new SystemContextException("User not in this family");
            }

            familiesUsersRepository.delete(familiesUsers);
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }


}
