package com.joaogabgr.backend.web.dto.auth;

import com.joaogabgr.backend.core.domain.enums.UsersRoles;
import com.joaogabgr.backend.core.domain.models.User;
import com.joaogabgr.backend.web.dto.DTO;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegisterDTO implements DTO {
    private String name;
    private String email;
    private String cpf;
    private String password;
    private UsersRoles role;

    public Object toEntity(String encodedPassword) {
        return new User(name, email, cpf, encodedPassword, role);
    }

    @Override
    public Object toEntity() {
        return null;
    }

    @Override
    public boolean isValid() {
        return isNotNullOrEmpty(name) || isNotNullOrEmpty(cpf) || isNotNullOrEmpty(email) || isNotNullOrEmpty(password);
    }
}
