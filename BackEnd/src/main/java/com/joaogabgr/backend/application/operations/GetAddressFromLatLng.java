package com.joaogabgr.backend.application.operations;

import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Component
public class GetAddressFromLatLng {

    private static final String BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

    @Value("${google.maps.api.key}")
    private String apiKey;
    
    public String execute(Double latitude, Double longitude) throws SystemContextException {
        String url = UriComponentsBuilder.fromUriString(BASE_URL)
                .queryParam("latlng", latitude + "," + longitude)
                .queryParam("key", apiKey)
                .toUriString();

        RestTemplate restTemplate = new RestTemplate();

        try {
            Map response = restTemplate.getForObject(url, Map.class);

            if (response != null && "OK".equals(response.get("status"))) {
                // 'results' é uma lista, então precisamos acessar o primeiro elemento
                java.util.List results = (java.util.List) response.get("results");
                if (results != null && !results.isEmpty()) {
                    Map firstResult = (Map) results.get(0);
                    String formattedAddress = (String) firstResult.get("formatted_address");
                    return formattedAddress;
                } else {
                    throw new SystemContextException("Nenhum resultado encontrado para as coordenadas fornecidas.");
                }
            } else {
                throw new SystemContextException("Nenhum endereço encontrado para as coordenadas fornecidas.");
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new SystemContextException("Erro ao obter o endereço");
        }
    }
}