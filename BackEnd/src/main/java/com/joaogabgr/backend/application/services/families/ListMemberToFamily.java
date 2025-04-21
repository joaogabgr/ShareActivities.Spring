package com.joaogabgr.backend.application.services.families;

import com.joaogabgr.backend.core.domain.models.FamiliesUsers;
import com.joaogabgr.backend.infra.repositories.FamiliesUsersRepository;
import com.joaogabgr.backend.web.dto.families.FamilyUserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
public class ListMemberToFamily {
    @Autowired
    private FamiliesUsersRepository familiesUsersRepository;

    public List<FamilyUserDTO> execute(String familyId) {
        return familiesUsersRepository.findAllUsersByFamilyId(familyId).stream()
                .map(familyUser -> new FamilyUserDTO(
                        familyUser.getUser().getId(),
                        familyUser.getUser().getName(),
                        familyUser.getUser().getEmail(),
                        familyUser.getIsAdmin()
                ))
                .toList();
    }

}
