package com.joaogabgr.backend.application.services.invites;

import com.joaogabgr.backend.core.domain.models.Invites;
import com.joaogabgr.backend.infra.repositories.InviteRepository;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListInviteUserImpl {
    @Autowired
    private InviteRepository inviteRepository;

    public List<Invites> execute(String userEmail) throws SystemContextException {

        return inviteRepository.findAllByInvitedUserEmail(userEmail);
    }
}
