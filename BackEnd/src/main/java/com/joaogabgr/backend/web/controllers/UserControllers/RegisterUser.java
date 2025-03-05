package com.joaogabgr.backend.web.controllers.UserControllers;

import com.joaogabgr.backend.application.services.auth.RegisterImpl;
import com.joaogabgr.backend.core.domain.enums.UsersRoles;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import com.joaogabgr.backend.web.dto.auth.RegisterDTO;
import com.joaogabgr.backend.web.dto.web.ResponseModelDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class RegisterUser {

    @Autowired
    private RegisterImpl registerImpl;

    @PostMapping("/register")
    public ResponseEntity<ResponseModelDTO> register(@RequestBody RegisterDTO registerDTO) throws SystemContextException {
        try {
            registerDTO.setRole(UsersRoles.valueOf("USER"));
            return ResponseEntity.ok(new ResponseModelDTO(registerImpl.register(registerDTO)));
        } catch (SystemContextException e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
