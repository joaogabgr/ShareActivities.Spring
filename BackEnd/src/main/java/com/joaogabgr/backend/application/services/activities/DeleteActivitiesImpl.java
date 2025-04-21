package com.joaogabgr.backend.application.services.activities;

import com.joaogabgr.backend.core.useCase.activities.DeleteActivitiesUseCase;
import com.joaogabgr.backend.infra.repositories.ActivitiesRepository;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeleteActivitiesImpl implements DeleteActivitiesUseCase {

    @Autowired
    private ActivitiesRepository activitiesRepository;


    @Override
    public String execute(String activitiesId) throws SystemContextException {
        try {
            if (!activitiesRepository.existsById(activitiesId)) {
                throw new SystemContextException("Atividade não encontrada");
            }

            activitiesRepository.deleteById(activitiesId);
            return "Atividade deletada com sucesso";
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
