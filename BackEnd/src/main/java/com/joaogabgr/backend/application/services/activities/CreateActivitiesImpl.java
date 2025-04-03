package com.joaogabgr.backend.application.services.activities;

import com.joaogabgr.backend.application.operations.GetLatLog;
import com.joaogabgr.backend.application.operations.activities.ConvertActivitiesToReadDTO;
import com.joaogabgr.backend.application.operations.families.FindFamily;
import com.joaogabgr.backend.application.operations.user.FindUser;
import com.joaogabgr.backend.core.domain.models.Activities;
import com.joaogabgr.backend.core.useCase.activities.CreateActivitiesUseCase;
import com.joaogabgr.backend.infra.repositories.ActivitiesRepository;
import com.joaogabgr.backend.web.dto.activities.CreateActivitiesDTO;
import com.joaogabgr.backend.web.dto.activities.ReadActivitiesDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class CreateActivitiesImpl implements CreateActivitiesUseCase {

    @Autowired
    private ActivitiesRepository activitiesRepository;

    @Autowired
    private FindUser findUser;

    @Autowired
    private ConvertActivitiesToReadDTO convertActivitiesToReadDTO;
    @Autowired
    private FindFamily findFamily;
    @Autowired
    private GetLatLog getLatLog;

    @Override
    public ReadActivitiesDTO execute(CreateActivitiesDTO createActivitiesDTO) throws SystemContextException {
        try {
            if (createActivitiesDTO.isValid()) {
                throw new SystemContextException("Invalid data");
            };

            Activities activities = createActivitiesDTO.toEntity();
            activities.setUser(findUser.execute(createActivitiesDTO.getUserId()));

            if (!Objects.equals(createActivitiesDTO.getFamilyId(), "")) {
                activities.setFamily(findFamily.execute(createActivitiesDTO.getFamilyId()));
            }

            if (createActivitiesDTO.getDaysForRecover() != 0) {
                activities.setDayForRecover(activities.getDateCreated().plusDays(createActivitiesDTO.getDaysForRecover()));
            }

            if (createActivitiesDTO.getLocation() != null) {
                GetLatLog.LatLngResult result = getLatLog.execute(createActivitiesDTO.getLocation());
                activities.setLatitude(result.getLatitude());
                activities.setLongitude(result.getLongitude());
            }

            activitiesRepository.save(activities);

            return convertActivitiesToReadDTO.execute(activities);
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}