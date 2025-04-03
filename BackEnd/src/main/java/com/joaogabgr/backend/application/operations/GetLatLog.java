package com.joaogabgr.backend.application.operations;

import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;

@Component
public class GetLatLog {

    private static final String BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

    @Value("${google.maps.api.key}")
    private String apiKey;

    public static class LatLngResult {
        private final Double latitude;
        private final Double longitude;
        private final String formattedAddress;

        public LatLngResult(Double latitude, Double longitude, String formattedAddress) {
            this.latitude = latitude;
            this.longitude = longitude;
            this.formattedAddress = formattedAddress;
        }

        public Double getLatitude() {
            return latitude;
        }

        public Double getLongitude() {
            return longitude;
        }

        public String getFormattedAddress() {
            return formattedAddress;
        }
    }

    public LatLngResult execute(String address) throws SystemContextException {
        try {
            URI uri = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                    .queryParam("address", address)
                    .queryParam("key", apiKey)
                    .build()
                    .encode()
                    .toUri();

            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> response = restTemplate.getForObject(uri, Map.class);

            if (response != null && "OK".equals(response.get("status"))) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");

                if (results != null && !results.isEmpty()) {
                    Map<String, Object> firstResult = results.get(0);
                    Map<String, Object> geometry = (Map<String, Object>) firstResult.get("geometry");
                    Map<String, Object> location = (Map<String, Object>) geometry.get("location");

                    Double lat = ((Number) location.get("lat")).doubleValue();
                    Double lng = ((Number) location.get("lng")).doubleValue();
                    String formattedAddress = (String) firstResult.get("formatted_address");

                    return new LatLngResult(lat, lng, formattedAddress);
                }
            }
            throw new SystemContextException("Nenhuma coordenada encontrada para o endereço fornecido.");
        } catch (Exception e) {
            e.printStackTrace();
            throw new SystemContextException("Erro ao obter a localização: " + e.getMessage());
        }
    }
}
