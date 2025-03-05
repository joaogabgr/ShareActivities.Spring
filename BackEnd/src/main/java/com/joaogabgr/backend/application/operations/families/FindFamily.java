package com.joaogabgr.backend.application.operations.families;

import com.joaogabgr.backend.core.domain.models.Families;
import com.joaogabgr.backend.infra.repositories.FamiliesRepository;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class FindFamily {
    @Autowired
    private FamiliesRepository familiesRepository;

    public Families execute(String familyID) throws SystemContextException {
        return familiesRepository.findById(familyID).orElseThrow(
                () -> new SystemContextException("Family not found")
        );
    }
}
