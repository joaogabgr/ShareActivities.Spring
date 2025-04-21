package com.joaogabgr.backend.application.services.invites;

import com.joaogabgr.backend.application.operations.Notifications.GetExpoToken;
import com.joaogabgr.backend.application.operations.Notifications.PushNotificationService;
import com.joaogabgr.backend.application.operations.families.FindFamily;
import com.joaogabgr.backend.application.operations.user.FindUser;
import com.joaogabgr.backend.application.services.user.CheckUserHaveFamilyImpl;
import com.joaogabgr.backend.core.domain.models.Activities;
import com.joaogabgr.backend.core.domain.models.Families;
import com.joaogabgr.backend.core.domain.models.Invites;
import com.joaogabgr.backend.core.domain.models.User;
import com.joaogabgr.backend.core.useCase.families.InviteMemberToFamilyUseCase;
import com.joaogabgr.backend.infra.repositories.InviteRepository;
import com.joaogabgr.backend.web.dto.families.InviteMemberToFamilyDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InviteMemberToFamilyimpl implements InviteMemberToFamilyUseCase {
    @Autowired
    private InviteRepository inviteRepository;
    @Autowired
    private FindUser findUser;
    @Autowired
    private FindFamily findFamily;
    @Autowired
    private CheckUserHaveFamilyImpl CheckUserHaveFamilyImpl;
    @Autowired
    private GetExpoToken getExpoToken;
    @Autowired
    private PushNotificationService pushNotificationService;

    @Override
    public Invites execute(InviteMemberToFamilyDTO inviteMemberToFamilyDTO) throws SystemContextException {
        try {
            User invitedUser = findUser.execute(inviteMemberToFamilyDTO.getInvitedEmail());

            User user = findUser.execute(inviteMemberToFamilyDTO.getUserEmail());

            Families families = findFamily.execute(inviteMemberToFamilyDTO.getFamilyId());

            Invites invite = new Invites();
            invite.setInvitedUser(invitedUser);
            invite.setUser(user);
            invite.setFamily(families);

            inviteRepository.save(invite);
            sendNotification(invite);

            return invite;
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }

    private void sendNotification(Invites invites) throws SystemContextException {
        String expoToken = getExpoToken.execute(invites.getInvitedUser().getEmail());
        String title = "Convite de grupo recebido";
        String message = "Você foi convidado para o grupo " + invites.getFamily().getName() + " por " + invites.getUser().getName();

        pushNotificationService.sendPushNotification(expoToken, title, message);
    }
}
