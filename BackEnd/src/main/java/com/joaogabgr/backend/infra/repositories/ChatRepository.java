package com.joaogabgr.backend.infra.repositories;

import com.joaogabgr.backend.core.domain.models.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, String> {
    List<Chat> findAllByRoomId_Id(String roomId);

}
