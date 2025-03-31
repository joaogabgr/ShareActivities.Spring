package com.joaogabgr.backend.application.operations.activities;

import com.joaogabgr.backend.core.domain.enums.ActivitiesStatus;
import com.joaogabgr.backend.core.domain.models.Activities;
import com.joaogabgr.backend.infra.repositories.ActivitiesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Component
public class CheckActivitiesDaysForRecover {
    @Autowired
    private ActivitiesRepository activitiesRepository;

    @Scheduled(cron = "0 0 0 * * *", zone = "America/Sao_Paulo")
    public void execute() {
        System.out.println("Iniciando verificação de atividades...");

        activitiesRepository.findAll().forEach(activities -> {
            if (activities.getDayForRecover() != null && activities.getDayForRecover().toLocalDate().isEqual(LocalDate.now())) {
                Activities newActivities = createActivities(activities);
                activities.setDayForRecover(null);
                activitiesRepository.save(newActivities);
                activitiesRepository.save(activities);
            }
        });
    }

    private Activities createActivities(Activities activities) {
        Activities newActivities = new Activities();
        newActivities.setName(activities.getName());
        newActivities.setDescription(activities.getDescription());
        newActivities.setStatus(activities.getStatus());
        newActivities.setDateCreated(LocalDateTime.now());
        newActivities.setType(activities.getType());
        newActivities.setPriority(activities.getPriority());
        newActivities.setUser(activities.getUser());
        newActivities.setFamily(activities.getFamily());

        if (activities.getDayForRecover() != null) {
            LocalDate createdDateWithoutTime = activities.getDateCreated().toLocalDate();
            LocalDate expireDateWithoutTime = activities.getDayForRecover().toLocalDate();

            long daysBetween = ChronoUnit.DAYS.between(createdDateWithoutTime, expireDateWithoutTime);
            newActivities.setDayForRecover(LocalDate.now().plusDays(daysBetween).atStartOfDay());
        }

        if (activities.getDateCreated() != null && activities.getDateExpire() != null) {
            LocalDate createdDate = activities.getDateCreated().toLocalDate();
            LocalDate expireDate = activities.getDateExpire().toLocalDate();

            long daysBetween = ChronoUnit.DAYS.between(createdDate, expireDate);

            newActivities.setDateExpire(LocalDateTime.now().plusDays(daysBetween-1));
        }

        return newActivities;
    }
}
