package com.joaogabgr.backend.web.dto.user;

import com.joaogabgr.backend.core.domain.enums.UsersRoles;
import com.joaogabgr.backend.core.domain.models.User;
import com.joaogabgr.backend.web.dto.DTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO implements DTO {
    private String name;
    private String email;
    private String cpf;
    private UsersRoles role;


    public User toEntity() {
        return null;
    }

    @Override
    public boolean isValid() {
        return isNotNullOrEmpty(name) && isNotNullOrEmpty(email) && role != null;
    }
}
