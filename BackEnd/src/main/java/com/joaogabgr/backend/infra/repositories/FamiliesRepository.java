package com.joaogabgr.backend.infra.repositories;

import com.joaogabgr.backend.core.domain.models.Families;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FamiliesRepository extends JpaRepository<Families, String> {
}
