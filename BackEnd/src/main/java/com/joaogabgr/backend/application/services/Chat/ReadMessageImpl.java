package com.joaogabgr.backend.application.services.Chat;

import com.joaogabgr.backend.core.domain.models.Chat;
import com.joaogabgr.backend.infra.repositories.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReadMessageImpl {

    @Autowired
    private ChatRepository chatRepository;

    public List<Chat> execute(String roomId) {
        return chatRepository.findAllByRoomId_Id(roomId);
    }
}
