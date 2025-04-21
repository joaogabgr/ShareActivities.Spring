package com.joaogabgr.backend.web.controllers.FamiliesController;

import com.joaogabgr.backend.application.services.families.DeleteFamilyImpl;
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
    @Autowired
    private DeleteFamilyImpl deleteFamily;

    @DeleteMapping("/deleteMemberOnFamily/{familyId}/{userEmail}/{userDeleted}")
    public ResponseEntity<ResponseModelDTO> deleteMemberOnFamily(@PathVariable String familyId,
                                                                 @PathVariable String userEmail,
                                                                 @PathVariable String userDeleted) throws SystemContextException {
        try {
            deleteMemberOnFamily.execute(familyId, userEmail, userDeleted);
            return ResponseEntity.ok(new ResponseModelDTO(true));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{familyId}")
    public ResponseEntity<ResponseModelDTO> deleteFamily(@PathVariable String familyId) throws SystemContextException {
        try {
            deleteFamily.execute(familyId);
            return ResponseEntity.ok(new ResponseModelDTO(true));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
