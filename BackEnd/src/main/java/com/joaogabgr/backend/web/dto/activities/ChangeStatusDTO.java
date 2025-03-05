package com.joaogabgr.backend.web.dto.activities;

import com.joaogabgr.backend.web.dto.DTO;
import lombok.Data;

@Data
public class ChangeStatusDTO implements DTO {
    private String id;
    private String status;
    
    @Override
    public Object toEntity() {
        return null;
    }

    @Override
    public boolean isValid() {
        return isNotNullOrEmpty(id) || isNotNullOrEmpty(status);
    }
}
