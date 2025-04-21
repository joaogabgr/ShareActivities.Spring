package com.joaogabgr.backend.application.services.activities;

import com.joaogabgr.backend.application.operations.activities.ConvertActivitiesToReadDTO;
import com.joaogabgr.backend.core.useCase.activities.ReadActivitiesUseCase;
import com.joaogabgr.backend.infra.repositories.ActivitiesRepository;
import com.joaogabgr.backend.web.dto.activities.ReadActivitiesDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReadActivitiesImpl implements ReadActivitiesUseCase {

    @Autowired
    private ActivitiesRepository activitiesRepository;

    @Autowired
    private ConvertActivitiesToReadDTO convertActivitiesToReadDTO;

    @Override
    public ReadActivitiesDTO execute(String activitiesId) throws SystemContextException {
        return activitiesRepository.findById(activitiesId)
                .map(convertActivitiesToReadDTO::execute)
                .orElseThrow(() -> new SystemContextException("Atividade não encontrada"));
    }
}
