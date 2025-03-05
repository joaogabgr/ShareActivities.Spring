package com.joaogabgr.backend.application.services.families;

import com.joaogabgr.backend.application.operations.families.FindFamily;
import com.joaogabgr.backend.application.operations.user.FindUser;
import com.joaogabgr.backend.core.domain.models.Families;
import com.joaogabgr.backend.core.domain.models.FamiliesUsers;
import com.joaogabgr.backend.core.domain.models.FamiliesUsersId;
import com.joaogabgr.backend.core.domain.models.User;
import com.joaogabgr.backend.core.useCase.families.AddMemberOnFamilyUseCase;
import com.joaogabgr.backend.infra.repositories.FamiliesUsersRepository;
import com.joaogabgr.backend.web.dto.families.AddMemberOnFamilyDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AddMemberOnFamilyImpl implements AddMemberOnFamilyUseCase {
    @Autowired
    private FamiliesUsersRepository familiesUsersRepository;
    @Autowired
    private FindUser findUser;
    @Autowired
    private FindFamily findFamily;

    @Override
    public void execute(AddMemberOnFamilyDTO addMemberOnFamilyDTO) throws SystemContextException {
        try {
            if(addMemberOnFamilyDTO.isValid()) {
                throw new SystemContextException("Invalid data");
            }

            if(familiesUsersRepository.existsByUserEmail(addMemberOnFamilyDTO.getUserEmail())) {
                throw new SystemContextException("User already in family");
            }

            User user = findUser.execute(addMemberOnFamilyDTO.getUserEmail());
            if (user == null) {
                throw new SystemContextException("User not found");
            }

            Families families = findFamily.execute(addMemberOnFamilyDTO.getFamilyId());
            if (families == null) {
                throw new SystemContextException("Family not found");
            }

            FamiliesUsersId familiesUsersId = new FamiliesUsersId();
            familiesUsersId.setFamilyId(families.getId());
            familiesUsersId.setUserId(user.getId());

            FamiliesUsers familiesUsers = new FamiliesUsers(familiesUsersId, user, families, addMemberOnFamilyDTO.isAdmin());

            familiesUsersRepository.save(familiesUsers);
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
