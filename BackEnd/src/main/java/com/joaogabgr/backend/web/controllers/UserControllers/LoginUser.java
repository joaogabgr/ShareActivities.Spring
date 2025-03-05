package com.joaogabgr.backend.web.controllers.UserControllers;

import com.joaogabgr.backend.application.services.auth.LoginImpl;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import com.joaogabgr.backend.web.dto.auth.AuthenticationDTO;
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
public class LoginUser {

    @Autowired
    private LoginImpl loginImpl;

    @PostMapping("/login")
    public ResponseEntity<ResponseModelDTO> login(@RequestBody AuthenticationDTO authenticationDTO) throws SystemContextException {
        try {
            return ResponseEntity.ok(new ResponseModelDTO(loginImpl.login(authenticationDTO)));
        } catch (SystemContextException e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
