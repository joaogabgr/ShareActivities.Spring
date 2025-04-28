package com.joaogabgr.backend.application.operations.activities;

import com.joaogabgr.backend.application.operations.Notifications.GetExpoToken;
import com.joaogabgr.backend.application.operations.Notifications.PushNotificationService;
import com.joaogabgr.backend.application.services.families.ListMemberToFamily;
import com.joaogabgr.backend.core.domain.models.Activities;
import com.joaogabgr.backend.infra.repositories.ActivitiesRepository;
import com.joaogabgr.backend.web.dto.families.FamilyUserDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class CheckActivitiesNearbyExpire {

    private static final String TITLE_EXPIRED = "A atividade expirou!";
    private static final String TITLE_NEAR_EXPIRATION = "A atividade está próxima do vencimento!";

    @Autowired
    private ActivitiesRepository activitiesRepository;

    @Autowired
    private GetExpoToken getExpoToken;

    @Autowired
    private PushNotificationService pushNotificationService;

    @Autowired
    private ListMemberToFamily listMemberToFamily;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy 'às' HH:mm");

    @Scheduled(cron = "0 0 0  * * *", zone = "America/Sao_Paulo")
    public void execute() {
        System.out.println("Iniciando verificação de atividades...");

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime twoDaysAhead = now.plusDays(2);

        activitiesRepository.findAll().forEach(activity -> {
            System.out.println(activity.getDateExpire());
            if (activity.getDateExpire() == null) return;
            LocalDateTime expireDateTime = activity.getDateExpire();

            try {
                if (expireDateTime.isBefore(now)) {
                    String message = buildMessage(activity, 0, true);
                    if (activity.getFamily() != null) {
                        sendNotificationForFamily(activity, TITLE_EXPIRED, message);
                    } else {
                        sendNotification(activity, TITLE_EXPIRED, message);
                    }
                } else if (!expireDateTime.isAfter(twoDaysAhead)) {
                    long daysUntilExpiration = ChronoUnit.DAYS.between(now.toLocalDate(), expireDateTime.toLocalDate());
                    String message = buildMessage(activity, daysUntilExpiration, false);
                    if (activity.getFamily() != null) {
                        sendNotificationForFamily(activity, TITLE_NEAR_EXPIRATION, message);
                    } else {
                        sendNotification(activity, TITLE_NEAR_EXPIRATION, message);
                    }
                }
            } catch (SystemContextException e) {
                e.printStackTrace();
            }
        });
    }

    private void sendNotification(Activities activity, String title, String message) throws SystemContextException {
        String expoToken = getExpoToken.execute(activity.getUser().getEmail());
        pushNotificationService.sendPushNotification(expoToken, title, message);
    }

    private void sendNotificationForFamily(Activities activity, String title, String message) throws SystemContextException {
        List<FamilyUserDTO> familyUsers = listMemberToFamily.execute(activity.getFamily().getId());
        for (FamilyUserDTO familyUser : familyUsers) {
            String expoToken = getExpoToken.execute(familyUser.getUserEmail());
            pushNotificationService.sendPushNotification(expoToken, title, message);
        }
    }

    private String buildMessage(Activities activity, long days, boolean expired) {
        String expireDateFormatted = activity.getDateExpire().format(formatter);
        String base;

        if (activity.getFamily() != null) {
            base = "A atividade \"" + activity.getName() + "\" do grupo \"" + activity.getFamily().getName() + "\" ";
        } else {
            base = "A atividade \"" + activity.getName() + "\" ";
        }

        if (expired) {
            return base + "expirou em " + expireDateFormatted + ".";
        } else if (days == 0) {
            return base + "expira hoje, " + expireDateFormatted + "!";
        } else if (days == 1) {
            return base + "expira em 1 dia, no dia " + expireDateFormatted + ".";
        } else {
            return base + "expira em " + days + " dias, no dia " + expireDateFormatted + ".";
        }
    }
}
