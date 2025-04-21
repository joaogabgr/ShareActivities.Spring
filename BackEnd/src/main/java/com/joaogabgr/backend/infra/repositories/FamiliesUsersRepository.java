package com.joaogabgr.backend.infra.repositories;

import com.joaogabgr.backend.core.domain.models.FamiliesUsers;
import com.joaogabgr.backend.core.domain.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FamiliesUsersRepository extends JpaRepository<FamiliesUsers, String> {
    boolean existsByUserEmail(String userEmail);
    FamiliesUsers findByUserEmailAndFamilyId(String user_email, String family_id);
    boolean existsByUserEmailAndFamilyId(String userEmail, String familyId);
    List<FamiliesUsers> findFamiliesByUserEmail(String userEmail);

    List<FamiliesUsers> findAllUsersByFamilyId(String familyId);

}
