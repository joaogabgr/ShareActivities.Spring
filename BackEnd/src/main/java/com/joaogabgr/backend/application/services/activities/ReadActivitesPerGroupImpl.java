package com.joaogabgr.backend.application.services.activities;

import com.joaogabgr.backend.application.operations.activities.ConvertActivitiesToReadDTO;
import com.joaogabgr.backend.core.domain.models.Activities;
import com.joaogabgr.backend.infra.repositories.ActivitiesRepository;
import com.joaogabgr.backend.web.dto.activities.ReadActivitiesDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReadActivitesPerGroupImpl {
    @Autowired
    private ActivitiesRepository activitiesRepository;
    @Autowired
    private ConvertActivitiesToReadDTO convertActivitiesToReadDTO;

    public List<ReadActivitiesDTO> execute(String familyId) throws SystemContextException {
        try {
            return activitiesRepository.findByFamilyId(familyId).stream()
                    .map(convertActivitiesToReadDTO::execute)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new SystemContextException("Erro ao ler a atividade de: " + familyId + ", " + e.getMessage());
        }
    }
}
