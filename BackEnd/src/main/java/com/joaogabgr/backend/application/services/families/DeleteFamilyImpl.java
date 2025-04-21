package com.joaogabgr.backend.application.services.families;

import com.joaogabgr.backend.infra.repositories.FamiliesRepository;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeleteFamilyImpl {

    @Autowired
    private FamiliesRepository familiesRepository;

    public void execute(String familyId) throws SystemContextException {
        if (!familiesRepository.existsById(familyId)) {
            throw new SystemContextException("Familia não encontrada");
        }
        familiesRepository.deleteById(familyId);
    }
}
