package com.joaogabgr.backend.infra.repositories;

import com.joaogabgr.backend.core.domain.models.Invites;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InviteRepository extends JpaRepository<Invites, String> {
}
