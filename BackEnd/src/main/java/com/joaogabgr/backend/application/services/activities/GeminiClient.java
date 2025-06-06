package com.joaogabgr.backend.application.services.activities;

import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class GeminiClient {

    private static final String API_KEY = "AIzaSyDfntFk_hUA6VZlc0UMDwlEx64J5S1a_tg";
    private static final String ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public String execute(String textoTranscrito) {
        try {
            String prompt = """
                Você receberá um texto em linguagem natural, como uma transcrição de voz. Seu objetivo é extrair o máximo de informações e preencher os campos da DTO abaixo com base nesse conteúdo.
                
                ⚠️ Instruções importantes:
                - Você deve **sempre tentar preencher os campos `type`, `name` e `description`**, mesmo que precise inferir a partir do texto.
                - Se o texto não contiver informações suficientes, **use valores padrão**:
                    - `type`: "outros"
                    - `name`: "Atividade sem nome"
                    - `description`: "Descrição não fornecida"
                - Se o texto não contiver informações sobre `dateCreated`, use a data atual.
                - As datas devem estar no formato americano: **MM/dd** ou **MM/dd/yyyy** (ex: "12/24" ou "12/24/2025").
                - Retorne **apenas um JSON válido** — **sem** explicações, **sem** comentários, **sem** blocos markdown (como ```json).
                
                Campos válidos:
                - name
                - description
                - status
                - priority
                - userId
                - familyId
                - type
                - dateCreated
                - dateExpire
                - daysForRecover
                - notes
                - location
                - linkUrl
                - photoUrl
                - documentUrl
                - photoName
                - documentName
                - warning
                
                Texto de origem:
                "%s"
                """.formatted(textoTranscrito);

            String requestBody = """
                {
                  "contents": [
                    {
                      "parts": [
                        { "text": %s }
                      ]
                    }
                  ]
                }
            """.formatted(objectToJson(prompt));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(ENDPOINT))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return extractJsonFromGeminiResponse(response.body());
            } else {
                System.err.println("Erro da API Gemini: " + response.statusCode() + " - " + response.body());
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Extrai apenas o JSON do corpo da resposta do Gemini
    private String extractJsonFromGeminiResponse(String responseBody) {
        int jsonStart = responseBody.indexOf("{");
        int jsonEnd = responseBody.lastIndexOf("}");
        if (jsonStart != -1 && jsonEnd != -1 && jsonEnd > jsonStart) {
            return responseBody.substring(jsonStart, jsonEnd + 1);
        }
        return null;
    }

    // Escapa aspas e quebra de linha
    private String objectToJson(String str) {
        return "\"" + str.replace("\"", "\\\"").replace("\n", "\\n") + "\"";
    }
}
