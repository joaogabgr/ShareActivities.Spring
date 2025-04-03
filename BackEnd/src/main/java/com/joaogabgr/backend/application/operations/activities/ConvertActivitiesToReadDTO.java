package com.joaogabgr.backend.application.operations.activities;

import com.joaogabgr.backend.application.operations.GetAddressFromLatLng;
import com.joaogabgr.backend.core.domain.models.Activities;
import com.joaogabgr.backend.web.dto.activities.ReadActivitiesDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ConvertActivitiesToReadDTO {
    
    @Autowired
    private GetAddressFromLatLng getAddressFromLatLng;
    public ReadActivitiesDTO execute(Activities activities) {
        ReadActivitiesDTO readActivitiesDTO = new ReadActivitiesDTO();
        readActivitiesDTO.setId(activities.getId());
        readActivitiesDTO.setName(activities.getName());
        readActivitiesDTO.setDescription(activities.getDescription());
        readActivitiesDTO.setStatus(String.valueOf(activities.getStatus()));
        readActivitiesDTO.setUserName(activities.getUser().getName());
        readActivitiesDTO.setDate(activities.getDateCreated().toString());
        readActivitiesDTO.setPriority(String.valueOf(activities.getPriority()));
        readActivitiesDTO.setNotes(activities.getNotes());
        
        // Converter latitude e longitude para String no formato "lat,lng" e obter endereço
        if (activities.getLatitude() != null && activities.getLongitude() != null) {
            readActivitiesDTO.setLatLog(activities.getLatitude() + "," + activities.getLongitude());

            // Obter endereço a partir das coordenadas
            try {
                String address = getAddressFromLatLng.execute(activities.getLatitude(), activities.getLongitude());
                readActivitiesDTO.setLocation(address);
            } catch (SystemContextException e) {
                // Em caso de erro, não definimos o endereço
                System.out.println("Erro ao obter endereço: " + e.getMessage());
            }
        }
        if (activities.getFamily() != null) {
            readActivitiesDTO.setFamilyName(activities.getFamily().getName());
        }
        readActivitiesDTO.setType(activities.getType());
        if (activities.getDateExpire() != null) {
            readActivitiesDTO.setDateExpire(activities.getDateExpire().toString());
        }
        if (activities.getDayForRecover() != null) {
            readActivitiesDTO.setDayForRecover(activities.getDayForRecover().toString());
        }
        return readActivitiesDTO;
    }
}