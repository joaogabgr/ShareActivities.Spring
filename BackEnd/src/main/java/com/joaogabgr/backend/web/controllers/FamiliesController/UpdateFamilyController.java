package com.joaogabgr.backend.web.controllers.FamiliesController;

import com.joaogabgr.backend.application.services.families.UpdateFamilyImpl;
import com.joaogabgr.backend.web.dto.families.UpdateFamilyDTO;
import com.joaogabgr.backend.web.dto.web.ResponseModelDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/families")
public class UpdateFamilyController {
    @Autowired
    private UpdateFamilyImpl updateFamily;

    @PutMapping("/update")
    public ResponseEntity<ResponseModelDTO> updateFamily(@RequestBody UpdateFamilyDTO updateFamilyDTO) throws SystemContextException {
        try {
            return ResponseEntity.ok(new ResponseModelDTO(updateFamily.execute(updateFamilyDTO)));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
} 