package com.joaogabgr.backend.web.controllers.FamiliesController;

import com.joaogabgr.backend.application.services.families.AcceptInviteMemberImpl;
import com.joaogabgr.backend.web.dto.web.ResponseModelDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/families")
public class AcceptInviteMemberController {
    @Autowired
    private AcceptInviteMemberImpl acceptInviteMember;

    @PostMapping("/acceptInviteMember/{inviteId}")
    public ResponseEntity<ResponseModelDTO> acceptInviteMember(@PathVariable String inviteId) throws SystemContextException {
        try {
            System.out.println(inviteId);
            acceptInviteMember.execute(inviteId);
            return ResponseEntity.ok(new ResponseModelDTO(true));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
