package com.joaogabgr.backend.application.services.activities;

import com.joaogabgr.backend.application.operations.GetLatLog;
import com.joaogabgr.backend.application.operations.activities.ConvertActivitiesToReadDTO;
import com.joaogabgr.backend.application.operations.families.FindFamily;
import com.joaogabgr.backend.application.operations.user.FindUser;
import com.joaogabgr.backend.core.domain.models.Activities;
import com.joaogabgr.backend.core.useCase.activities.UpdateActivitiesUseCase;
import com.joaogabgr.backend.infra.repositories.ActivitiesRepository;
import com.joaogabgr.backend.web.dto.activities.ReadActivitiesDTO;
import com.joaogabgr.backend.web.dto.activities.UpdateActivitiesDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class UpdateActivitiesImpl implements UpdateActivitiesUseCase {

    @Autowired
    private ActivitiesRepository activitiesRepository;

    @Autowired
    private FindUser findUser;

    @Autowired
    private ConvertActivitiesToReadDTO convertActivitiesToReadDTO;
    @Autowired
    private GetLatLog getLatLog;
    @Autowired
    private FindFamily findFamily;

    @Override
    public ReadActivitiesDTO execute(UpdateActivitiesDTO updateActivitiesDTO) throws SystemContextException {
        try {
            if (updateActivitiesDTO.isValid()) {
                throw new SystemContextException("Data inválida");
            };

            Activities activities = updateActivitiesDTO.toEntity();
            activities.setUser(findUser.execute(updateActivitiesDTO.getUserId()));

            if (activitiesRepository.findById(activities.getId()).isEmpty()) {
                throw new SystemContextException("Atividade não encontrada");
            }

            if (updateActivitiesDTO.getDaysForRecover() != 0) {
                activities.setDayForRecover(activities.getDateCreated().plusDays(updateActivitiesDTO.getDaysForRecover()));
            }

            if (!updateActivitiesDTO.getLocation().isEmpty()) {
                GetLatLog.LatLngResult result = getLatLog.execute(updateActivitiesDTO.getLocation());
                activities.setLatitude(result.getLatitude());
                activities.setLongitude(result.getLongitude());
            }

            if (updateActivitiesDTO.getDateExpire() != null) {
                activities.setDateExpire(updateActivitiesDTO.getDateExpire().minusHours(3));
            }

            if (!Objects.equals(updateActivitiesDTO.getFamilyId(), "")) {
                activities.setFamily(findFamily.execute(updateActivitiesDTO.getFamilyId()));
            }

            activitiesRepository.save(activities);

            return convertActivitiesToReadDTO.execute(activities);
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
