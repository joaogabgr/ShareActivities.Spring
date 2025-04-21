package com.joaogabgr.backend.infra.config;

import com.joaogabgr.backend.application.services.Chat.ChatSendMessageImpl;
import com.joaogabgr.backend.infra.webSocket.ChatWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final ChatSendMessageImpl chatSendMessageImpl;

    public WebSocketConfig(ChatSendMessageImpl chatSendMessageImpl) {
        this.chatSendMessageImpl = chatSendMessageImpl;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new ChatWebSocketHandler(chatSendMessageImpl), "/ws/chat")
                .setAllowedOrigins("*");
    }
}