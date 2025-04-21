package com.joaogabgr.backend.application.operations.families;

import com.joaogabgr.backend.core.domain.models.Invites;
import com.joaogabgr.backend.infra.repositories.InviteRepository;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FindInvite {
    @Autowired
    private InviteRepository inviteRepository;

    public Invites execute(String inviteId) throws SystemContextException {
        return inviteRepository.findById(inviteId).orElseThrow(
            () -> new SystemContextException("Convite não encontrado"));
    }
}
