package com.joaogabgr.backend.web.controllers.FamiliesController;

import com.joaogabgr.backend.application.services.families.CreateFamiliesImpl;
import com.joaogabgr.backend.web.dto.families.CreateFamiliesDTO;
import com.joaogabgr.backend.web.dto.web.ResponseModelDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/families")
public class CreateFamiliesController {
    @Autowired
    private CreateFamiliesImpl createFamiliesImpl;

    @PostMapping("/create")
    public ResponseEntity<ResponseModelDTO> createFamilies(@RequestBody CreateFamiliesDTO createFamiliesDTO) throws SystemContextException {
        try {
            return ResponseEntity.ok(new ResponseModelDTO(createFamiliesImpl.execute(createFamiliesDTO)));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
