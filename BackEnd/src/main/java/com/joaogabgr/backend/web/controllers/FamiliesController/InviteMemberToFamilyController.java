package com.joaogabgr.backend.web.controllers.FamiliesController;

import com.joaogabgr.backend.application.services.families.InviteMemberToFamilyimpl;
import com.joaogabgr.backend.web.dto.families.InviteMemberToFamilyDTO;
import com.joaogabgr.backend.web.dto.web.ResponseModelDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/families")
public class InviteMemberToFamilyController {
    @Autowired
    private InviteMemberToFamilyimpl inviteMemberToFamilyImpl;

    @PostMapping("/inviteMemberToFamily")
    public ResponseEntity<ResponseModelDTO> inviteMemberToFamily(@RequestBody InviteMemberToFamilyDTO inviteMemberToFamilyDTO) throws SystemContextException {
        try {
            return ResponseEntity.ok(new ResponseModelDTO(inviteMemberToFamilyImpl.execute(inviteMemberToFamilyDTO)));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
