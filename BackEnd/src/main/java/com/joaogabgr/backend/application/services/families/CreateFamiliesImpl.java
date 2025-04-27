package com.joaogabgr.backend.application.services.families;

import com.joaogabgr.backend.core.domain.models.Families;
import com.joaogabgr.backend.core.useCase.families.CreateFamilieUseCase;
import com.joaogabgr.backend.infra.repositories.FamiliesRepository;
import com.joaogabgr.backend.web.dto.families.AddMemberOnFamilyDTO;
import com.joaogabgr.backend.web.dto.families.CreateFamiliesDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreateFamiliesImpl implements CreateFamilieUseCase {
    @Autowired
    private FamiliesRepository familiesRepository;

    @Autowired
    private AddMemberOnFamilyImpl addMemberOnFamilyImpl;

    @Override
    public CreateFamiliesDTO execute(CreateFamiliesDTO createFamiliesDTO) throws SystemContextException {
        try {
            if(createFamiliesDTO.isValid()) {
                throw new SystemContextException("Data invalida");
            }

            Families families = new Families();
            families.setName(createFamiliesDTO.getName());
            families.setDescription(createFamiliesDTO.getDescription());

            familiesRepository.save(families);
            addMemberOnFamily(families.getId(), createFamiliesDTO.getUserEmail());

            return createFamiliesDTO;
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }

    public void addMemberOnFamily(String familyId, String userEmail) throws SystemContextException {
        AddMemberOnFamilyDTO addMemberOnFamilyDTO = new AddMemberOnFamilyDTO();
        addMemberOnFamilyDTO.setFamilyId(familyId);
        addMemberOnFamilyDTO.setUserEmail(userEmail);
        addMemberOnFamilyDTO.setAdmin(true);

        addMemberOnFamilyImpl.execute(addMemberOnFamilyDTO);
    }
}
