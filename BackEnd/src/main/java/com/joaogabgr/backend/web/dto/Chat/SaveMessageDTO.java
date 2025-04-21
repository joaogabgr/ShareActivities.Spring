package com.joaogabgr.backend.web.dto.Chat;

import com.joaogabgr.backend.core.domain.models.Chat;
import com.joaogabgr.backend.web.dto.DTO;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SaveMessageDTO implements DTO {
    private String senderId;
    private String senderName;
    private String roomId;
    private String content;

    @Override
    public Chat toEntity() {
        Chat chat = new Chat();
        chat.setContent(content);
        chat.setCreatedAt(LocalDateTime.now());
        return chat;
    }

    @Override
    public boolean isValid() {
        return isNotNullOrEmpty(senderId) || isNotNullOrEmpty(roomId) || isNotNullOrEmpty(content);
    }
}
