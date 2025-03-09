package com.joaogabgr.backend.web.controllers.FamiliesController;

import com.joaogabgr.backend.application.services.families.DeleteInviteImpl;
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
public class DeleteInviteMemberController {
    @Autowired
    private DeleteInviteImpl deleteInvite;

    @DeleteMapping("/deleteInvite/{inviteID}")
    public ResponseEntity<ResponseModelDTO> deleteInvite(@PathVariable String inviteID) throws SystemContextException {
        try {
            deleteInvite.execute(inviteID);
            return ResponseEntity.ok(new ResponseModelDTO("Invite deleted"));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
