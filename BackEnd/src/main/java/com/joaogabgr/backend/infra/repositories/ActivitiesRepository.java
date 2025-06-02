package com.joaogabgr.backend.infra.repositories;

import com.joaogabgr.backend.core.domain.models.Activities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ActivitiesRepository extends JpaRepository<Activities, String> {

    @Query("SELECT a FROM Activities a WHERE a.user.email = :userEmail AND a.family IS NULL")
    List<Activities> findByUserEmailAndFamilyIsNull(@Param("userEmail") String userEmail);

    @Query("SELECT a FROM Activities a WHERE a.family.id = :familyId")
    List<Activities> findByFamilyId(@Param("familyId") String familyId);

    List<Activities> findAllByWarningTrue();

}