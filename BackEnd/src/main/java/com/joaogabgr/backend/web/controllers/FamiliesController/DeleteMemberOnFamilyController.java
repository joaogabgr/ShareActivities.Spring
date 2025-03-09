package com.joaogabgr.backend.web.controllers.FamiliesController;

import com.joaogabgr.backend.application.services.families.DeleteMemberOnFamilyImpl;
import com.joaogabgr.backend.web.dto.web.ResponseModelDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/families")
public class DeleteMemberOnFamilyController {
    @Autowired
    private DeleteMemberOnFamilyImpl deleteMemberOnFamily;

    @DeleteMapping("/deleteMemberOnFamily/{familyId}/{userEmail}")
    public ResponseEntity<ResponseModelDTO> deleteMemberOnFamily(@PathVariable String familyId, @PathVariable String userEmail) throws SystemContextException {
        try {
            deleteMemberOnFamily.execute(familyId, userEmail);
            return ResponseEntity.ok(new ResponseModelDTO(true));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
