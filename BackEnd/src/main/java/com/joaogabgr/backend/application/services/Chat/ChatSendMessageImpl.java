package com.joaogabgr.backend.application.services.Chat;

import com.joaogabgr.backend.application.operations.Notifications.GetExpoToken;
import com.joaogabgr.backend.application.operations.Notifications.PushNotificationService;
import com.joaogabgr.backend.application.operations.families.FindFamily;
import com.joaogabgr.backend.application.operations.user.FindUser;
import com.joaogabgr.backend.application.services.families.ListMemberToFamily;
import com.joaogabgr.backend.core.domain.models.Activities;
import com.joaogabgr.backend.core.domain.models.Chat;
import com.joaogabgr.backend.core.domain.models.Families;
import com.joaogabgr.backend.core.domain.models.User;
import com.joaogabgr.backend.infra.repositories.ChatRepository;
import com.joaogabgr.backend.infra.repositories.UserRepository;
import com.joaogabgr.backend.web.dto.Chat.SaveMessageDTO;
import com.joaogabgr.backend.web.dto.families.FamilyUserDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatSendMessageImpl {

    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private FindUser findUser;
    @Autowired
    private FindFamily findFamily;
    @Autowired
    private ListMemberToFamily listMemberToFamily;
    @Autowired
    private GetExpoToken getExpoToken;
    @Autowired
    private PushNotificationService pushNotificationService;

    public void execute(SaveMessageDTO saveMessageDTO) throws SystemContextException {

        if(saveMessageDTO.isValid()) {
            throw new SystemContextException("Data invalida");
        }

        Chat chat = saveMessageDTO.toEntity();

        User user = findUser.executeWithEmail(saveMessageDTO.getSenderId());
        chat.setSender(user);

        Families families = findFamily.execute(saveMessageDTO.getRoomId());
        chat.setRoomId(families);

        sendNotificationForFamily(chat);
        chatRepository.save(chat);
    }

    private void sendNotificationForFamily(Chat chat) throws SystemContextException {
        List<FamilyUserDTO> familyUsers = listMemberToFamily.execute(chat.getRoomId().getId());
        for (FamilyUserDTO familyUser : familyUsers) {
            String expoToken = getExpoToken.execute(familyUser.getUserEmail());
            String title = "Mensagem de " + chat.getSender().getName() + " na sala " + chat.getRoomId().getName();
            String message = "Nova mensagem: " + chat.getContent();

            pushNotificationService.sendPushNotification(expoToken, title, message);
        }
    }
}
