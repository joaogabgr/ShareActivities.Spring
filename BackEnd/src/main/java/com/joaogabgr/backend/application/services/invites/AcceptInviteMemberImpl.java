package com.joaogabgr.backend.application.services.invites;

import com.joaogabgr.backend.application.operations.families.FindFamily;
import com.joaogabgr.backend.application.operations.families.FindInvite;
import com.joaogabgr.backend.application.operations.user.FindUser;
import com.joaogabgr.backend.application.services.families.AddMemberOnFamilyImpl;
import com.joaogabgr.backend.application.services.user.CheckUserHaveFamilyImpl;
import com.joaogabgr.backend.core.domain.models.Invites;
import com.joaogabgr.backend.core.useCase.families.AcceptInviteMemberUseCase;
import com.joaogabgr.backend.infra.repositories.InviteRepository;
import com.joaogabgr.backend.web.dto.families.AddMemberOnFamilyDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AcceptInviteMemberImpl implements AcceptInviteMemberUseCase {
    @Autowired
    private InviteRepository inviteRepository;
    @Autowired
    private AddMemberOnFamilyImpl addMemberOnFamily;
    @Autowired
    private FindInvite findInvite;
    @Autowired
    private FindFamily findFamily;
    @Autowired
    private FindUser findUser;

    @Override
    public void execute(String inviteId) throws SystemContextException {
        try {
            Invites invite = findInvite.execute(inviteId);

            findUser.execute(invite.getInvitedUser().getEmail());
            findFamily.execute(invite.getFamily().getId());

            addMemberDTOToEntity(invite);
            inviteRepository.delete(invite);
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }

    private void addMemberDTOToEntity(Invites invite) throws SystemContextException {
        AddMemberOnFamilyDTO addMemberOnFamilyDTO = new AddMemberOnFamilyDTO();
        addMemberOnFamilyDTO.setUserEmail(invite.getInvitedUser().getEmail());
        addMemberOnFamilyDTO.setFamilyId(invite.getFamily().getId());
        addMemberOnFamilyDTO.setAdmin(false);
        addMemberOnFamily.execute(addMemberOnFamilyDTO);
    }
}
