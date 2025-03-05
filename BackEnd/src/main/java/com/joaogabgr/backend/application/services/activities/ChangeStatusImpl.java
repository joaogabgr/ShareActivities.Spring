package com.joaogabgr.backend.application.services.activities;

import com.joaogabgr.backend.core.domain.enums.ActivitiesStatus;
import com.joaogabgr.backend.core.useCase.activities.ChangeStatusUseCase;
import com.joaogabgr.backend.infra.repositories.ActivitiesRepository;
import com.joaogabgr.backend.web.dto.activities.ChangeStatusDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChangeStatusImpl implements ChangeStatusUseCase {

    @Autowired
    private ActivitiesRepository activitiesRepository;


    @Override
    public String execute(ChangeStatusDTO changeStatusDTO) throws SystemContextException {
        var activity = activitiesRepository.findById(changeStatusDTO.getId())
                .orElseThrow(() -> new SystemContextException("Activity not found"));
        activity.setStatus(ActivitiesStatus.valueOf(changeStatusDTO.getStatus()));
        activitiesRepository.save(activity);
        return "Status changed successfully";
    }
}
