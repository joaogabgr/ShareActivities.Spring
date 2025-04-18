package com.joaogabgr.backend.application.services.activities;

import com.joaogabgr.backend.application.operations.Notifications.GetExpoToken;
import com.joaogabgr.backend.application.operations.Notifications.PushNotificationService;
import com.joaogabgr.backend.core.domain.enums.ActivitiesStatus;
import com.joaogabgr.backend.core.domain.models.Activities;
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

    @Autowired
    private PushNotificationService pushNotificationService;

    @Autowired
    private GetExpoToken getExpoToken;


    @Override
    public String execute(ChangeStatusDTO changeStatusDTO) throws SystemContextException {
        var activity = activitiesRepository.findById(changeStatusDTO.getId())
                .orElseThrow(() -> new SystemContextException("Activity not found"));
        activity.setStatus(ActivitiesStatus.valueOf(changeStatusDTO.getStatus()));
        activitiesRepository.save(activity);
        sendNotification(activity);
        return "Status changed successfully";
    }

    private void sendNotification(Activities activity) throws SystemContextException {
        String expoToken = getExpoToken.execute(activity.getUser().getEmail());
        String title = "Status da atividade alterado";
        String message = "Alterado o status da atividade " + activity.getName() + " para " + activity.getStatus().getLabel();

        pushNotificationService.sendPushNotification(expoToken, title, message);
    }
}
