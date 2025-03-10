package com.joaogabgr.backend.web.controllers.FamiliesController;

import com.joaogabgr.backend.application.services.user.CheckUserHaveFamilyImpl;
import com.joaogabgr.backend.web.dto.web.ResponseModelDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/families")
public class CheckUserHaveFamily {

    @Autowired
    private CheckUserHaveFamilyImpl checkUserHaveFamilyImpl;

    @GetMapping("/checkUserHaveFamily/{userEmail}")
    public ResponseEntity<ResponseModelDTO> checkUserHaveFamily(@PathVariable String userEmail) throws SystemContextException {
        try {
            return ResponseEntity.ok(new ResponseModelDTO(checkUserHaveFamilyImpl.execute(userEmail)));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
