package com.joaogabgr.backend.web.dto.auth;

import com.joaogabgr.backend.web.dto.DTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AuthenticationDTO implements DTO {
    public String email;
    public String password;

    @Override
    public Object toEntity() {
        return null;
    }

    @Override
    public boolean isValid() {
        return isNotNullOrEmpty(email) || isNotNullOrEmpty(password);
    }
}

