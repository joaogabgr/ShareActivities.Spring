package com.joaogabgr.backend.web.dto.activities;

import com.joaogabgr.backend.web.dto.DTO;
import lombok.Data;

@Data
public class ConfirmGroupDoneDTO implements DTO {
    private String id;
    private String userEmail;

    @Override
    public Object toEntity() { return null; }
    @Override
    public boolean isValid() { return id != null && !id.isEmpty() && userEmail != null && !userEmail.isEmpty(); }
}
