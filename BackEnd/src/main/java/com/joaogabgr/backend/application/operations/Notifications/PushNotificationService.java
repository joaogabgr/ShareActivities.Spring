package com.joaogabgr.backend.application.operations.Notifications;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PushNotificationService {

    private final RestTemplate restTemplate;

    public PushNotificationService() {
        this.restTemplate = new RestTemplate();
    }

    public void sendPushNotification(String expoPushToken, String title, String body) {
        if (expoPushToken == null || !expoPushToken.startsWith("ExponentPushToken")) {
            System.err.println("❌ Token inválido ou nulo: " + expoPushToken);
            return;
        }

        String url = "https://exp.host/--/api/v2/push/send";

        Map<String, Object> message = new HashMap<>();
        message.put("to", expoPushToken);
        message.put("sound", "default");
        message.put("title", title);
        message.put("body", body);
        message.put("data", Map.of("extra", "informação opcional"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.set("Accept-Encoding", "gzip, deflate");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(message, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
        } catch (Exception e) {
            System.err.println("❌ Erro ao enviar notificação: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
