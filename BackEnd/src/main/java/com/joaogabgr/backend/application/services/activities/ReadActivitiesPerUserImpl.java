package com.joaogabgr.backend.application.services.activities;

import com.joaogabgr.backend.application.operations.activities.ConvertActivitiesToReadDTO;
import com.joaogabgr.backend.core.useCase.activities.ReadActivitiesPerUserUseCase;
import com.joaogabgr.backend.infra.repositories.ActivitiesRepository;
import com.joaogabgr.backend.web.dto.activities.ReadActivitiesDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReadActivitiesPerUserImpl implements ReadActivitiesPerUserUseCase {

    @Autowired
    private ActivitiesRepository activitiesRepository;

    @Autowired
    private ConvertActivitiesToReadDTO convertActivitiesToReadDTO;

    @Override
    public List<ReadActivitiesDTO> execute(String userEmail) throws SystemContextException {
        try {
            System.out.println("Reading activities for user with ID: " + userEmail);
            return activitiesRepository.findByUserEmail(userEmail).stream()
                    .map(convertActivitiesToReadDTO::execute)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new SystemContextException("Error reading activities for user with ID: " + userEmail + ", " + e.getMessage());
        }
    }
}
