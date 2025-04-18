package com.joaogabgr.backend.application.services.families;

import com.joaogabgr.backend.core.domain.models.FamiliesUsers;
import com.joaogabgr.backend.infra.repositories.FamiliesUsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListFamiliesImpl {

    @Autowired
    private FamiliesUsersRepository familiesRepository;

    public List<FamiliesUsers> execute(String userEmail) {
        return familiesRepository.findFamiliesByUserEmail(userEmail);
    }
}
