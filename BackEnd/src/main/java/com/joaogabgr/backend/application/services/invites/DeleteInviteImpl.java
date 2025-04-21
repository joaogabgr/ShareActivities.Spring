package com.joaogabgr.backend.application.services.invites;

import com.joaogabgr.backend.application.operations.families.FindInvite;
import com.joaogabgr.backend.core.useCase.families.DeleteInviteUseCase;
import com.joaogabgr.backend.infra.repositories.InviteRepository;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeleteInviteImpl implements DeleteInviteUseCase {
    @Autowired
    private InviteRepository inviteRepository;
    @Autowired
    private FindInvite findInvite;

    @Override
    public void execute(String inviteId) throws SystemContextException {
        try {
            findInvite.execute(inviteId);
            inviteRepository.deleteById(inviteId);
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
