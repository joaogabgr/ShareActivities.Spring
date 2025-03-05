package com.joaogabgr.backend.application.services.activities;

import com.joaogabgr.backend.application.operations.activities.ConvertActivitiesToReadDTO;
import com.joaogabgr.backend.application.operations.user.FindUser;
import com.joaogabgr.backend.core.domain.models.Activities;
import com.joaogabgr.backend.core.useCase.activities.UpdateActivitiesUseCase;
import com.joaogabgr.backend.infra.repositories.ActivitiesRepository;
import com.joaogabgr.backend.web.dto.activities.ReadActivitiesDTO;
import com.joaogabgr.backend.web.dto.activities.UpdateActivitiesDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UpdateActivitiesImpl implements UpdateActivitiesUseCase {

    @Autowired
    private ActivitiesRepository activitiesRepository;

    @Autowired
    private FindUser findUser;

    @Autowired
    private ConvertActivitiesToReadDTO convertActivitiesToReadDTO;

    @Override
    public ReadActivitiesDTO execute(UpdateActivitiesDTO updateActivitiesDTO) throws SystemContextException {
        try {
            if (updateActivitiesDTO.isValid()) {
                throw new SystemContextException("Invalid data");
            };

            Activities activities = updateActivitiesDTO.toEntity();
            activities.setUser(findUser.execute(updateActivitiesDTO.getUserId()));

            if (activitiesRepository.findById(activities.getId()).isEmpty()) {
                throw new SystemContextException("Activity not found");
            }

            activitiesRepository.save(activities);

            return convertActivitiesToReadDTO.execute(activities);
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
