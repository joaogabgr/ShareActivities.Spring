package com.joaogabgr.backend.infra.repositories;

import com.joaogabgr.backend.core.domain.models.FamiliesUsers;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FamiliesUsersRepository extends JpaRepository<FamiliesUsers, String> {
    boolean existsByUserEmail(String userEmail);
    FamiliesUsers findByUserEmail(String userEmail);
    List<FamiliesUsers> findFamiliesByUserEmail(String userEmail);
}
