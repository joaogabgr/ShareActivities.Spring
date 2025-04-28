package com.joaogabgr.backend.application.services.activities;

import com.joaogabgr.backend.application.operations.GetLatLog;
import com.joaogabgr.backend.application.operations.Notifications.GetExpoToken;
import com.joaogabgr.backend.application.operations.Notifications.PushNotificationService;
import com.joaogabgr.backend.application.operations.activities.ConvertActivitiesToReadDTO;
import com.joaogabgr.backend.application.operations.families.FindFamily;
import com.joaogabgr.backend.application.operations.user.FindUser;
import com.joaogabgr.backend.application.services.families.ListMemberToFamily;
import com.joaogabgr.backend.core.domain.models.Activities;
import com.joaogabgr.backend.core.useCase.activities.CreateActivitiesUseCase;
import com.joaogabgr.backend.infra.repositories.ActivitiesRepository;
import com.joaogabgr.backend.web.dto.activities.CreateActivitiesDTO;
import com.joaogabgr.backend.web.dto.activities.ReadActivitiesDTO;
import com.joaogabgr.backend.web.dto.families.FamilyUserDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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
    @Autowired
    private GetExpoToken getExpoToken;
    @Autowired
    private PushNotificationService pushNotificationService;
    @Autowired
    private ListMemberToFamily listMemberToFamily;

    @Override
    public ReadActivitiesDTO execute(CreateActivitiesDTO createActivitiesDTO) throws SystemContextException {
        try {
            if (createActivitiesDTO.isValid()) {
                throw new SystemContextException("Data inválida");
            };

            Activities activities = createActivitiesDTO.toEntity();
            activities.setUser(findUser.execute(createActivitiesDTO.getUserId()));

            if (!Objects.equals(createActivitiesDTO.getFamilyId(), "")) {
                activities.setFamily(findFamily.execute(createActivitiesDTO.getFamilyId()));
            }

            if (createActivitiesDTO.getDaysForRecover() != 0) {
                activities.setDayForRecover(activities.getDateCreated().plusDays(createActivitiesDTO.getDaysForRecover()));
            }

            if (!createActivitiesDTO.getLocation().isEmpty()) {
                GetLatLog.LatLngResult result = getLatLog.execute(createActivitiesDTO.getLocation());
                activities.setLatitude(result.getLatitude());
                activities.setLongitude(result.getLongitude());
            }

            if (createActivitiesDTO.getDateExpire() != null) {
                activities.setDateExpire(createActivitiesDTO.getDateExpire().minusHours(3));
            }



            activitiesRepository.save(activities);

            if (activities.getFamily() != null) {
                sendNotificationForFamily(activities);
            } else {
                sendNotification(activities);
            }

            return convertActivitiesToReadDTO.execute(activities);
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }

    private void sendNotification(Activities activity) throws SystemContextException {
        String expoToken = getExpoToken.execute(activity.getUser().getEmail());
        String title = "Foi criada uma nova atividade";
        String message = "Atividade criada com o nome " + activity.getName() + " e status de " + activity.getStatus().getLabel();

        pushNotificationService.sendPushNotification(expoToken, title, message);
    }

    private void sendNotificationForFamily(Activities activity) throws SystemContextException {
        List<FamilyUserDTO> familyUsers = listMemberToFamily.execute(activity.getFamily().getId());
        System.out.println(familyUsers);
        for (FamilyUserDTO familyUser : familyUsers) {
            System.out.println(familyUser.getUserEmail());
            String expoToken = getExpoToken.execute(familyUser.getUserEmail());
            String title = "Foi criada uma nova atividade para o grupo " + activity.getFamily().getName();
            String message = "Atividade criada com o nome " + activity.getName() + " e status de " + activity.getStatus().getLabel();

            pushNotificationService.sendPushNotification(expoToken, title, message);
        }
    }
}