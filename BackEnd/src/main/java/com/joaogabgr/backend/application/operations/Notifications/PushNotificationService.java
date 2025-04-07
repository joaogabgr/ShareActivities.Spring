package com.joaogabgr.backend.application.operations.Notifications;

import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class PushNotificationService {

    private final RestTemplate restTemplate;

    public PushNotificationService() {
        this.restTemplate = new RestTemplate();
    }

    public void sendPushNotification(String expoPushToken, String title, String body) {
        String url = "https://exp.host/--/api/v2/push/send";

        // Monta o corpo da requisição
        Map<String, Object> message = new HashMap<>();
        message.put("to", expoPushToken);
        message.put("sound", "default");
        message.put("title", title);
        message.put("body", body);
        message.put("data", Map.of("extra", "informação opcional"));

        // Configura os headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.set("Accept-Encoding", "gzip, deflate");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(message, headers);

        // Envia a requisição
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        System.out.println("Resposta da API Expo: " + response.getBody());
    }
}
