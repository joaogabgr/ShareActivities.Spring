package com.joaogabgr.backend.infra.repositories;

import com.joaogabgr.backend.core.domain.models.Activities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ActivitiesRepository extends JpaRepository<Activities, String> {

    @Query("SELECT a FROM Activities a WHERE a.user.email = :userEmail")
    List<Activities> findByUserEmail(@Param("userEmail") String userEmail);
}