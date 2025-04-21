package com.joaogabgr.backend.infra.webSocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.joaogabgr.backend.application.services.Chat.ChatSendMessageImpl;
import com.joaogabgr.backend.web.dto.Chat.SaveMessageDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper mapper = new ObjectMapper();
    private final ChatSendMessageImpl chatSendMessageImpl;

    private final ConcurrentHashMap<String, Set<WebSocketSession>> roomSessions = new ConcurrentHashMap<>();

    public ChatWebSocketHandler(ChatSendMessageImpl chatSendMessageImpl) {
        this.chatSendMessageImpl = chatSendMessageImpl;
    }

    private String getParam(WebSocketSession session, String paramName) {
        String query = Objects.requireNonNull(session.getUri()).getQuery();
        if (query == null) return null;

        for (String param : query.split("&")) {
            String[] keyValue = param.split("=");
            if (keyValue.length == 2 && keyValue[0].equals(paramName)) {
                return keyValue[1];
            }
        }
        return null;
    }


    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String roomId = getParam(session, "roomId");
        if (roomId != null) {
            roomSessions.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(session);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            SaveMessageDTO dto = mapper.readValue(message.getPayload(), SaveMessageDTO.class);
            chatSendMessageImpl.execute(dto);

            String roomId = dto.getRoomId();
            Set<WebSocketSession> roomUsers = roomSessions.get(roomId);

            // monta resposta com mais dados estruturados
            Map<String, Object> response = new HashMap<>();
            response.put("type", "NEW_MESSAGE");
            response.put("content", dto.getContent());
            response.put("senderId", dto.getSenderId());
            response.put("roomId", dto.getRoomId());
            response.put("senderName", dto.getSenderName());
            response.put("createdAt", LocalDateTime.now().toString());

            String responseJson = mapper.writeValueAsString(response);

            if (roomUsers != null) {
                for (WebSocketSession s : roomUsers) {
                    if (s.isOpen()) {
                        s.sendMessage(new TextMessage(responseJson));
                    }
                }
            }

        } catch (SystemContextException e) {
            session.sendMessage(new TextMessage("{\"type\":\"ERROR\",\"message\":\"" + e.getMessage() + "\"}"));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        roomSessions.forEach((roomId, sessions) -> {
            sessions.removeIf(s -> s.getId().equals(session.getId()));
            if (sessions.isEmpty()) {
                roomSessions.remove(roomId);
            }
        });
    }
}
