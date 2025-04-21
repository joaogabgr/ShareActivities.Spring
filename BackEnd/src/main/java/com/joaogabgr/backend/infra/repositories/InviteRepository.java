package com.joaogabgr.backend.infra.repositories;

import com.joaogabgr.backend.core.domain.models.Invites;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InviteRepository extends JpaRepository<Invites, String> {
    List<Invites> findAllByFamilyId(String familyId);
    List<Invites> findAllByInvitedUserEmail(String userEmail);

}
